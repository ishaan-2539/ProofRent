import { useState } from 'react';

interface QuestionsListProps {
  questions: any[];
}

export function QuestionsList({ questions }: QuestionsListProps) {
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  if (!questions || questions.length === 0) {
    return (
      <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 text-center text-xs text-[#1A261C]/60">
        No specific questions generated for this listing.
      </div>
    );
  }

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 2000);
  };

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-5 shadow-sm space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#F4EFEA]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
            Tenant Guidance
          </span>
          <h3 className="text-base font-bold text-[#1A261C]">
            Suggested Questions for Landlord / Broker
          </h3>
        </div>
        <span className="text-xs font-semibold bg-[#F4EFEA] text-[#1A261C] px-2.5 py-1 rounded-md">
          {questions.length} {questions.length === 1 ? 'Question' : 'Questions'}
        </span>
      </div>

      {/* Questions List */}
      <div className="space-y-3">
        {questions.map((q: any, idx: number) => {
          const qText = typeof q === 'string' ? q : q?.question || q?.text || '';
          const qReason = typeof q === 'object' ? q?.reason || q?.why : null;
          const qCategory = typeof q === 'object' ? q?.category || q?.kind : null;

          return (
            <div
              key={idx}
              className="bg-white border border-[#F4EFEA] rounded-lg p-4 space-y-2 hover:border-[#1A261C]/20 transition-all"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  {qCategory && (
                    <span className="text-[9px] font-bold uppercase tracking-wider bg-[#F4EFEA] text-[#1A261C]/70 px-2 py-0.5 rounded">
                      {qCategory}
                    </span>
                  )}
                  <p className="text-xs font-bold text-[#1A261C] leading-relaxed">
                    "{qText}"
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(qText, idx)}
                  className="shrink-0 text-[11px] font-semibold text-[#B80D1D] bg-[#B80D1D]/10 hover:bg-[#B80D1D]/20 px-2.5 py-1 rounded transition-colors"
                >
                  {copiedIdx === idx ? '✓ Copied' : 'Copy Question'}
                </button>
              </div>

              {qReason && (
                <p className="text-[11px] text-[#1A261C]/70 italic border-l-2 border-[#F4EFEA] pl-2">
                  Why ask: {qReason}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}