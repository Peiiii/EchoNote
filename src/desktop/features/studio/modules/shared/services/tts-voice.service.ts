const MANDARIN_FEMALE_VOICES = [
  "Serena",
  "Maia",
  "Cherry",
  "Bella",
  "Mia",
  "Vivian",
] as const;

const MANDARIN_CUTE_FEMALE_VOICES = ["Cherry", "Bella", "Mia"] as const;

const MANDARIN_MALE_VOICES = ["Neil", "Ethan", "Kai", "Moon", "Andre"] as const;

function hashToUint32(input: string): number {
  let hash = 2166136261;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = t;
    x = Math.imul(x ^ (x >>> 15), x | 1);
    x ^= x + Math.imul(x ^ (x >>> 7), x | 61);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

function pickOne<T>(arr: readonly T[], rnd: () => number): T {
  return arr[Math.floor(rnd() * arr.length)]!;
}

export function resolvePodcastVoices(options: {
  seed: string;
  hostOverride?: string;
  guestOverride?: string;
}): { host: string; guest: string } {
  if (options.hostOverride && options.guestOverride) {
    return { host: options.hostOverride, guest: options.guestOverride };
  }

  const rnd = mulberry32(hashToUint32(options.seed));
  const host = options.hostOverride || pickOne(MANDARIN_FEMALE_VOICES, rnd);

  let guest = options.guestOverride || pickOne(MANDARIN_MALE_VOICES, rnd);
  if (guest === host) {
    guest = MANDARIN_MALE_VOICES.find((v) => v !== guest) || guest;
  }

  return { host, guest };
}

export function resolveAssistantVoice(options: {
  seed: string;
  override?: string;
  preferGender?: "female" | "male" | "any";
  style?: "cute" | "default";
}): string {
  if (options.override) return options.override;
  const rnd = mulberry32(hashToUint32(options.seed));
  const gender = options.preferGender || "any";
  const style = options.style || "default";
  const femalePool = style === "cute" ? MANDARIN_CUTE_FEMALE_VOICES : MANDARIN_FEMALE_VOICES;
  if (gender === "female") return pickOne(femalePool, rnd);
  if (gender === "male") return pickOne(MANDARIN_MALE_VOICES, rnd);
  return rnd() < 0.5 ? pickOne(femalePool, rnd) : pickOne(MANDARIN_MALE_VOICES, rnd);
}
