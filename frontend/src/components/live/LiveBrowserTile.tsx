import React from "react";
import type { PortalId } from "@/types/api";
import { getPortalName } from "@/lib/labels";

interface LiveBrowserTileProps {
  portal: PortalId | null;
  streamUrl: string | null;
  lastScreenshotUrl: string | null;
  finished: boolean;
  title?: string;
}

export const LiveBrowserTile: React.FC<LiveBrowserTileProps> = ({
  portal,
  streamUrl,
  lastScreenshotUrl,
  finished,
  title,
}) => {
  const portalName = portal ? getPortalName(portal) : "Web Agent";

  return (
    <div className="bg-[#121B13] border border-[#1A261C] rounded-2xl overflow-hidden shadow-luxury flex flex-col h-80">
      <div className="px-4 py-2.5 bg-[#1A261C] border-b border-[#FAF8F5]/10 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${finished ? "bg-emerald-400" : "bg-amber-400 animate-ping"}`} />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-[#FAF8F5]">
            {portalName} Browser Agent
          </span>
        </div>
        <span className="text-[10px] font-mono text-[#FAF8F5]/60">
          {finished ? "Capture Complete" : streamUrl ? "Streaming Live" : "Initializing..."}
        </span>
      </div>

      <div className="flex-1 relative bg-black flex items-center justify-center overflow-hidden">
        {streamUrl && !finished ? (
          <iframe
            src={streamUrl}
            title={title || `Live Browser Stream for ${portalName}`}
            className="w-full h-full border-none"
            allow="fullscreen"
          />
        ) : lastScreenshotUrl ? (
          <div className="relative w-full h-full">
            <img
              src={lastScreenshotUrl}
              alt={`Captured page snapshot from ${portalName}`}
              className="w-full h-full object-contain"
            />
            <div className="absolute top-2 right-2 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono text-white">
              Latest Snapshot Frame
            </div>
          </div>
        ) : (
          <div className="p-6 text-center space-y-3">
            <div className="w-10 h-10 mx-auto rounded-full border-2 border-white/20 border-t-[#B80D1D] animate-spin" />
            <p className="text-xs font-mono text-[#FAF8F5]/70">
              Launching TinyFish browser automation agent...
            </p>
            <p className="text-[10px] text-[#FAF8F5]/40 max-w-xs mx-auto">
              Extracting raw DOM text, fee structure, and perceptual photo hashes.
            </p>
          </div>
        )}
      </div>

      {title && (
        <div className="px-3 py-1.5 bg-[#1A261C] text-[10px] font-mono text-[#FAF8F5]/70 truncate border-t border-[#FAF8F5]/10 shrink-0">
          📍 {title}
        </div>
      )}
    </div>
  );
};