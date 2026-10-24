import type { FairPriceResult } from '../../types/api';

interface FairPriceCardProps {
  result: FairPriceResult;
}

export function FairPriceCard({ result }: FairPriceCardProps) {
  if (!result) return null;

  const res = result as any;
  const verdict = res.verdict || 'fair';
  const statedRent = res.stated_rent || res.statedRent || 0;
  const fairMin = res.fair_min || res.fairMin || 0;
  const fairMax = res.fair_max || res.fairMax || 0;
  const message = res.message || '';

  const verdictStyles =
    verdict === 'overpriced'
      ? { badgeBg: 'bg-[#B80D1D]', text: 'Overpriced vs Market', badgeText: 'text-white' }
      : verdict === 'great_deal'
      ? { badgeBg: 'bg-emerald-600', text: 'Great Deal', badgeText: 'text-white' }
      : { badgeBg: 'bg-[#1A261C]', text: 'Fair Price', badgeText: 'text-white' };

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Algorithmic Benchmark
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
            Fair Market Valuation
          </h3>
        </div>
        <span
          className={`text-xs font-bold px-3 py-1 rounded-full shadow-sm ${verdictStyles.badgeBg} ${verdictStyles.badgeText}`}
        >
          {verdictStyles.text}
        </span>
      </div>

      {/* Price Comparison Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50 block">
            Stated Rent Quote
          </span>
          <div className="font-display text-2xl font-extrabold text-[#1A261C] mt-1">
            ₹{Number(statedRent).toLocaleString('en-IN')}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#E9DEC3]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D] block">
            Estimated Fair Range
          </span>
          <div className="font-display text-lg font-extrabold text-[#B80D1D] mt-1">
            ₹{Number(fairMin).toLocaleString('en-IN')} – ₹{Number(fairMax).toLocaleString('en-IN')}
          </div>
        </div>
      </div>

      {/* Message */}
      {message && (
        <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <span className="text-base shrink-0">💡</span>
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {message}
          </p>
        </div>
      )}
    </div>
  );
}