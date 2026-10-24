import type { PortalId } from '../../types/api';

interface LiveBrowserTileProps {
  portal: PortalId | string | null;
  streamUrl: string | null;
  lastScreenshotUrl: string | null;
  statusText?: string;
  finished?: boolean;
}

const PORTAL_NAMES: Record<string, string> = {
  magicbricks: 'MagicBricks',
  pgdekho: 'PGdekho',
  nobroker: 'NoBroker',
  housing: 'Housing.com',
  gopgo: 'GoPGo',
  hexahome: 'HexaHome',
  ninetynineacres: '99acres',
};

export function LiveBrowserTile({
  portal,
  streamUrl,
  lastScreenshotUrl,
  statusText = 'Navigating portal...',
  finished = false,
}: LiveBrowserTileProps) {
  const portalName = portal ? PORTAL_NAMES[portal] || portal : 'TinyFish Web Agent';

  return (
    <div className="bg-[#121B13] border border-[#1A261C] rounded-2xl overflow-hidden shadow-luxury flex flex-col h-80">
      {/* Browser Chrome Header */}
      <div className="bg-[#1A261C] px-4 py-2.5 flex items-center justify-between border-b border-[#121B13]">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D]/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block" />
          </div>
          <span className="text-[11px] font-mono font-bold text-[#FAF8F5]/80 ml-2">
            {portalName}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              finished
                ? 'bg-emerald-400'
                : 'bg-[#B80D1D] animate-ping'
            }`}
          />
          <span className="text-[10px] font-mono uppercase tracking-wider text-[#FAF8F5]/60">
            {finished ? 'Captured' : 'Live Agent'}
          </span>
        </div>
      </div>

      {/* Browser Viewport Area */}
      <div className="relative flex-1 bg-black/40 flex items-center justify-center overflow-hidden">
        {streamUrl ? (
          <iframe
            src={streamUrl}
            title={`Live Agent Browser - ${portalName}`}
            className="w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        ) : lastScreenshotUrl ? (
          <img
            src={lastScreenshotUrl}
            alt={`${portalName} Captured State`}
            className="w-full h-full object-cover object-top"
          />
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1A261C] border border-[#FAF8F5]/10 flex items-center justify-center text-xl text-[#FAF8F5]">
              🌐
            </div>
            <div className="space-y-1">
              <p className="text-xs font-mono font-bold text-[#FAF8F5]">
                {statusText}
              </p>
              <p className="text-[10px] text-[#FAF8F5]/40 font-mono">
                Initiating TinyFish stealth proxy session...
              </p>
            </div>
          </div>
        )}

        {/* Viewport Overlay Footer */}
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-3 flex items-center justify-between text-white">
          <span className="text-[10px] font-mono text-[#FAF8F5]/80 truncate max-w-[220px]">
            ⚡ {statusText}
          </span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider bg-[#B80D1D] text-white px-2 py-0.5 rounded">
            Agent Frame
          </span>
        </div>
      </div>
    </div>
  );
}