import type { SourceRef } from '../../types/api';

interface EvidenceDrawerProps {
  source: SourceRef | null;
  onClose: () => void;
}

export function EvidenceDrawer({ source, onClose }: EvidenceDrawerProps) {
  if (!source) return null;

  const src = source as any;
  const url = src?.url;
  const screenshotUrl = src?.screenshot_url || src?.screenshot || src?.image_url;
  const platform = src?.platform || src?.source_platform || 'External Platform';
  const title = src?.title || 'Evidence Source';

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-[#F4EFEA]">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-[#F4EFEA] bg-[#FAFAFC]">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#B80D1D]">
              Proof & Evidence
            </span>
            <h3 className="text-base font-bold text-[#1A261C]">
              {title}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#1A261C]/60 hover:text-[#1A261C] hover:bg-[#F4EFEA] transition-colors"
            aria-label="Close drawer"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">
          {/* Metadata Card */}
          <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-4 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#1A261C]/60">
                Platform
              </span>
              <span className="text-xs font-bold text-[#1A261C] capitalize">
                {platform}
              </span>
            </div>

            {url && (
              <div className="pt-2 border-t border-[#F4EFEA] flex items-center justify-between">
                <span className="text-xs text-[#1A261C]/70 truncate max-w-[260px]">
                  {url}
                </span>
                <a
                  href={url}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#B80D1D] hover:underline"
                >
                  <span>Open Link</span>
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>

          {/* Screenshot Capture */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/80">
              Captured Screenshot
            </h4>
            {screenshotUrl ? (
              <div className="border border-[#F4EFEA] rounded-xl overflow-hidden bg-[#FAFAFC] shadow-inner">
                <img
                  src={screenshotUrl}
                  alt="Evidence Capture"
                  className="w-full h-auto object-contain max-h-[500px]"
                />
              </div>
            ) : (
              <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-xl p-8 text-center text-xs text-[#1A261C]/60 italic">
                No screenshot capture recorded for this evidence item.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#F4EFEA] bg-[#FAFAFC] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 bg-[#1A261C] text-white text-xs font-semibold rounded-lg hover:bg-[#1A261C]/90 transition-all"
          >
            Close Evidence
          </button>
        </div>
      </div>
    </div>
  );
}