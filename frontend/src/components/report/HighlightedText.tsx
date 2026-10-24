

export function HighlightedText({
  text,
}: {
  text: string;
  sharedSentences?: string[];
}) {
  if (!text) return <span className="text-[#1A261C]/40 italic">No description provided</span>;

  return (
    <p className="text-xs text-[#1A261C] leading-relaxed whitespace-pre-line">
      {text}
    </p>
  );
}