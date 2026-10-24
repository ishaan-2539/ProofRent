interface SignalFamilyResult {
  family: string;
  agreed: boolean;
  detail?: string;
}

interface SignalChipsProps {
  families: SignalFamilyResult[];
}

const FAMILY_LABELS: Record<string, string> = {
  location: 'Geo Proximity',
  identity: 'Name & Contact',
  content: 'Text Similarity',
  visual: 'Photo Fingerprint',
};

export function SignalChips({ families }: SignalChipsProps) {
  if (!families || families.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {families.map((fam, idx) => {
        const label = FAMILY_LABELS[fam.family] || fam.family;
        const matched = fam.agreed;

        return (
          <div
            key={idx}
            title={fam.detail}
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono font-medium border transition-all ${
              matched
                ? 'bg-[#1A261C]/5 text-[#1A261C] border-[#1A261C]/20'
                : 'bg-[#B80D1D]/5 text-[#B80D1D] border-[#B80D1D]/25'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                matched ? 'bg-[#1A261C]' : 'bg-[#B80D1D]'
              }`}
            />
            <span>{label}</span>
            <span className="opacity-60 text-[10px]">
              {matched ? '✓' : '✕'}
            </span>
          </div>
        );
      })}
    </div>
  );
}