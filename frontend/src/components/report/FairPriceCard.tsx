import type { FairPriceResult } from '../../types/api';

export function FairPriceCard({ result }: { result: FairPriceResult }) {
  if (!result) return null;
  const rupees = (n: number | null) => (n == null ? '—' : `₹${n.toLocaleString('en-IN')}`);

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display font-extrabold text-lg text-[#1A261C]">Fair Price Check</h3>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1A261C] text-white capitalize">
          {result.status === 'ok' ? `${result.position} median` : 'Not enough data'}
        </span>
      </div>
      {result.status === 'ok' && (
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
            <span className="text-[10px] font-mono uppercase text-[#1A261C]/50 block">This listing</span>
            <div className="font-display text-2xl font-extrabold">{rupees(result.listing_rent)}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E9DEC3]">
            <span className="text-[10px] font-mono uppercase text-[#B80D1D] block">Median of {result.comparable_count} listings</span>
            <div className="font-display text-2xl font-extrabold text-[#B80D1D]">{rupees(result.median_rent)}</div>
          </div>
        </div>
      )}
      <p className="text-xs text-[#1A261C]/80">{result.message}</p>
    </div>
  );
}