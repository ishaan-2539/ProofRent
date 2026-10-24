import { useState } from 'react';
import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';

const val = (v: any) => (v && typeof v === 'object' && 'value' in v ? v.value : v);
const rupees = (n: number | null | undefined) => (n == null ? '—' : `₹${n.toLocaleString('en-IN')}`);

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
    try { await onDecision(candidate.candidate_id, d); } finally { setSaving(false); }
  };

  const Card = ({ label, l, rent }: { label: string; l: ListingFields; rent: number | null }) => (
    <div className={`rounded-2xl p-5 bg-white space-y-3 border-2 ${dashed ? 'border-dashed border-[#B80D1D]/50' : 'border-[#F4EFEA]'}`}>
      <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">{label}</span>
      <h4 className="font-display font-bold text-base text-[#1A261C]">{val(l.title) || 'Listing'}</h4>
      {l.photo_urls?.[0] && (
          <img
            src={l.photo_urls[0]}
            alt={val(l.title) || 'Listing photo'}
            className="w-full h-40 object-cover rounded-xl"
            onError={(e) => { e.currentTarget.style.display = 'none'; }}
          />
        )}
      <p className="text-xs text-[#1A261C]/60">📍 {val(l.address_text) || val(l.locality) || 'Locality as listed'}</p>
      <div className="p-3 rounded-xl bg-[#FAF8F5] border border-[#F4EFEA] flex justify-between items-baseline">
        <span className="font-display text-2xl font-extrabold">{rupees(rent)}<span className="text-xs text-[#1A261C]/60"> / mo</span></span>
        <span className="text-[11px] font-bold text-[#1A261C]/60 capitalize">{gap?.sharing_type} sharing</span>
      </div>
      {l.source?.url && (
        <button type="button" onClick={() => onOpenEvidence(l.source)} className="text-xs font-bold text-[#B80D1D] hover:underline">
          View source ↗
        </button>
      )}
    </div>
  );

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#B80D1D]">
            {candidate.match_level === 'possible' ? 'Possible match' : 'Match'} · {candidate.confidence} confidence
          </span>
          <p className="text-xs text-[#1A261C]/70 mt-1">{candidate.method}</p>
        </div>
        <div className="flex gap-2">
          <button disabled={saving} onClick={() => decide('confirmed')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border ${decision === 'confirmed' ? 'bg-[#1A261C] text-white' : 'border-[#F4EFEA]'}`}>
            ✓ Confirm
          </button>
          <button disabled={saving} onClick={() => decide('rejected')}
            className={`px-4 py-2 text-xs font-bold rounded-xl border ${decision === 'rejected' ? 'bg-[#B80D1D] text-white' : 'border-[#F4EFEA]'}`}>
            Not the same
          </button>
        </div>
      </div>

      <SignalChips families={candidate.families || []} />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card label="This listing" l={listing} rent={gap?.rent_here ?? listing.rent_options?.[0]?.monthly_rent ?? null} />
        <Card label="Other portal" l={there} rent={gap?.rent_there ?? there.rent_options?.[0]?.monthly_rent ?? null} />
      </div>

      <PriceGapBadge gaps={candidate.price_gaps || []} />

      {candidate.alternative_explanations?.length > 0 && (
        <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3 rounded-r-xl">
          <span className="text-[10px] font-mono font-bold uppercase text-[#1A261C]">Other explanations</span>
          <ul className="text-xs text-[#1A261C]/80 list-disc pl-4 mt-1 space-y-0.5">
            {candidate.alternative_explanations.map((e: string, i: number) => <li key={i}>{e}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
}