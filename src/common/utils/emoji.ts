// Small curated set of neutral emojis for channels.
// Keep it stable and safe across platforms (avoid complex ZWJ sequences).
const EMOJI_POOL = [
  '💡', '📝', '📌', '📚', '🧠', '✨', '📁', '📒', '📓', '🗂️', '🌟', '🧩', '🗒️', '📎', '🗳️', '🎯'
];

// Generate a random emoji; caller can provide a seed for deterministic pick.
export function getRandomEmoji(seed?: number): string {
  if (typeof seed === 'number' && Number.isFinite(seed)) {
    const idx = Math.abs(Math.floor(seed)) % EMOJI_POOL.length;
    return EMOJI_POOL[idx];
  }
  const idx = Math.floor(Math.random() * EMOJI_POOL.length);
  return EMOJI_POOL[idx];
}

export function getDeterministicEmojiFromString(input: string): string {
  // Simple hash to map string to a consistent index in the pool
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0; // keep in 32-bit range
  }
  const idx = Math.abs(hash) % EMOJI_POOL.length;
  return EMOJI_POOL[idx];
}

