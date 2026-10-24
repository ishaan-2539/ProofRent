import { useState } from 'react';
import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { getPortalName } from '../../lib/labels';

const val = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v);
const rupees = (n: number | null | undefined) => (n == null ? '—' : `₹${n.toLocaleString('en-IN')}`);

interface CardProps {
  badge: string;
  badgeClass: string;
  l: ListingFields;
  rent: number | null;
  sharing?: string;
  dashed: boolean;
  tag?: { text: string; className: string } | null;
  onOpenEvidence: (source: SourceRef) => void;
}

function ListingCard({ badge, badgeClass, l, rent, sharing, dashed, tag, onOpenEvidence }: CardProps) {
  const portalName = l.portal ? getPortalName(l.portal) : 'Portal';

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white shadow-card flex flex-col border-2 ${
        dashed ? 'border-dashed border-[#B80D1D]/40' : 'border-[#F4EFEA]'
      }`}
    >
      <div className="relative h-44 bg-gradient-to-br from-[#1A261C] via-[#2a3a2d] to-[#B80D1D]/70">
        <span className="absolute inset-0 flex items-center justify-center text-white/30 font-display font-extrabold text-2xl">
          {portalName}
        </span>
        {l.photo_urls?.[0] && (
          <img
            src={l.photo_urls[0]}
            alt={val(l.title) || 'Listing photo'}
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        )}
        <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow ${badgeClass}`}>
          {badge}
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/60 text-white px-2.5 py-1 rounded-md">
          {portalName} listing
        </span>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <h4 className="font-display font-bold text-lg text-[#1A261C] leading-snug">
          {val(l.title) || 'Listing'}
        </h4>
        <p className="text-xs text-[#1A261C]/55">
          📍 {val(l.address_text) || val(l.locality) || 'Locality as listed'}
        </p>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] flex items-center justify-between gap-2">
          <div>
            <span className="font-display text-2xl font-extrabold text-[#1A261C]">{rupees(rent)}</span>
            <span className="text-xs text-[#1A261C]/50"> / mo</span>
            {sharing && (
              <div className="text-[11px] font-semibold text-[#1A261C]/50 capitalize">{sharing} sharing</div>
            )}
          </div>
          {tag && (
            <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg ${tag.className}`}>{tag.text}</span>
          )}
        </div>

        {l.source?.url && (
          <button
            type="button"
            onClick={() => onOpenEvidence(l.source)}
            className="mt-auto w-full py-2.5 rounded-2xl border-2 border-[#B80D1D] text-[#B80D1D] hover:bg-[#B80D1D] hover:text-white text-xs font-bold transition-all"
          >
            View Full Listing Evidence ↗
          </button>
        )}
      </div>
    </div>
  );
}

interface Props {
  listing: ListingFields;
  candidate: any;
  onDecision: (candidateId: string, d: UserDecision) => Promise<void> | void;
  onOpenEvidence: (source: SourceRef) => void;
}

export function MatchSideBySide({ listing, candidate, onDecision, onOpenEvidence }: Props) {
  const [saving, setSaving] = useState(false);
  const decision = candidate?.user_decision;
  const gap = candidate?.price_gaps?.[0];
  const there: ListingFields = candidate.listing;
  const dashed = candidate.match_level === 'possible' && decision !== 'confirmed';

  const decide = async (d: UserDecision) => {
    setSaving(true);
    try {
      await onDecision(candidate.candidate_id, d);
    } finally {
      setSaving(false);
    }
  };

  const rentHere = gap?.rent_here ?? listing.rent_options?.[0]?.monthly_rent ?? null;
  const rentThere = gap?.rent_there ?? there.rent_options?.[0]?.monthly_rent ?? null;

  let thereTag: { text: string; className: string } | null = null;
  if (gap?.comparable && gap.difference !== 0) {
    thereTag =
      gap.difference < 0
        ? { text: `${rupees(Math.abs(gap.difference))} lower`, className: 'bg-emerald-100 text-emerald-800' }
        : { text: `${rupees(gap.difference)} higher`, className: 'bg-[#B80D1D]/10 text-[#B80D1D]' };
  }

  return (
    <div className="space-y-5">
      <div className="bg-white border border-[#F4EFEA] rounded-3xl p-5 shadow-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B80D1D]">
            {candidate.match_level === 'possible' ? 'Possible match' : 'Match'} · {candidate.confidence} confidence
          </span>
          <p className="text-xs text-[#1A261C]/65 mt-1">{candidate.method}</p>
        </div>
        <div className="flex gap-2 shrink-0">
          <button
            disabled={saving}
            onClick={() => decide('confirmed')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              decision === 'confirmed' ? 'bg-[#1A261C] text-white border-[#1A261C]' : 'border-[#F4EFEA] hover:border-[#1A261C]/30'
            }`}
          >
            ✓ Confirm
          </button>
          <button
            disabled={saving}
            onClick={() => decide('rejected')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              decision === 'rejected' ? 'bg-[#B80D1D] text-white border-[#B80D1D]' : 'border-[#F4EFEA] hover:border-[#B80D1D]/30'
            }`}
          >
            Not the same
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ListingCard
          badge="Listed"
          badgeClass="bg-[#1A261C] text-white"
          l={listing}
          rent={rentHere}
          sharing={gap?.sharing_type}
          dashed={false}
          onOpenEvidence={onOpenEvidence}
        />
        <ListingCard
          badge="Matched Portal"
          badgeClass="bg-[#B80D1D] text-white"
          l={there}
          rent={rentThere}
          sharing={gap?.sharing_type}
          dashed={dashed}
          tag={thereTag}
          onOpenEvidence={onOpenEvidence}
        />
      </div>

      <div className="bg-white border border-[#F4EFEA] rounded-3xl p-5 shadow-card space-y-4">
        <SignalChips families={candidate.families || []} />
        <PriceGapBadge gaps={candidate.price_gaps || []} />

        {candidate.alternative_explanations?.length > 0 && (
          <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3 rounded-r-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-[#1A261C]">Other explanations</span>
            <ul className="text-xs text-[#1A261C]/80 list-disc pl-4 mt-1 space-y-0.5">
              {candidate.alternative_explanations.map((e: string, i: number) => (
                <li key={i}>{e}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}