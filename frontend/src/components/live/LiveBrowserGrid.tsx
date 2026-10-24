import { LiveBrowserTile } from './LiveBrowserTile';
import type { PortalId } from '../../types/api';

export interface ActiveTile {
  portal: PortalId | string;
  streamUrl: string | null;
  screenshotUrl: string | null;
  statusText?: string;
  finished?: boolean;
}

interface LiveBrowserGridProps {
  tiles: ActiveTile[];
}

export function LiveBrowserGrid({ tiles }: LiveBrowserGridProps) {
  if (!tiles || tiles.length === 0) {
    return (
      <LiveBrowserTile
        portal="magicbricks"
        streamUrl={null}
        lastScreenshotUrl={null}
        statusText="Waiting for active portal streams..."
      />
    );
  }

  // Display up to 2 active agent browser tiles concurrently per pipeline semaphore
  const displayTiles = tiles.slice(0, 2);

  return (
    <div className={`grid grid-cols-1 ${displayTiles.length > 1 ? 'lg:grid-cols-2' : ''} gap-4`}>
      {displayTiles.map((tile, idx) => (
        <LiveBrowserTile
          key={`${tile.portal}-${idx}`}
          portal={tile.portal}
          streamUrl={tile.streamUrl}
          lastScreenshotUrl={tile.screenshotUrl}
          statusText={tile.statusText}
          finished={tile.finished}
        />
      ))}
    </div>
  );
}