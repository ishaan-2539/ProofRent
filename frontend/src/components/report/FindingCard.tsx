import React from 'react';
import { Finding, SourceRef } from '../../types/api';
import { EvidenceLabelBadge, ConfidenceBadge } from '../common';

interface FindingCardProps {
  finding: Finding;
  onOpenEvidence: (source: SourceRef) => void;
}

export function FindingCard({ finding, onOpenEvidence }: FindingCardProps) {
  const primarySource = finding.sources[0] || null;

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 shadow-sm hover:border-[#1A261C]/20 transition-all space-y-4">
      {/* Top Bar: Labels & Confidence */}
      <div className="flex items-center justify-between gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <EvidenceLabelBadge label={finding.label} />
          {finding.confidence && (
            <ConfidenceBadge confidence={finding.confidence} />
          )}
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-[#1A261C]/60 bg-[#F4EFEA] px-2.5 py-1 rounded-md">
          {finding.kind.replace('_', ' ')}
        </span>
      </div>

      {/* Part 1: What We Saw */}
      <div className="space-y-1.5">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/70">
          What We Saw
        </h4>
        <p className="text-sm text-[#1A261C] font-medium leading-relaxed">
          {finding.what_we_saw}
        </p>
        {primarySource && (
          <button
            type="button"
            onClick={() => onOpenEvidence(primarySource)}
            className="inline-flex items-center gap-1.5 text-xs text-[#B80D1D] font-semibold hover:underline mt-1 focus:outline-none"
          >
            <span>View source page & screenshot</span>
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </button>
        )}
      </div>

      {/* Part 2: How We Matched (If Present) */}
      {finding.how_we_matched && (
        <div className="bg-[#F4EFEA]/60 rounded-lg p-3 space-y-1">
          <h5 className="text-xs font-bold text-[#1A261C]/70">
            Matching Method
          </h5>
          <p className="text-xs text-[#1A261C] leading-normal">
            {finding.how_we_matched}
          </p>
        </div>
      )}

      {/* Part 3: Other Explanations */}
      {finding.other_explanations && finding.other_explanations.length > 0 && (
        <div className="space-y-1.5">
          <h5 className="text-xs font-bold text-[#1A261C]/70">
            Innocent / Alternative Explanations
          </h5>
          <ul className="list-disc list-inside space-y-1">
            {finding.other_explanations.map((exp, idx) => (
              <li key={idx} className="text-xs text-[#1A261C]/80 leading-normal">
                {exp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Part 4: Question to Ask */}
      {finding.question && (
        <div className="border-l-4 border-[#B80D1D] bg-[#FAFAFC] pl-3 py-2 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
            Suggested Question to Ask
          </span>
          <p className="text-xs font-semibold text-[#1A261C]">
            "{finding.question}"
          </p>
        </div>
      )}
    </div>
  );
}