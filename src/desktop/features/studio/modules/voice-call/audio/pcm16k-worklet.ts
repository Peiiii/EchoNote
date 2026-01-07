type EnableMessage = { type: "enable"; enabled: boolean };

const FRAME_SAMPLES = 320; // 20ms @ 16kHz

class PCM16kWorkletProcessor extends AudioWorkletProcessor {
  private enabled = false;
  private pending: number[] = [];

  constructor() {
    super();
    this.port.onmessage = (ev: MessageEvent) => {
      const data = ev.data as EnableMessage | null;
      if (!data || typeof data !== "object") return;
      if (data.type === "enable") {
        this.enabled = !!data.enabled;
        if (!this.enabled) this.pending = [];
      }
    };
  }

  process(inputs: Float32Array[][]): boolean {
    if (!this.enabled) return true;

    const input0 = inputs[0];
    if (!input0 || input0.length === 0) return true;

    // Downmix to mono by taking channel 0 (browser echoCancellation already helps).
    const ch0 = input0[0];
    if (!ch0 || ch0.length === 0) return true;

    for (let i = 0; i < ch0.length; i++) {
      const v = Math.max(-1, Math.min(1, ch0[i] ?? 0));
      const s = v < 0 ? v * 0x8000 : v * 0x7fff;
      this.pending.push(s);
    }

    while (this.pending.length >= FRAME_SAMPLES) {
      const frame = new Int16Array(FRAME_SAMPLES);
      for (let i = 0; i < FRAME_SAMPLES; i++) {
        frame[i] = this.pending[i] ?? 0;
      }
      this.pending.splice(0, FRAME_SAMPLES);
      this.port.postMessage(frame.buffer, [frame.buffer]);
    }

    return true;
  }
}

registerProcessor("pcm16k", PCM16kWorkletProcessor);

