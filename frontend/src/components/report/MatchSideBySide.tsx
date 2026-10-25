import { useState } from 'react';
import type { ListingFields, MatchCandidate, SourceRef, UserDecision } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { getPortalName } from '../../lib/labels';
import { formatRupees } from '../../lib/format';

const text = (ev: { value?: unknown } | null | undefined): string | null =>
  ev && ev.value !== null && ev.value !== undefined && ev.value !== '' ? String(ev.value) : null;

function firstRent(l: ListingFields) {
  return l.rent_options?.find((o) => o.monthly_rent) ?? null;
}

function Row({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex justify-between gap-3 py-1.5 border-b border-[#F4EFEA] last:border-0 text-sm">
      <span className="text-[#1A261C]/55">{label}</span>
      <span className="font-semibold text-[#1A261C] text-right">{value ?? 'Not stated'}</span>
    </div>
  );
}

interface ListingCardProps {
  listing: ListingFields;
  badge: string;
  badgeClass: string;
  dashed?: boolean;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function ListingCard({ listing: l, badge, badgeClass, dashed = false, onOpenEvidence }: ListingCardProps) {
  const [imgFailed, setImgFailed] = useState(false);
  const portal = l.portal || l.source?.portal;
  const portalName = portal ? getPortalName(portal) : 'Listing';
  const title = text(l.title) || text(l.operator_name) || `${portalName} listing`;
  const place = text(l.locality) || text(l.address_text);
  const photo = l.photo_urls?.[0];
  const rent = firstRent(l);
  const deposit = text(l.deposit_amount);
  const notice = text(l.notice_period_days);

  return (
    <div
      className={`rounded-3xl overflow-hidden bg-white shadow-card flex flex-col border-2 ${
        dashed ? 'border-dashed border-amber-400/60' : 'border-[#F4EFEA]'
      }`}
    >
      <div className="relative h-44 bg-[#1A261C] flex items-center justify-center overflow-hidden">
        {photo && !imgFailed ? (
          <img
            src={photo}
            alt={title}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgFailed(true)}
          />
        ) : (
          <span className="text-xs text-white/50 px-4 text-center">
            No photo could be read from {portalName}
          </span>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />
        <span className={`absolute top-3 right-3 text-[11px] font-bold px-3 py-1 rounded-full shadow ${badgeClass}`}>
          {badge}
        </span>
        <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider bg-black/70 text-white px-2.5 py-1 rounded-md">
          {portalName}
        </span>
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between gap-4">
        <div>
          <h3 className="text-lg font-extrabold text-[#1A261C] line-clamp-2">{title}</h3>
          {place && <p className="text-xs text-[#1A261C]/55 mt-0.5">{place}</p>}

          <div className="bg-[#FAF8F5] rounded-2xl p-4 my-4 border border-[#F4EFEA]">
            <div className="flex items-baseline justify-between">
              <span className="text-[10px] font-bold text-[#1A261C]/50 uppercase tracking-wider">Listed rent</span>
              <span className="text-[11px] text-[#1A261C]/50 capitalize">
                {rent ? `${rent.sharing_type}${rent.ac ? ' · AC' : ''}` : ''}
              </span>
            </div>
            <div className="text-2xl font-extrabold text-[#B80D1D]">
              {rent?.monthly_rent ? formatRupees(rent.monthly_rent) : 'Not stated'}
              {rent?.monthly_rent && <span className="text-xs font-normal text-[#1A261C]/50"> / month</span>}
            </div>
          </div>

          <Row label="Deposit" value={deposit ? formatRupees(Number(deposit)) : null} />
          <Row label="Food plan" value={text(l.food_plan)} />
          <Row label="Electricity" value={text(l.electricity_terms)} />
          <Row label="Notice period" value={notice ? `${notice} days` : null} />
        </div>

        <div className="pt-3 border-t border-[#F4EFEA] flex items-center justify-between">
          {l.source?.url ? (
            <a
              href={l.source.url}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-[#B80D1D] font-bold hover:underline"
            >
              View source listing ↗
            </a>
          ) : (
            <span className="text-xs text-[#1A261C]/40">Captured source</span>
          )}
          {onOpenEvidence && l.source && (
            <button
              type="button"
              onClick={() => onOpenEvidence(l.source)}
              className="text-xs bg-[#1A261C] text-white px-3 py-1.5 rounded-lg font-semibold hover:bg-black transition-colors"
            >
              Evidence
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

interface MatchSideBySideProps {
  listing: ListingFields;
  candidate: MatchCandidate;
  onDecision?: (candidateId: string, decision: UserDecision) => void;
  onOpenEvidence?: (source: SourceRef) => void;
}

export function MatchSideBySide({ listing, candidate, onDecision, onOpenEvidence }: MatchSideBySideProps) {
  const [decision, setDecision] = useState<UserDecision | null>(candidate.user_decision ?? null);

  const decide = (d: UserDecision) => {
    setDecision(d);
    onDecision?.(candidate.candidate_id, d);
  };

  const compared = (candidate.families || []).filter((f) => f.agreed !== null && f.agreed !== undefined);
  const notCompared = (candidate.families || []).filter((f) => f.agreed === null || f.agreed === undefined);
  const levelText = candidate.match_level === 'match' ? 'Likely the same place' : 'Possible match';
  const scopeText =
    candidate.scope === 'same_operator_branch'
      ? 'Same operator. The exact building is not confirmed.'
      : 'Same place';

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-5 shadow-luxury space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
            {levelText} · {candidate.confidence} confidence
          </span>
          <p className="text-xs text-[#1A261C]/60 mt-0.5">{scopeText}</p>
        </div>
        <span className="text-[11px] font-semibold bg-[#FAF8F5] border border-[#F4EFEA] px-3 py-1 rounded-full text-[#1A261C]/70">
          {candidate.method}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <ListingCard
          listing={listing}
          badge="Your link"
          badgeClass="bg-emerald-100 text-emerald-800 border border-emerald-300"
          onOpenEvidence={onOpenEvidence}
        />
        <ListingCard
          listing={candidate.listing}
          badge="Found elsewhere"
          badgeClass="bg-blue-100 text-blue-800 border border-blue-300"
          dashed
          onOpenEvidence={onOpenEvidence}
        />
      </div>

      {candidate.price_gaps?.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A261C]/50">Price comparison</h4>
          <PriceGapBadge gaps={candidate.price_gaps} />
          {candidate.price_gaps.some((g) => g.note && !g.comparable) && (
            <p className="text-[11px] text-[#1A261C]/55 italic">
              {candidate.price_gaps.find((g) => g.note && !g.comparable)?.note}
            </p>
          )}
        </div>
      )}

      {compared.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A261C]/50">Signals checked</h4>
          <SignalChips families={compared.map((f) => ({ family: f.family, agreed: !!f.agreed, detail: f.detail }))} />
        </div>
      )}
      {notCompared.length > 0 && (
        <p className="text-[11px] text-[#1A261C]/45">
          Not compared: {notCompared.map((f) => f.family).join(', ')}
        </p>
      )}

      {candidate.alternative_explanations?.length > 0 && (
        <div className="bg-[#F4EFEA]/40 border-l-4 border-[#1A261C] p-3.5 rounded-r-xl">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]">
            Other possible explanations
          </span>
          <ul className="mt-1 space-y-0.5 text-xs text-[#1A261C]/75 list-disc pl-4">
            {candidate.alternative_explanations.slice(0, 3).map((e, i) => (
              <li key={i}>{e}</li>
            ))}
          </ul>
        </div>
      )}

      {onDecision && (
        <div className="flex flex-wrap items-center gap-3 pt-2 border-t border-[#F4EFEA]">
          <span className="text-xs font-semibold text-[#1A261C]/70">Is this the same place?</span>
          <button
            type="button"
            onClick={() => decide('confirmed')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              decision === 'confirmed'
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-[#1A261C] border-[#F4EFEA] hover:border-emerald-500'
            }`}
          >
            Yes, same place
          </button>
          <button
            type="button"
            onClick={() => decide('rejected')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
              decision === 'rejected'
                ? 'bg-[#1A261C] text-white border-[#1A261C]'
                : 'bg-white text-[#1A261C] border-[#F4EFEA] hover:border-[#1A261C]'
            }`}
          >
            No, different
          </button>
        </div>
      )}
    </div>
  );
}