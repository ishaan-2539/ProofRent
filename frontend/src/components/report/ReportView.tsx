import { useState } from 'react';
import type { UserDecision, SourceRef } from '../../types/api';
import { RedStringView } from './RedStringView';
import { CostLadderView } from './CostLadderView';
import { FairPriceCard } from './FairPriceCard';
import { QuestionsList } from './QuestionsList';
import { EvidenceDrawer } from './EvidenceDrawer';
import { ModuleBlock } from './ModuleBlock';
import { ShareBar } from './ShareBar';

interface ReportViewProps {
  report: any;
  onRefetch?: () => void;
}

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
  const costLadder = report.cost_ladder || null;
  const fairPrice = report.fair_price || null;
  const questions = report.questions || [];

  const handleUserDecision = (candidateId: string, decision: UserDecision) => {
    console.log(`User decision for candidate ${candidateId}: ${decision}`);
    if (onRefetch) {
      onRefetch();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Banner & Share Bar */}
      <ShareBar report={report} />

      {/* Hero 1: Listing & Red String Verification Matches */}
      <ModuleBlock
        title="Verification & Duplicate Detection"
        subtitle="Cross-platform listing analysis, image verification, and red string matches"
        badge={matching?.candidates?.length ? `${matching.candidates.length} Matches` : undefined}
      >
        <RedStringView
          listing={listing}
          matching={matching}
          onDecision={handleUserDecision}
          onOpenEvidence={(src) => setSelectedEvidence(src)}
        />
      </ModuleBlock>

      {/* Hero 2: Financial Assessment (Cost Ladder & Fair Price) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {costLadder && (
          <ModuleBlock
            title="Move-in Cost Ladder"
            subtitle="Full 1st-month deposit, rent, and hidden fee audit"
          >
            <CostLadderView
              ladder={costLadder}
              onOpenEvidence={(src) => setSelectedEvidence(src)}
            />
          </ModuleBlock>
        )}

        {fairPrice && (
          <ModuleBlock
            title="Fair Market Valuation"
            subtitle="Algorithmic rent estimation against localized market benchmarks"
          >
            <FairPriceCard result={fairPrice} />
          </ModuleBlock>
        )}
      </div>

      {/* Hero 3: Suggested Questions for Negotiation */}
      {questions.length > 0 && (
        <ModuleBlock
          title="Tenant Negotiation Playbook"
          subtitle="Targeted questions based on listing discrepancies and fee disclosures"
        >
          <QuestionsList questions={questions} />
        </ModuleBlock>
      )}

      {/* Evidence Slide-Over Drawer */}
      <EvidenceDrawer
        source={selectedEvidence}
        onClose={() => setSelectedEvidence(null)}
      />
    </div>
  );
}