import { useState } from 'react';
import { validateListingInput } from '../../lib/validators';

interface ListingInputProps {
  onSubmit: (url: string) => void;
  busy?: boolean;
}

export function ListingInput({ onSubmit, busy = false }: ListingInputProps) {
  const [url, setUrl] = useState('https://www.housing.com/pg/sunrise-pg-koramangala-560034');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateListingInput(url);
    if (!result.ok) {
      setError(result.message || 'Please enter a valid listing URL');
      return;
    }
    setError(null);
    onSubmit(url.trim());
  };

  const handlePreset = (sampleUrl: string) => {
    setUrl(sampleUrl);
    setError(null);
  };

  return (
    <div className="w-full space-y-3">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 bg-white rounded-full border-2 border-[#F4EFEA] focus-within:border-[#B80D1D] focus-within:ring-4 focus-within:ring-[#B80D1D]/10 p-1.5 pl-5 shadow-card transition-all"
      >
        <span className="text-[#B80D1D] text-base shrink-0">🔗</span>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          required
          placeholder="Paste a Housing.com, MagicBricks or NoBroker link..."
          disabled={busy}
          className="flex-1 min-w-0 bg-transparent text-[#1A261C] placeholder-[#1A261C]/40 font-medium text-sm outline-none disabled:opacity-70"
        />
        <button
          type="submit"
          disabled={busy}
          className="shrink-0 px-6 py-3 rounded-full bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#8B0000] hover:from-[#8B0000] hover:to-[#5A0000] text-white font-bold text-sm shadow-red-glow transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
        >
          {busy ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analysing...</span>
            </>
          ) : (
            <>
              <span>Analyse Listing</span>
              <span>→</span>
            </>
          )}
        </button>
      </form>

      {error && (
        <p className="text-xs text-[#B80D1D] font-semibold pl-3 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[#1A261C]/55 pl-3">
        <span className="font-semibold text-[#1A261C]/40">Popular portals:</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.housing.com/pg/sunrise-pg-koramangala-560034')}
          className="hover:text-[#B80D1D] underline decoration-[#E9DEC3] transition-colors"
        >
          Housing.com
        </button>
        <button
          type="button"
          onClick={() => handlePreset('https://www.magicbricks.com/pg-in-bangalore-ppp-id-99812')}
          className="hover:text-[#B80D1D] underline decoration-[#E9DEC3] transition-colors"
        >
          MagicBricks
        </button>
        <button
          type="button"
          onClick={() => handlePreset('https://www.nobroker.in/pg-sunrise-koramangala')}
          className="hover:text-[#B80D1D] underline decoration-[#E9DEC3] transition-colors"
        >
          NoBroker
        </button>
      </div>
    </div>
  );
}