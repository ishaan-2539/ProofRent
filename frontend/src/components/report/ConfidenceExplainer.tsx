import type { MatchCandidate } from '../../types/api';

const FAMILY_LABEL: Record<string, string> = {
  location: 'Location',
  identity: 'Operator name',
  content: 'Description text',
  visual: 'Photos',
};

const RULES: { level: string; text: string }[] = [
  { level: 'High', text: 'A pin or house-number match plus the operator name plus either shared text or matching photos. Or name, text and photos all agree.' },
  { level: 'Medium', text: 'Two independent signals agree, for example name and description text.' },
  { level: 'Low', text: 'Only one signal agrees, or only the neighbourhood matches.' },
];

export function ConfidenceExplainer({ candidate }: { candidate: MatchCandidate }) {
  if (!candidate) return null;
  const families = candidate.families || [];
  const level = candidate.confidence;

  return (
    <section className="bg-white border border-[#F4EFEA] rounded-3xl p-6 shadow-luxury space-y-5">
      <div>
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#B80D1D]">
          Transparency
        </span>
        <h3 className="font-display font-extrabold text-lg text-[#1A261C]">
          How we decided this match confidence
        </h3>
        <p className="text-xs text-[#1A261C]/60 mt-1">
          Confidence counts how many independent kinds of evidence agree. It is not a probability,
          and you make the final call.
        </p>
      </div>

      <div className="space-y-2">
        {families.map((f) => {
          const state = f.agreed === true ? 'Agreed' : f.agreed === false ? 'Did not agree' : 'Not compared';
          const dot = f.agreed === true ? 'bg-emerald-500' : f.agreed === false ? 'bg-[#B80D1D]' : 'bg-slate-300';
          return (
            <div key={f.family} className="flex items-start gap-3 p-3 rounded-xl bg-[#FAF8F5] border border-[#F4EFEA]">
              <span className={`w-2.5 h-2.5 rounded-full mt-1.5 shrink-0 ${dot}`} />
              <div className="min-w-0">
                <div className="text-sm font-bold text-[#1A261C]">
                  {FAMILY_LABEL[f.family] || f.family}{' '}
                  <span className="text-[11px] font-mono font-medium text-[#1A261C]/50">{state}</span>
                </div>
                <div className="text-xs text-[#1A261C]/65">{f.detail}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <h4 className="text-[11px] font-bold uppercase tracking-widest text-[#1A261C]/45">
          What each level means (this match: {level})
        </h4>
        {RULES.map((r) => (
          <div
            key={r.level}
            className={`text-xs p-2.5 rounded-lg ${
              r.level.toLowerCase() === level ? 'bg-[#B80D1D]/5 border border-[#B80D1D]/20' : 'bg-transparent'
            }`}
          >
            <span className="font-bold text-[#1A261C]">{r.level}: </span>
            <span className="text-[#1A261C]/70">{r.text}</span>
          </div>
        ))}
      </div>

      <div className="rounded-xl bg-[#F4EFEA]/50 border-l-4 border-[#1A261C] p-3.5 text-xs text-[#1A261C]/75 space-y-1">
        <p><span className="font-bold">Rent is never used as evidence.</span> A price difference is what we report, so it cannot also prove two listings are the same place.</p>
        <p><span className="font-bold">Neighbourhood alone is capped at "possible".</span> Without a map pin or house number we cannot confirm the exact building.</p>
        <p><span className="font-bold">Limits:</span> the thresholds are fixed rules, not calibrated percentages, and an operator who reuses one description across branches can inflate the text signal. That is why alternative explanations and a confirm/reject choice are always shown.</p>
      </div>
    </section>
  );
}