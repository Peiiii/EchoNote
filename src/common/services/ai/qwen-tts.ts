type QwenTtsInput = {
  text: string;
  voice: string;
  language_type?: string;
};

type QwenTtsRequestBody = { model: string; input: QwenTtsInput };

function splitTextIntoChunks(text: string, maxChars: number): string[] {
  const normalized = (text ?? "")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
  if (!normalized) return [];
  if (normalized.length <= maxChars) return [normalized];

  const chunks: string[] = [];
  let rest = normalized;
  const preferredBreakChars = ["\n", "。", "！", "？", ".", "!", "?", ";", "；"];

  while (rest.length > maxChars) {
    const window = rest.slice(0, maxChars);

    let cutLen = -1;
    for (const ch of preferredBreakChars) {
      const idx = window.lastIndexOf(ch);
      if (idx >= 0 && idx + 1 > cutLen) cutLen = idx + 1;
    }

    if (cutLen < Math.floor(maxChars * 0.55)) {
      const spaceIdx = window.lastIndexOf(" ");
      if (spaceIdx >= Math.floor(maxChars * 0.55)) cutLen = spaceIdx + 1;
    }

    if (cutLen <= 0) cutLen = maxChars;
    const piece = rest.slice(0, cutLen).trim();
    if (piece) chunks.push(piece);
    rest = rest.slice(cutLen).trim();
  }

  if (rest) chunks.push(rest);
  return chunks;
}

async function qwenTtsSingle(options: {
  text: string;
  voice: string;
  languageType?: string;
  model?: string;
}): Promise<ArrayBuffer> {
  const proxyBase = (import.meta.env.VITE_AI_PROXY_BASE as string | undefined) || "";
  if (!proxyBase) {
    throw new Error("AI proxy base missing: VITE_AI_PROXY_BASE");
  }

  const url = `${proxyBase.replace(/\/+$/, "")}/tts`;
  const model =
    options.model ||
    (import.meta.env.VITE_DASHSCOPE_TTS_MODEL as string | undefined) ||
    "qwen3-tts-flash";

  const body: QwenTtsRequestBody = {
    model,
    input: {
      text: options.text,
      voice: options.voice,
      language_type: options.languageType,
    },
  };

  const resp = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (resp.ok) return await resp.arrayBuffer();

  const ct = resp.headers.get("content-type") || "";
  if (ct.includes("application/json")) {
    const data = (await resp.json().catch(() => null)) as unknown;
    const record =
      typeof data === "object" && data !== null ? (data as Record<string, unknown>) : null;
    const message =
      typeof record?.error === "string"
        ? record.error
        : typeof record?.message === "string"
          ? record.message
          : "";
    throw new Error(message ? `[tts] ${message}` : `[tts] HTTP ${resp.status}`);
  }
  throw new Error(`[tts] HTTP ${resp.status}`);
}

export async function qwenTtsToArrayBuffers(options: {
  text: string;
  voice: string;
  languageType?: string;
  model?: string;
  maxChars?: number;
}): Promise<ArrayBuffer[]> {
  const envMaxChars = Number(
    import.meta.env.VITE_DASHSCOPE_TTS_MAX_CHARS as string | undefined
  );
  const maxChars =
    options.maxChars ??
    (Number.isFinite(envMaxChars) && envMaxChars > 0 ? envMaxChars : 600);

  const chunks = splitTextIntoChunks(options.text, Math.max(50, maxChars));
  const out: ArrayBuffer[] = [];
  for (const chunk of chunks) {
    out.push(
      await qwenTtsSingle({
        text: chunk,
        voice: options.voice,
        languageType: options.languageType,
        model: options.model,
      })
    );
  }
  return out;
}
