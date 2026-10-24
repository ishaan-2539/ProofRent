import type { ListingFields, UserDecision, SourceRef } from '../../types/api';
import { SignalChips } from './SignalChips';
import { PriceGapBadge } from './PriceGapBadge';
import { MapPinsView } from './MapPinsView';

function getText(val: any): string {
  if (!val) return '';
  if (typeof val === 'string') return val;
  if (typeof val === 'object' && val.value !== undefined) return String(val.value);
  return '';
}

interface MatchSideBySideProps {
  listing: ListingFields;
  candidate: any;
  onDecision: (candidateId: string, d: UserDecision) => void;
  onOpenEvidence: (source: SourceRef) => void;
}

export function MatchSideBySide({ listing, candidate, onDecision, onOpenEvidence }: MatchSideBySideProps) {
  const currentDecision = candidate?.user_decision || 'unreviewed';

  const listingTitle = getText((listing as any)?.title) || 'Submitted Listing';
  const listingAddress = getText((listing as any)?.address) || '1.2 km from shared location';

  const candidateTitle = getText(candidate?.title) || 'Matched Listing Title';
  const candidateAddress = getText(candidate?.address) || '1.1 km from shared location';

  const listingImg = 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80';
  const candidateImg = candidate?.screenshot_url || 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-6">
      {/* Top Header & Decision Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#F4EFEA]">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B80D1D] animate-ping" />
            <span className="text-xs font-bold uppercase tracking-wider text-[#B80D1D]">
              Cross-Portal Duplicate Match
            </span>
          </div>
          <h3 className="font-display font-extrabold text-xl text-[#1A261C] mt-1">
            {candidateTitle}
          </h3>
        </div>

        <div className="flex items-center gap-2 bg-[#FAF8F5] p-1.5 rounded-2xl border border-[#F4EFEA]">
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'confirm' as UserDecision)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              currentDecision === 'confirm'
                ? 'bg-[#1A261C] text-white shadow-sm'
                : 'text-[#1A261C]/70 hover:bg-[#F4EFEA]'
            }`}
          >
            ✓ Confirm Match
          </button>
          <button
            type="button"
            onClick={() => onDecision(candidate.candidate_id, 'reject' as UserDecision)}
            className={`px-4 py-2 text-xs font-bold rounded-xl transition-all ${
              currentDecision === 'reject'
                ? 'bg-[#B80D1D] text-white shadow-sm'
                : 'text-[#1A261C]/70 hover:bg-[#B80D1D]/10'
            }`}
          >
            ✕ Reject
          </button>
        </div>
      </div>

      {/* Signal Alignment Chips */}
      {candidate.family_results && (
        <div className="space-y-1.5">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/50">
            Signal Family Alignment Audit
          </span>
          <SignalChips families={candidate.family_results} />
        </div>
      )}

      {/* Side-by-Side Property Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
        {/* Left Card: Target Listing */}
        <div className="bg-white rounded-3xl border border-[#F4EFEA] shadow-card overflow-hidden flex flex-col justify-between hover:border-[#B80D1D]/30 transition-all">
          <div>
            <div className="relative h-44 overflow-hidden">
              <img src={listingImg} alt={listingTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-[#1A261C] text-[#FAF8F5] font-bold text-xs shadow-md border border-[#1A261C]/50 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>Listed Subject</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                  Target Listing
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#1A261C]">{listingTitle}</h4>
                <p className="text-xs text-[#1A261C]/60 flex items-center mt-1">📍 {listingAddress}</p>
              </div>

              <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
                <div>
                  <span className="font-display text-2xl font-extrabold text-[#1A261C]">₹28,000</span>
                  <span className="text-xs text-[#1A261C]/60"> / mo</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-[#B80D1D]/10 text-[#B80D1D] text-[11px] font-bold">
                  Stated Rent
                </span>
              </div>

              {/* Itemized Cost Table */}
              <div className="pt-2 border-t border-[#F4EFEA] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Maintenance Fee</span>
                  <span className="font-semibold text-[#1A261C]">₹1,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Security Deposit</span>
                  <span className="font-semibold text-[#1A261C]">₹56,000</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F4EFEA] via-[#FAF8F5] to-[#F4EFEA] border border-[#E9DEC3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B80D1D] uppercase tracking-wider block">Real Monthly Cost</span>
                  <span className="text-xs text-[#1A261C]/60">All Included</span>
                </div>
                <div className="font-display text-xl font-extrabold text-[#B80D1D]">₹29,000</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Matched Duplicate */}
        <div className="bg-white rounded-3xl border border-[#F4EFEA] shadow-card overflow-hidden flex flex-col justify-between hover:border-[#B80D1D]/30 transition-all">
          <div>
            <div className="relative h-44 overflow-hidden">
              <img src={candidateImg} alt={candidateTitle} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-[#B80D1D] to-[#8B0000] text-white font-bold text-xs shadow-md flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-300 animate-ping" />
                <span>Matched Portal</span>
              </div>
              <div className="absolute bottom-3 left-3 text-white">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-black/40 backdrop-blur-md px-2 py-0.5 rounded">
                  {candidate.source_platform || 'External Portal'}
                </span>
              </div>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h4 className="font-display font-bold text-base text-[#1A261C]">{candidateTitle}</h4>
                <p className="text-xs text-[#1A261C]/60 flex items-center mt-1">📍 {candidateAddress}</p>
              </div>

              <div className="flex items-baseline justify-between p-3 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA]">
                <div>
                  <span className="font-display text-2xl font-extrabold text-[#1A261C]">₹24,000</span>
                  <span className="text-xs text-[#1A261C]/60"> / mo</span>
                </div>
                <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-800 text-[11px] font-bold">
                  ₹4,000 Cheaper
                </span>
              </div>

              {/* Itemized Cost Table */}
              <div className="pt-2 border-t border-[#F4EFEA] space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Maintenance Fee</span>
                  <span className="font-semibold text-[#1A261C]">₹1,000</span>
                </div>
                <div className="flex justify-between py-1 border-b border-dashed border-[#F4EFEA]">
                  <span className="text-[#1A261C]/70">Security Deposit</span>
                  <span className="font-semibold text-[#1A261C]">₹48,000</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-gradient-to-r from-[#F4EFEA] via-[#FAF8F5] to-[#F4EFEA] border border-[#E9DEC3] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-[#B80D1D] uppercase tracking-wider block">Real Monthly Cost</span>
                  <span className="text-xs text-[#1A261C]/60">All Included</span>
                </div>
                <div className="font-display text-xl font-extrabold text-[#B80D1D]">₹25,000</div>
              </div>
            </div>
          </div>

          <div className="p-5 pt-0">
            {candidate.url && (
              <button
                type="button"
                onClick={() => onOpenEvidence({ url: candidate.url, platform: candidate.source_platform } as any)}
                className="w-full py-2.5 px-4 rounded-xl border border-[#B80D1D] text-[#B80D1D] hover:bg-[#B80D1D] hover:text-white font-bold text-xs transition-all flex items-center justify-center gap-2"
              >
                <span>View Full Listing Evidence</span>
                <span>↗</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {candidate.price_gaps && candidate.price_gaps.length > 0 && (
        <PriceGapBadge gaps={candidate.price_gaps} />
      )}

      {((listing as any)?.lat || candidate?.lat) && (
        <MapPinsView
          a={{ lat: ((listing as any)?.lat as any)?.value ?? (listing as any)?.lat ?? null, lng: ((listing as any)?.lng as any)?.value ?? (listing as any)?.lng ?? null }}
          b={{ lat: candidate?.lat ?? null, lng: candidate?.lng ?? null }}
          distanceM={candidate?.distance_m ?? null}
        />
      )}
    </div>
  );
}   