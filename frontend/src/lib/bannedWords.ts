const BANNED_WORDS = ["scam", "fraud", "fake", "cheat"];

export function findBannedWords(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return BANNED_WORDS.filter((word) => lower.includes(word));
}

export function assertNoBannedWords(text: string): boolean {
  const found = findBannedWords(text);
  if (found.length > 0) {
    console.warn(`[ProofRent Policy Warning] Found banned words in UI text: ${found.join(", ")}`);
    return false;
  }
  return true;
}