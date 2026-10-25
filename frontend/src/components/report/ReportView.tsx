import { useState } from 'react';
import type { UserDecision, SourceRef } from '../../types/api';
import { submitMatchDecision } from '../../api/client';
import { RedStringView } from './RedStringView';
import { CostLadderView } from './CostLadderView';
import { FairPriceCard } from './FairPriceCard';
import { QuestionsList } from './QuestionsList';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ModuleBlock } from './ModuleBlock';
import { ShareBar } from './ShareBar';
import { FindingCard } from './FindingCard';
import { ConfidenceExplainer } from './ConfidenceExplainer';
import { formatCapturedAt, formatRupees } from '../../lib/format';
import { getPortalName } from '../../lib/labels';

interface ReportViewProps {
  report: any;
  onRefetch?: () => void;
}

const CONFIDENCE_TEXT: Record<string, string> = { high: 'High', medium: 'Medium', low: 'Low' };

export function ReportView({ report, onRefetch }: ReportViewProps) {
  const [selectedEvidence, setSelectedEvidence] = useState<SourceRef | null>(null);

  if (!report) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center text-xs text-[#1A261C]/60 bg-[#FAFAFC] rounded-2xl border border-[#F4EFEA]">
        No report data available.
      </div>
    );
  }

  const listing = report.listing || {};
  const matching = report.matching || {};
  const costLadder = report.cost_ladder || report.cost || null;
  const fairPrice = report.fair_price || null;
  const questions = report.questions || [];
  const findings: any[] = report.findings || [];
  const candidates: any[] = matching?.candidates || [];

  const handleOpenEvidence = (source: SourceRef) => {
    setSelectedEvidence(source);
  };

  const handleDecision = async (candidateId: string, decision: UserDecision) => {
    const reportId = report.report_id || 'demo';

    if (matching.candidates) {
      const cand = matching.candidates.find((c: any) => c.candidate_id === candidateId);
      if (cand) cand.user_decision = decision;
    }

    try {
      await submitMatchDecision(reportId, { candidate_id: candidateId, decision });
    } catch (err) {
      console.warn('API Endpoint POST /api/reports/:id/decision offline or mock mode:', err);
    }

    if (onRefetch) {
      onRefetch();
    }
  };

  // ------------------------------------------------------------ derived display values
  const rents: number[] = [listing, ...candidates.map((c) => c?.listing)]
    .flatMap((l: any) => (l?.rent_options || []).map((o: any) => o?.monthly_rent))
    .filter((n: any) => typeof n === 'number' && n > 0);
  const rentMin = rents.length ? Math.min(...rents) : null;
  const rentMax = rents.length ? Math.max(...rents) : null;
  const rentRange =
    rentMin === null
      ? '—'
      : rentMin === rentMax
      ? formatRupees(rentMin)
      : `${formatRupees(rentMin)} – ${formatRupees(rentMax)}`;

  const mMin = costLadder?.monthly_min ?? null;
  const mMax = costLadder?.monthly_max ?? null;
  const monthlyText =
    mMin === null
      ? '—'
      : mMax === null || mMax === undefined
      ? `At least ${formatRupees(mMin)}`
      : mMax === mMin
      ? formatRupees(mMin)
      : `${formatRupees(mMin)} – ${formatRupees(mMax)}`;

  const miMin = costLadder?.move_in_min ?? null;
  const miMax = costLadder?.move_in_max ?? null;
  const moveInText =
    miMin === null
      ? '—'
      : miMax === null || miMax === undefined
      ? `At least ${formatRupees(miMin)}`
      : miMax === miMin
      ? formatRupees(miMin)
      : `${formatRupees(miMin)} – ${formatRupees(miMax)}`;

  const lines: any[] = costLadder?.lines || [];
  const count = (label: string) => lines.filter((l) => l.label === label).length;

  const topConfidence = candidates[0]?.confidence as string | undefined;

  const sources: SourceRef[] = [];
  const seen = new Set<string>();
  [listing?.source, ...candidates.map((c) => c?.listing?.source)].forEach((s: any) => {
    if (s?.url && !seen.has(s.url)) {
      seen.add(s.url);
      sources.push(s);
    }
  });

  const heading =
    candidates.length === 0
      ? 'No Matching Listings Found'
      : `${candidates.length} Matching Listing${candidates.length === 1 ? '' : 's'} Found`;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      <ShareBar report={report} />

      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#F4EFEA] pb-4">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-widest">
            <span className="text-[#B80D1D]">Comparison results</span>
            <span className="text-[#1A261C]/30">•</span>
            <span className="text-[#1A261C]/50 normal-case tracking-normal font-medium">
              Captured {formatCapturedAt(report.captured_at)}
            </span>
          </div>
          <h2 className="font-display font-extrabold text-3xl text-[#1A261C] mt-1">{heading}</h2>
          <p className="text-sm text-[#1A261C]/55 mt-0.5">
            Below is the comparison audit for the property link you shared.
          </p>
        </div>
        {topConfidence && (
          <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-[#B80D1D]/20 text-sm font-bold text-[#1A261C] shadow-sm self-start sm:self-auto">
            <span className="w-5 h-5 rounded-full bg-[#B80D1D] text-white text-[11px] flex items-center justify-center">
              ✓
            </span>
            Match confidence:
            <span className="text-[#B80D1D]">{CONFIDENCE_TEXT[topConfidence] || topConfidence}</span>
          </div>
        )}
      </div>

      {/* Listings + quick summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <RedStringView
            reportId={report.report_id || 'demo'}
            listing={listing}
            matching={matching}
            onDecision={handleDecision}
            onOpenEvidence={handleOpenEvidence}
          />
          {candidates.length > 0 && <ConfidenceExplainer candidate={candidates[0]} />}
        </div>

        <aside className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
            <h3 className="font-display font-extrabold text-xl text-[#1A261C]">Quick Summary</h3>
            <span className="text-xs font-bold bg-[#F4EFEA] text-[#1A261C]/70 px-3 py-1 rounded-full">
              {sources.length || 1} {(sources.length || 1) === 1 ? 'Portal' : 'Portals'}
            </span>
          </div>

          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] flex items-center justify-between gap-3">
              <span className="text-xs text-[#1A261C]/60 font-medium">Listed Rent Range</span>
              <span className="font-display font-extrabold text-sm text-[#1A261C] text-right">{rentRange}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] flex items-center justify-between gap-3">
              <span className="text-xs text-[#1A261C]/60 font-medium">Est. Monthly Cost</span>
              <span className="font-display font-extrabold text-sm text-[#1A261C] text-right">{monthlyText}</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#B80D1D]/5 border border-[#B80D1D]/15 flex items-center justify-between gap-3">
              <span className="text-xs text-[#1A261C]/60 font-medium">Move-in Cost</span>
              <span className="font-display font-extrabold text-sm text-[#B80D1D] text-right">{moveInText}</span>
            </div>
          </div>

          {lines.length > 0 && (
            <div className="space-y-2.5">
              <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A261C]/40">
                Cost verification status
              </h4>
              {[
                { label: 'listed', text: 'Listed (Confirmed)', dot: 'bg-emerald-500' },
                { label: 'assumed', text: 'Assumed (Estimated)', dot: 'bg-amber-400' },
                { label: 'unknown', text: 'Unknown / Unspecified', dot: 'bg-slate-400' },
              ].map((row) => (
                <div key={row.label} className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2 text-[#1A261C]/80">
                    <span className={`w-2.5 h-2.5 rounded-full ${row.dot}`} />
                    {row.text}
                  </span>
                  <span className="font-bold text-[#1A261C]">
                    {count(row.label)} {count(row.label) === 1 ? 'item' : 'items'}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="rounded-2xl bg-amber-50 border border-amber-200 p-4 text-xs text-amber-900 leading-relaxed">
            Prices may vary based on room size, food plan and AC usage. Always confirm directly
            with the property manager.
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="w-full py-3 rounded-2xl bg-[#1A261C] hover:bg-[#121B13] text-white text-sm font-bold transition-all active:scale-[0.98]"
          >
            📄 Export Evidence PDF
          </button>
        </aside>
      </div>

      {/* Key findings */}
      {findings.length > 0 && (
        <ModuleBlock
          title="Key Findings"
          subtitle="Plain-language observations, each with its evidence and other possible explanations"
        >
          <div className="grid grid-cols-1 gap-4">
            {findings.map((f) => (
              <FindingCard key={f.finding_id} finding={f} onOpenEvidence={handleOpenEvidence} />
            ))}
          </div>
        </ModuleBlock>
      )}

      {/* Cost ladder + fair price */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {costLadder && (
          <CostLadderView
            ladder={costLadder}
            listing={listing?.source ? listing : null}
            onOpenEvidence={handleOpenEvidence}
          />
        )}

        {fairPrice && (
          <ModuleBlock
            title="Fair Market Valuation"
            subtitle="Median rent of comparable listings found on other portals"
          >
            <FairPriceCard result={fairPrice} />
          </ModuleBlock>
        )}
      </div>

      {/* Evidence & verified sources */}
      {sources.length > 0 && (
        <section className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-5">
          <div className="flex items-center gap-3 pb-4 border-b border-[#F4EFEA]">
            <div className="w-11 h-11 rounded-2xl bg-[#B80D1D]/10 flex items-center justify-center text-lg">🔎</div>
            <div>
              <h3 className="font-display font-extrabold text-xl text-[#1A261C]">
                Evidence &amp; Verified Sources
              </h3>
              <p className="text-xs text-[#1A261C]/55">
                We cross-referenced these pages to construct the cost audit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {sources.map((s) => (
              <a
                key={s.url}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-[#FAF8F5] border border-[#F4EFEA] hover:border-[#B80D1D]/40 transition-all"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-xl bg-[#B80D1D]/10 text-[#B80D1D] flex items-center justify-center font-bold shrink-0">
                    {getPortalName(s.portal || '').charAt(0).toUpperCase() || '•'}
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-[#1A261C]">
                      {s.portal ? getPortalName(s.portal) : 'Source page'}
                    </div>
                    <div className="text-[11px] text-[#1A261C]/50 truncate">{s.url}</div>
                  </div>
                </div>
                <span className="text-[#1A261C]/40 shrink-0">↗</span>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <ModuleBlock
          title="Questions to Ask"
          subtitle="Based on what the listing does and does not state"
        >
          <QuestionsList questions={questions} />
        </ModuleBlock>
      )}

      <EvidenceDrawer source={selectedEvidence} onClose={() => setSelectedEvidence(null)} />
    </div>
  );
}