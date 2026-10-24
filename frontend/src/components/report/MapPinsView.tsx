import React from 'react';

function formatDistance(m: number | null): string {
  if (m === null || m === undefined) return '—';
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}

interface MapPinsViewProps {
  a: { lat: number | null; lng: number | null };
  b: { lat: number | null; lng: number | null };
  distanceM: number | null;
}

export function MapPinsView({ a, b, distanceM }: MapPinsViewProps) {
  const hasCoords = a.lat !== null && a.lng !== null && b.lat !== null && b.lng !== null;

  if (!hasCoords && distanceM === null) {
    return (
      <div className="bg-[#F4EFEA]/40 border border-[#F4EFEA] rounded-lg p-3 text-center text-xs text-[#1A261C]/60">
        Location coordinates unavailable for direct map comparison
      </div>
    );
  }

  return (
    <div className="bg-[#FAFAFC] border border-[#F4EFEA] rounded-lg p-3 space-y-2">
      <div className="flex items-center justify-between text-xs">
        <span className="font-semibold text-[#1A261C]">Pin Proximity</span>
        <span className="font-bold text-[#B80D1D] bg-[#B80D1D]/10 px-2 py-0.5 rounded">
          {formatDistance(distanceM)} apart
        </span>
      </div>

      <div className="relative h-2 bg-[#F4EFEA] rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 bottom-0 bg-[#1A261C] rounded-full transition-all"
          style={{
            width: distanceM !== null ? `${Math.min(100, Math.max(10, 100 - distanceM / 2))}%` : '50%',
          }}
        />
      </div>
    </div>
  );
}