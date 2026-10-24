import constants from '../../../shared/constants.json';

const BANNED_WORDS = (constants as any).banned_words || ['scam', 'fraud', 'fake', 'cheat'];

export interface ValidationResult {
  ok: boolean;
  code?: string;
  message?: string;
}

/**
 * Validates user-pasted listing URLs against allowlisted rental portals.
 */
export function validateListingInput(rawUrl: string): ValidationResult {
  if (!rawUrl || typeof rawUrl !== 'string') {
    return { ok: false, code: 'INVALID_URL', message: 'Please enter a rental listing URL.' };
  }

  const trimmed = rawUrl.trim();
  if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
    return { ok: false, code: 'INVALID_URL', message: 'URL must begin with http:// or https://' };
  }

  try {
    const parsed = new URL(trimmed);
    const domain = parsed.hostname.toLowerCase();

    const portals = (constants as any).portals || [];
    const isSupported = portals.some((p: any) =>
      p.domains?.some((d: string) => domain.includes(d))
    );

    if (!isSupported) {
      const allowedNames = portals.map((p: any) => p.display_name).join(', ');
      return {
        ok: false,
        code: 'UNSUPPORTED_PORTAL',
        message: `Supported Delhi NCR portals: ${allowedNames}`,
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, code: 'INVALID_URL', message: 'Please enter a valid listing web address.' };
  }
}

/**
 * Detects if a text string contains prohibited non-neutral words.
 */
export function findBannedWords(text: string): string[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  return BANNED_WORDS.filter((word: string) => lower.includes(word));
}

/**
 * Sanitizes copy to maintain a high-trust, objective tone.
 */
export function sanitizeNeutralText(text: string): string {
  if (!text) return '';
  let clean = text;

  // Replace banned words with neutral evidence terminology
  clean = clean.replace(/scam/gi, 'observed discrepancy');
  clean = clean.replace(/fraud/gi, 'unverified listing');
  clean = clean.replace(/fake/gi, 'unconfirmed listing');
  clean = clean.replace(/cheat/gi, 'misaligned quote');

  return clean;
}