export function computeNoteHash(content: string): string {
  // Lightweight deterministic hash for note content so we can detect base versions locally
  let hash = 0;
  for (let i = 0; i < content.length; i += 1) {
    hash = Math.imul(31, hash) + content.charCodeAt(i);
    hash |= 0; // force 32-bit integer
  }
  const unsigned = hash >>> 0;
  return unsigned.toString(16).padStart(8, "0");
}
