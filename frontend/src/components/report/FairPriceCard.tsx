import type { FairPriceResult } from '../../types/api';

function formatRupees(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `₹${n.toLocaleString('en-IN')}`;
}

interface FairPriceCardProps {
  result: FairPriceResult;
}

export function FairPriceCard({ result }: FairPriceCardProps) {
  if (!result) return null;

  const res = result as any;
  const verdict = res?.verdict || res?.status || res?.assessment;
  const isOverpriced = verdict === 'overpriced';
  const isFair = verdict === 'fair' || verdict === 'great_deal';

  const statedRent = res?.stated_rent ?? res?.rent;
  const fairMin = res?.fair_min ?? res?.min_fair_price ?? res?.fair_price_min;
  const fairMax = res?.fair_max ?? res?.max_fair_price ?? res?.fair_price_max;

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 shadow-sm space-y-4">
      {/* Top Header */}
      <div className="flex items-center justify-between gap-2 flex-wrap pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/60">
            Fair Market Value Estimate
          </span>
          <h3 className="text-base font-bold text-[#1A261C]">
            Fair Price Analysis
          </h3>
        </div>

        {verdict && (
          <span
            className={`text-xs font-bold px-3 py-1 rounded-full capitalize ${
              isOverpriced
                ? 'bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/30'
                : isFair
                ? 'bg-[#1A261C]/10 text-[#1A261C] border border-[#1A261C]/30'
                : 'bg-[#F4EFEA] text-[#1A261C]'
            }`}
          >
            {String(verdict).replace('_', ' ')}
          </span>
        )}
      </div>

      {/* Main Rent Comparison Grid */}
      <div className="grid grid-cols-2 gap-3 bg-white p-3.5 rounded-lg border border-[#F4EFEA]">
        <div>
          <span className="text-[10px] uppercase font-bold text-[#1A261C]/60 block">
            Stated Rent
          </span>
          <span className="text-base font-extrabold text-[#1A261C]">
            {formatRupees(statedRent)}
          </span>
        </div>

        <div>
          <span className="text-[10px] uppercase font-bold text-[#B80D1D] block">
            Estimated Fair Range
          </span>
          <span className="text-base font-extrabold text-[#B80D1D]">
            {formatRupees(fairMin)} – {formatRupees(fairMax)}
          </span>
        </div>
      </div>

      {/* Explanation / Reasoning */}
      {res?.message && (
        <p className="text-xs text-[#1A261C] leading-relaxed">
          {res.message}
        </p>
      )}

      {/* Confidence Indicator */}
      {res?.confidence && (
        <div className="flex items-center justify-between text-[11px] text-[#1A261C]/70 bg-[#F4EFEA]/50 px-3 py-1.5 rounded-md">
          <span>Model Confidence</span>
          <span className="font-semibold capitalize text-[#1A261C]">
            {String(res.confidence)}
          </span>
        </div>
      )}
    </div>
  );
}