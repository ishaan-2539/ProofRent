import React from "react";
import type { PortalId } from "@/types/api";
import { LiveBrowserTile } from "./LiveBrowserTile";

export interface BrowserTileData {
  id: string;
  portal: PortalId | null;
  streamUrl: string | null;
  lastScreenshotUrl: string | null;
  finished: boolean;
  title?: string;
}

interface LiveBrowserGridProps {
  tiles: BrowserTileData[];
}

export const LiveBrowserGrid: React.FC<LiveBrowserGridProps> = ({ tiles }) => {
  if (!tiles || tiles.length === 0) {
    return (
      <LiveBrowserTile
        portal={null}
        streamUrl={null}
        lastScreenshotUrl={null}
        finished={false}
        title="Primary Listing Extraction"
      />
    );
  }

  const activeTiles = tiles.slice(0, 2);

  return (
    <div
      className={`grid gap-4 ${
        activeTiles.length > 1 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
      }`}
    >
      {activeTiles.map((tile) => (
        <LiveBrowserTile
          key={tile.id}
          portal={tile.portal}
          streamUrl={tile.streamUrl}
          lastScreenshotUrl={tile.lastScreenshotUrl}
          finished={tile.finished}
          title={tile.title}
        />
      ))}
    </div>
  );
};