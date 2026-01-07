export function encodeWav(audioBuffer: AudioBuffer): Blob {
  const numChannels = audioBuffer.numberOfChannels;
  const sampleRate = audioBuffer.sampleRate;
  const numFrames = audioBuffer.length;

  // 16-bit PCM
  const bytesPerSample = 2;
  const blockAlign = numChannels * bytesPerSample;
  const byteRate = sampleRate * blockAlign;
  const dataSize = numFrames * blockAlign;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  let offset = 0;
  const writeString = (s: string) => {
    for (let i = 0; i < s.length; i++) {
      view.setUint8(offset + i, s.charCodeAt(i));
    }
    offset += s.length;
  };
  const writeUint32 = (v: number) => {
    view.setUint32(offset, v, true);
    offset += 4;
  };
  const writeUint16 = (v: number) => {
    view.setUint16(offset, v, true);
    offset += 2;
  };

  writeString("RIFF");
  writeUint32(36 + dataSize);
  writeString("WAVE");
  writeString("fmt ");
  writeUint32(16);
  writeUint16(1); // PCM
  writeUint16(numChannels);
  writeUint32(sampleRate);
  writeUint32(byteRate);
  writeUint16(blockAlign);
  writeUint16(16); // bits per sample
  writeString("data");
  writeUint32(dataSize);

  // Interleave channels
  const channels: Float32Array[] = [];
  for (let ch = 0; ch < numChannels; ch++) {
    channels.push(audioBuffer.getChannelData(ch));
  }

  for (let i = 0; i < numFrames; i++) {
    for (let ch = 0; ch < numChannels; ch++) {
      let sample = channels[ch][i] ?? 0;
      sample = Math.max(-1, Math.min(1, sample));
      const int16 = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
      view.setInt16(offset, int16, true);
      offset += 2;
    }
  }

  return new Blob([buffer], { type: "audio/wav" });
}

export async function decodeAudioArrayBuffer(
  ctx: AudioContext,
  data: ArrayBuffer
): Promise<AudioBuffer> {
  const copied = data.slice(0);
  return await new Promise<AudioBuffer>((resolve, reject) => {
    ctx.decodeAudioData(
      copied,
      (buffer) => resolve(buffer),
      (err) => reject(err)
    );
  });
}

export function concatAudioBuffers(
  ctx: AudioContext,
  buffers: AudioBuffer[],
  options?: { silenceSecondsBetween?: number }
): AudioBuffer {
  const silenceSecondsBetween = options?.silenceSecondsBetween ?? 0.25;
  const sampleRate = ctx.sampleRate;
  const numChannels = Math.max(1, ...buffers.map((b) => b.numberOfChannels));

  const silenceFrames = Math.floor(silenceSecondsBetween * sampleRate);
  const totalFrames =
    buffers.reduce((sum, b) => sum + b.length, 0) +
    Math.max(0, buffers.length - 1) * silenceFrames;

  const out = ctx.createBuffer(numChannels, totalFrames, sampleRate);

  let writeOffset = 0;
  for (let idx = 0; idx < buffers.length; idx++) {
    const b = buffers[idx];
    for (let ch = 0; ch < numChannels; ch++) {
      const outCh = out.getChannelData(ch);
      const src =
        ch < b.numberOfChannels ? b.getChannelData(ch) : b.getChannelData(0);
      outCh.set(src, writeOffset);
    }
    writeOffset += b.length;
    if (idx < buffers.length - 1 && silenceFrames > 0) {
      writeOffset += silenceFrames;
    }
  }

  return out;
}

