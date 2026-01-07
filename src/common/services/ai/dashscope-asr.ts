import { decodeAudioArrayBuffer, encodeWav } from "@/common/utils/audio/audio-utils";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");
  await new Promise<void>((resolve, reject) => {
    let done = false;
    const onAbort = () => {
      cleanup();
      reject(new DOMException("Aborted", "AbortError"));
    };
    const cleanup = () => {
      if (done) return;
      done = true;
      clearTimeout(t);
      signal?.removeEventListener("abort", onAbort);
    };

    const t = setTimeout(() => {
      cleanup();
      resolve();
    }, ms);

    signal?.addEventListener("abort", onAbort);
  });
}

async function transcodeBlobToWav16kMono(blob: Blob, signal?: AbortSignal): Promise<Blob> {
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const inputArrayBuffer = await blob.arrayBuffer();
  if (signal?.aborted) throw new DOMException("Aborted", "AbortError");

  const decodeCtx = new AudioContext();
  try {
    const decoded = await decodeAudioArrayBuffer(decodeCtx, inputArrayBuffer);
    const targetSampleRate = 16000;
    const length = Math.max(1, Math.ceil(decoded.duration * targetSampleRate));
    const offline = new OfflineAudioContext(1, length, targetSampleRate);

    const src = offline.createBufferSource();
    src.buffer = decoded;
    // Downmix happens automatically when connecting to a mono destination.
    src.connect(offline.destination);
    src.start(0);

    const rendered = await offline.startRendering();
    return encodeWav(rendered);
  } finally {
    try {
      await decodeCtx.close();
    } catch {
      // ignore
    }
  }
}

function fileNameForBlob(blob: Blob): string {
  const type = (blob.type || "").toLowerCase();
  if (type.includes("wav")) return "speech.wav";
  if (type.includes("mp4")) return "speech.m4a";
  if (type.includes("mpeg") || type.includes("mp3")) return "speech.mp3";
  if (type.includes("ogg")) return "speech.ogg";
  if (type.includes("webm")) return "speech.webm";
  return "speech.bin";
}

export async function dashscopeTranscribe(options: {
  blob: Blob;
  signal?: AbortSignal;
}): Promise<string> {
  const proxyBase = (import.meta.env.VITE_AI_PROXY_BASE as string | undefined) || "";
  if (!proxyBase) {
    throw new Error("AI proxy base missing: VITE_AI_PROXY_BASE");
  }

  const base = proxyBase.replace(/\/+$/, "");
  let file: File;
  try {
    const wavBlob = await transcodeBlobToWav16kMono(options.blob, options.signal);
    file = new File([wavBlob], "speech.wav", { type: "audio/wav" });
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err;
    // Some environments can't decode MediaRecorder output (e.g. missing WebM/Opus decoding).
    // Fall back to uploading the original recording; DashScope will decode on the server side if supported.
    const name = fileNameForBlob(options.blob);
    file = new File([options.blob], name, { type: options.blob.type || "application/octet-stream" });
  }

  const fd = new FormData();
  fd.append("file", file);

  const startResp = await fetch(`${base}/asr`, {
    method: "POST",
    body: fd,
    signal: options.signal,
  });
  const startJson = (await startResp.json().catch(() => null)) as unknown;
  if (!startResp.ok) {
    const msg = isRecord(startJson) && typeof startJson.error === "string"
      ? startJson.error
      : `ASR start failed: HTTP ${startResp.status}`;
    throw new Error(msg);
  }

  const taskId =
    isRecord(startJson) && typeof startJson.taskId === "string" ? startJson.taskId : "";
  if (!taskId) throw new Error("ASR start failed: missing taskId");

  const deadlineMs = Date.now() + 45_000;
  while (Date.now() < deadlineMs) {
    const pollResp = await fetch(`${base}/asr/${encodeURIComponent(taskId)}`, {
      method: "GET",
      signal: options.signal,
    });
    const pollJson = (await pollResp.json().catch(() => null)) as unknown;
    if (!pollResp.ok) {
      throw new Error(`ASR poll failed: HTTP ${pollResp.status}`);
    }

    const status = isRecord(pollJson) && typeof pollJson.status === "string" ? pollJson.status : "";
    if (status === "succeeded") {
      const text = isRecord(pollJson) && typeof pollJson.text === "string" ? pollJson.text.trim() : "";
      if (text) return text;
      throw new Error("ASR succeeded but returned empty text");
    }

    await sleep(700, options.signal);
  }

  throw new Error("ASR timed out");
}
