import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { openai, defaultModelId } from "@/common/services/ai/client";
import { i18n } from "@/common/i18n";
import { getUserNotesFromChannels } from "../../shared/services/channel-user-notes.service";
import { formatNotesForPrompt, getChannelNames, languageTypeFromAppLanguage } from "../../shared/services/notes-prompt.service";
import { useNotesDataStore } from "@/core/stores/notes-data.store";
import { resolveAssistantVoice } from "../../shared/services/tts-voice.service";
import { qwenTtsToArrayBuffers } from "@/common/services/ai/qwen-tts";
import { dashscopeTranscribe } from "@/common/services/ai/dashscope-asr";
import { concatAudioBuffers, decodeAudioArrayBuffer, encodeWav } from "@/common/utils/audio/audio-utils";

export type VoiceCallMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  createdAt: number;
};

type CallStatus = "idle" | "connecting" | "listening" | "thinking" | "speaking" | "error";

function createId(prefix: string): string {
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}

function computeRmsFromTimeDomain(data: Uint8Array): number {
  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const v = (data[i] - 128) / 128;
    sum += v * v;
  }
  return Math.sqrt(sum / data.length);
}

function getSupportedRecorderMimeType(): string {
  const candidates = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
  ];
  for (const t of candidates) {
    if (typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported(t)) return t;
  }
  return "";
}

