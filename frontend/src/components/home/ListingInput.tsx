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
      <form onSubmit={handleSubmit} className="relative max-w-2xl flex items-center">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="text-[#B80D1D] text-sm">🔗</span>
          </div>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="Paste Housing.com, MagicBricks, or NoBroker URL..."
            disabled={busy}
            className="w-full pl-11 pr-36 py-4 rounded-2xl bg-white text-[#1A261C] placeholder-[#1A261C]/40 font-medium text-sm border-2 border-[#F4EFEA] focus:border-[#B80D1D] focus:ring-4 focus:ring-[#B80D1D]/10 shadow-sm transition-all outline-none disabled:opacity-70"
          />
        </div>

        <button
          type="submit"
          disabled={busy}
          className="absolute right-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#8B0000] hover:from-[#8B0000] hover:to-[#5A0000] text-white font-bold text-sm shadow-red-glow hover:shadow-lg transition-all flex items-center gap-2 disabled:opacity-70 active:scale-95"
        >
          {busy ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing...</span>
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
        <p className="text-xs text-[#B80D1D] font-semibold pl-2 flex items-center gap-1">
          <span>⚠️</span> {error}
        </p>
      )}

      {/* Quick Links below search */}
      <div className="flex items-center gap-3 text-xs text-[#1A261C]/60 pt-1">
        <span className="font-semibold text-[#1A261C]/40">Popular Sample URLs:</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.housing.com/pg/sunrise-pg-koramangala-560034')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          Housing.com
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.magicbricks.com/pg-in-bangalore-ppp-id-99812')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          MagicBricks
        </button>
        <span>•</span>
        <button
          type="button"
          onClick={() => handlePreset('https://www.nobroker.in/pg-sunrise-koramangala')}
          className="hover:text-[#B80D1D] underline decoration-[#F4EFEA] transition-colors"
        >
          NoBroker
        </button>
      </div>
    </div>
  );
}