import { useState } from 'react';
import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { getPortalName } from '../../lib/labels';

const val = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v);
const rupees = (n: number | null | undefined) => (n == null ? '—' : `₹${Number(n).toLocaleString('en-IN')}`);

const DEFAULT_PHOTO = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';

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
  const initialPhoto = l.photo_urls?.[0] || DEFAULT_PHOTO;
  const [photoSrc, setPhotoSrc] = useState<string>(initialPhoto);

  const displayRent = rent ?? l.rent_options?.[0]?.monthly_rent ?? null;

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white shadow-card flex flex-col border-2 ${
        dashed ? 'border-dashed border-[#B80D1D]/40' : 'border-[#F4EFEA]'
      }`}
    >
      <div className="relative h-48 bg-slate-900 overflow-hidden">
        <img
          src={photoSrc}
          alt={val(l.title) || 'Property listing photo'}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={() => setPhotoSrc(DEFAULT_PHOTO)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow-md ${badgeClass}`}>
          {badge}
        </span>
        <span className="absolute bottom-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-md backdrop-blur-sm border border-white/10">
          {portalName} listing
        </span>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col">
        <h4 className="font-display font-bold text-lg text-[#1A261C] leading-snug">
          {val(l.title) || 'Property Listing'}
        </h4>
        <p className="text-xs text-[#1A261C]/65 font-medium flex items-center gap-1">
          <span>📍</span>
          <span>{val(l.address_text) || val(l.locality) || 'Delhi NCR'}</span>
        </p>

        <div className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] flex items-center justify-between gap-2">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#1A261C]/50 block">Monthly Rate</span>
            <span className="font-display text-2xl font-extrabold text-[#1A261C]">{rupees(displayRent)}</span>
            <span className="text-xs text-[#1A261C]/50"> / mo</span>
            {sharing && (
              <div className="text-[11px] font-semibold text-[#1A261C]/60 capitalize mt-0.5">{sharing} sharing</div>
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
            className="mt-auto w-full py-2.5 rounded-2xl border-2 border-[#B80D1D] text-[#B80D1D] hover:bg-[#B80D1D] hover:text-white text-xs font-bold transition-all shadow-sm"
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
            ✓ Confirm Match
          </button>
          <button
            disabled={saving}
            onClick={() => decide('rejected')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all ${
              decision === 'rejected' ? 'bg-[#B80D1D] text-white border-[#B80D1D]' : 'border-[#F4EFEA] hover:border-[#B80D1D]/30'
            }`}
          >
            Not the Same
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ListingCard
          badge="Target Listing"
          badgeClass="bg-[#1A261C] text-white"
          l={listing}
          rent={rentHere}
          sharing={gap?.sharing_type}
          dashed={false}
          onOpenEvidence={onOpenEvidence}
        />
        <ListingCard
          badge="Matched Portal Listing"
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
          <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3.5 rounded-r-xl">
            <span className="text-[10px] font-mono font-bold uppercase text-[#1A261C]">Alternative Explanations</span>
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