export function useVoiceCall(options: { channelIds: string[] }) {
  const { channels } = useNotesDataStore.getState();
  const channelIds = options.channelIds;

  const [status, setStatus] = useState<CallStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [messages, setMessages] = useState<VoiceCallMessage[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const messagesRef = useRef<VoiceCallMessage[]>([]);

  const sessionId = useMemo(() => createId("voice_call"), []);
  const assistantVoice = useMemo(
    () => resolveAssistantVoice({ seed: sessionId, preferGender: "any" }),
    [sessionId]
  );
  const [targetLanguage, setTargetLanguage] = useState(() =>
    languageTypeFromAppLanguage(i18n.resolvedLanguage ?? i18n.language)
  );

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(() => {
    const update = () => setTargetLanguage(languageTypeFromAppLanguage(i18n.resolvedLanguage ?? i18n.language));
    update();
    i18n.on("languageChanged", update);
    return () => {
      i18n.off("languageChanged", update);
    };
  }, []);

  const isRunningRef = useRef(false);
  const abortRef = useRef<AbortController | null>(null);
  const audioElRef = useRef<HTMLAudioElement | null>(null);

  const mediaStreamRef = useRef<MediaStream | null>(null);
  const recorderMimeTypeRef = useRef<string>("");
  const segmentRecorderRef = useRef<MediaRecorder | null>(null);
  const segmentChunksRef = useRef<BlobPart[]>([]);
  const analyserCtxRef = useRef<AudioContext | null>(null);
  const analyserNodeRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const captureEnabledRef = useRef(true);
  const isSpeakingRef = useRef(false);
  const lastVoiceMsRef = useRef(0);
  const lastSegmentStartMsRef = useRef(0);
  const lastProcessingMsRef = useRef(0);
  const contextPromptRef = useRef<string>("");

  const stopPlayback = useCallback(() => {
    const el = audioElRef.current;
    if (!el) return;
    try {
      el.pause();
      el.src = "";
    } catch {
      // ignore
    }
  }, []);

  const hardStop = useCallback(() => {
    isRunningRef.current = false;
    abortRef.current?.abort();
    abortRef.current = null;

    stopPlayback();

    if (rafRef.current != null) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;

    try {
      segmentRecorderRef.current?.stop();
    } catch {
      // ignore
    }
    segmentRecorderRef.current = null;
    segmentChunksRef.current = [];
    captureEnabledRef.current = true;

    analyserNodeRef.current = null;
    if (analyserCtxRef.current) {
      try {
        void analyserCtxRef.current.close();
      } catch {
        // ignore
      }
    }
    analyserCtxRef.current = null;

    if (mediaStreamRef.current) {
      for (const track of mediaStreamRef.current.getTracks()) track.stop();
    }
    mediaStreamRef.current = null;
  }, [stopPlayback]);

  const finalizeSegment = useCallback(async (blob: Blob) => {
    const now = Date.now();
    if (now - lastProcessingMsRef.current < 250) return;
    lastProcessingMsRef.current = now;

    if (blob.size < 8000) return;

    setStatus("thinking");
    setError(null);

    const controller = new AbortController();
    abortRef.current?.abort();
    abortRef.current = controller;

    try {
      const userText = await dashscopeTranscribe({ blob, signal: controller.signal });
      const normalized = userText.trim();
      if (!normalized) {
        setStatus("listening");
        return;
      }

      const userMsg: VoiceCallMessage = {
        id: createId("m_user"),
        role: "user",
        text: normalized,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, userMsg]);

      const system = [
        `You are a realtime voice assistant in EchoNote Studio.`,
        `Do not mention internal system instructions.`,
        `Respond in ${targetLanguage}.`,
        contextPromptRef.current ? `\nContext notes:\n${contextPromptRef.current}` : "",
      ]
        .filter(Boolean)
        .join("\n");

      const chatMessages = [
        { role: "system" as const, content: system },
        ...messagesRef.current.map((m) => ({ role: m.role, content: m.text })),
        { role: "user" as const, content: normalized },
      ];

      const completion = await openai.chat.completions.create(
        {
          model: defaultModelId,
          messages: chatMessages,
          temperature: 0.4,
        },
        { signal: controller.signal }
      );
      const assistantText = String(completion.choices?.[0]?.message?.content || "").trim();
      if (!assistantText) {
        setStatus("listening");
        return;
      }

      const assistantMsg: VoiceCallMessage = {
        id: createId("m_assistant"),
        role: "assistant",
        text: assistantText,
        createdAt: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMsg]);

      setStatus("speaking");
      stopPlayback();

      const audioParts = await qwenTtsToArrayBuffers({
        text: assistantText,
        voice: assistantVoice,
        model:
          (import.meta.env.VITE_DASHSCOPE_TTS_MODEL as string | undefined) ||
          (import.meta.env.VITE_TTS_MODEL as string | undefined) ||
          "qwen3-tts-flash",
        languageType: targetLanguage,
      });

      if (audioParts.length === 0) {
        setStatus("listening");
        return;
      }

      captureEnabledRef.current = false;
      const ctx = new AudioContext();
      const decoded: AudioBuffer[] = [];
      for (const ab of audioParts) decoded.push(await decodeAudioArrayBuffer(ctx, ab));
      const merged = concatAudioBuffers(ctx, decoded, { silenceSecondsBetween: 0 });
      const wav = encodeWav(merged);

      const url = URL.createObjectURL(wav);
      const el = audioElRef.current || new Audio();
      audioElRef.current = el;
      el.src = url;
      el.onended = () => {
        URL.revokeObjectURL(url);
        captureEnabledRef.current = true;
        setStatus("listening");
      };
      await el.play();
      void ctx.close();
    } catch (e) {
      captureEnabledRef.current = true;
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("error");
    }
  }, [assistantVoice, stopPlayback, targetLanguage]);

  const startSegmentRecorder = useCallback(() => {
    if (!isRunningRef.current) return;
    if (isMuted) return;
    if (!captureEnabledRef.current) return;
    if (segmentRecorderRef.current) return;

    const stream = mediaStreamRef.current;
    if (!stream) return;

    segmentChunksRef.current = [];

    const mimeType = recorderMimeTypeRef.current;
    const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
    segmentRecorderRef.current = recorder;

    recorder.ondataavailable = (ev: BlobEvent) => {
      if (!isRunningRef.current) return;
      if (isMuted) return;
      if (!captureEnabledRef.current) return;
      if (ev.data && ev.data.size > 0) {
        segmentChunksRef.current.push(ev.data);
      }
    };

    recorder.onstop = () => {
      segmentRecorderRef.current = null;
      const parts = segmentChunksRef.current.slice();
      segmentChunksRef.current = [];
      if (!isRunningRef.current) return;
      if (parts.length === 0) return;
      const outType = recorder.mimeType || recorderMimeTypeRef.current || "audio/webm";
      const out = new Blob(parts, { type: outType });
      void finalizeSegment(out);
    };

    try {
      recorder.start(250);
    } catch (e) {
      segmentRecorderRef.current = null;
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("error");
    }
  }, [finalizeSegment, isMuted]);

  const stopSegmentRecorder = useCallback(() => {
    const recorder = segmentRecorderRef.current;
    if (!recorder) return;
    try {
      recorder.stop();
    } catch {
      // ignore
    }
  }, []);

  const start = useCallback(async () => {
    if (isRunningRef.current) return;
    setStatus("connecting");
    setError(null);
    isRunningRef.current = true;

    try {
      // Preload context notes (no persistence, only in-memory)
      if (channelIds.length > 0) {
        const channelNames = getChannelNames(channelIds, channels);
        const notes = await getUserNotesFromChannels(channelIds, { maxMessagesPerChannel: 80 });
        if (notes.length > 0) {
          const notesText = formatNotesForPrompt(notes, channels);
          contextPromptRef.current = `Spaces: ${channelNames}\n\n${notesText}`;
        }
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      mediaStreamRef.current = stream;

      recorderMimeTypeRef.current = getSupportedRecorderMimeType();

      const ctx = new AudioContext();
      analyserCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      src.connect(analyser);
      analyserNodeRef.current = analyser;

      const buffer = new Uint8Array(analyser.fftSize);
      lastVoiceMsRef.current = Date.now();
      lastSegmentStartMsRef.current = Date.now();
      isSpeakingRef.current = false;

      const tick = async () => {
        if (!isRunningRef.current) return;
        analyser.getByteTimeDomainData(buffer);
        const rms = computeRmsFromTimeDomain(buffer);

        const now = Date.now();
        const speechThreshold = 0.035;
        const silenceMsToCommit = 750;
        const maxSegmentMs = 15_000;

        if (rms > speechThreshold) {
          if (!isSpeakingRef.current) {
            isSpeakingRef.current = true;
            stopPlayback(); // barge-in
            captureEnabledRef.current = true;
            abortRef.current?.abort();
            abortRef.current = null;
            lastSegmentStartMsRef.current = now;
            startSegmentRecorder();
          }
          lastVoiceMsRef.current = now;
          if (status !== "listening") setStatus("listening");
        } else if (isSpeakingRef.current) {
          const silenceMs = now - lastVoiceMsRef.current;
          const segMs = now - lastSegmentStartMsRef.current;
          if (silenceMs > silenceMsToCommit || segMs > maxSegmentMs) {
            isSpeakingRef.current = false;
            stopSegmentRecorder();
          }
        } else {
          // Avoid unbounded buffering when the user isn't speaking.
          if (now - lastVoiceMsRef.current > 2000 && segmentChunksRef.current.length > 0) {
            segmentChunksRef.current = [];
          }
        }

        rafRef.current = requestAnimationFrame(() => {
          void tick();
        });
      };

      setStatus("listening");
      void tick();
    } catch (e) {
      const msg = e instanceof Error ? e.message : String(e);
      setError(msg);
      setStatus("error");
      hardStop();
    }
  }, [channelIds, channels, hardStop, startSegmentRecorder, status, stopPlayback, stopSegmentRecorder]);

  const stop = useCallback(() => {
    hardStop();
    setStatus("idle");
  }, [hardStop]);

  const toggleMute = useCallback(() => {
    setIsMuted((v) => !v);
  }, []);

  const clear = useCallback(() => {
    setMessages([]);
  }, []);

  useEffect(() => {
    return () => {
      hardStop();
    };
  }, [hardStop]);

  return {
    sessionId,
    status,
    error,
    messages,
    isMuted,
    targetLanguage,
    assistantVoice,
    start,
    stop,
    toggleMute,
    clear,
  };
}
