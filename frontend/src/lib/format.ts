export function formatRupees(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—';
  return `₹${Number(n).toLocaleString('en-IN')}`;
}

export function formatRange(min: number | null | undefined, max: number | null | undefined): string {
  if (min === null || min === undefined) return '—';
  if (max === null || max === undefined) return formatRupees(min);
  return `${formatRupees(min)} – ${formatRupees(max)}`;
}

export function formatCapturedAt(iso: string | null | undefined): string {
  if (!iso) return 'Recently';
  try {
    return new Date(iso).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return iso;
  }
}

export function formatDistance(m: number | null | undefined): string {
  if (m === null || m === undefined) return '—';
  if (m < 1000) return `${Math.round(m)} m`;
  return `${(m / 1000).toFixed(1)} km`;
}