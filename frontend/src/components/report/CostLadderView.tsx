import type { CostLadder, ListingFields, SourceRef } from '../../types/api';
import { CostStep } from './CostStep';

interface CostLadderViewProps {
  ladder: CostLadder;
  listing?: ListingFields | null;
  onOpenEvidence?: (source: SourceRef) => void;
}

const rupees = (n: number | null | undefined) => (n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`);

export function CostLadderView({ ladder, listing, onOpenEvidence }: CostLadderViewProps) {
  if (!ladder) return null;

  const lad = ladder as any;
  const items: any[] = ladder.lines || lad.items || [];
  const rentLine = items.find((i) => i.key === 'rent') ?? null;
  const rest = items.filter((i) => i !== rentLine);

  const rentAmount = rentLine?.amount_min ?? rentLine?.amount ?? null;
  const monthly = ladder.monthly_min ?? lad.monthly_recurring ?? null;
  const unknown = ladder.unknown_count ?? 0;
  const amenities = (listing?.amenities || []).slice(0, 3);
  const evidence: SourceRef | null = rentLine?.source ?? listing?.source ?? null;

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-5">
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Cost breakdown
          </span>
          <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
            {ladder.headline || 'Monthly and move-in costs'}
          </h3>
        </div>
        <span className="text-xs font-bold bg-[#FAF8F5] border border-[#F4EFEA] text-[#1A261C]/70 px-3 py-1 rounded-full">
          {items.length} items
        </span>
      </div>

      {/* Advertised rent */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] flex items-center justify-between gap-3">
        <div>
          <span className="font-display text-3xl font-extrabold text-[#1A261C]">{rupees(rentAmount)}</span>
          <span className="text-sm text-[#1A261C]/50"> / mo</span>
        </div>
        <span className="text-[11px] font-bold px-3 py-1.5 rounded-xl bg-[#B80D1D]/10 text-[#B80D1D]">
          Advertised Rent
        </span>
      </div>

      {amenities.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {amenities.map((a) => (
            <div
              key={a}
              className="text-center text-[11px] font-semibold text-[#1A261C]/70 bg-white border border-[#F4EFEA] rounded-xl py-3 px-1"
            >
              {a}
            </div>
          ))}
        </div>
      )}

      {/* Additional costs */}
      <div>
        <div className="flex items-center justify-between pb-2 border-b border-[#F4EFEA]">
          <span className="text-sm font-semibold text-[#1A261C]/70">Additional costs</span>
          <span className="text-[11px] font-semibold text-[#B80D1D]">From the listing</span>
        </div>
        <div className="divide-y divide-[#F4EFEA]">
          {rest.map((item, idx) => (
            <CostStep key={idx} item={item} onOpenEvidence={onOpenEvidence} />
          ))}
        </div>
      </div>

      {/* Real monthly cost */}
      <div className="p-4 rounded-2xl bg-[#FAF8F5] border-2 border-[#E9DEC3] flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            Real monthly cost
          </div>
          <div className="text-xs text-[#1A261C]/55 mt-0.5">
            {unknown > 0 ? `At least · ${unknown} unknown` : 'All included'}
          </div>
        </div>
        <div className="font-display text-3xl font-extrabold text-[#1A261C]">{rupees(monthly)}</div>
      </div>

      {evidence && onOpenEvidence && (
        <button
          type="button"
          onClick={() => onOpenEvidence(evidence)}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#B80D1D] to-[#8B0000] text-white text-sm font-bold shadow-red-glow active:scale-[0.98] transition-all"
        >
          View Full Listing Evidence ↗
        </button>
      )}
    </div>
  );
}