
import type { FamilyResult, SignalFamily } from '../../types/api';

const FAMILY_LABELS: Record<SignalFamily, string> = {
  location: 'Location',
  identity: 'Name / Operator',
  content: 'Text Content',
  visual: 'Photos',
};

export function SignalChips({ families }: { families: FamilyResult[] }) {
  if (!families) return null;

  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {families.map((fam) => {
        const isAgreed = fam.agreed === true;
        const isDisagreed = fam.agreed === false;
        const isNotCompared = fam.agreed === null;

        let bgStyle = 'bg-[#F4EFEA] text-[#1A261C]/70 border-[#1A261C]/10';
        let statusIcon = '•';

        if (isAgreed) {
          bgStyle = 'bg-[#1A261C]/10 text-[#1A261C] border-[#1A261C]/30 font-semibold';
          statusIcon = '✓';
        } else if (isDisagreed) {
          bgStyle = 'bg-[#B80D1D]/10 text-[#B80D1D] border-[#B80D1D]/30 font-semibold';
          statusIcon = '✕';
        }

        return (
          <span
            key={fam.family}
            title={fam.detail}
            className={`inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-md border ${bgStyle}`}
          >
            <span className="text-[10px]">{statusIcon}</span>
            <span>{FAMILY_LABELS[fam.family] || fam.family}</span>
            {isNotCompared && <span className="text-[9px] opacity-60">(not compared)</span>}
          </span>
        );
      })}
    </div>
  );
}