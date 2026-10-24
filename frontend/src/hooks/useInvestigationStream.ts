import { useCallback, useEffect, useState } from 'react';
import { getReport } from '../api/client';
import type { JobEvent, Report } from '../types/api';

const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

// Must match JobEventType in the contract. The backend sends NAMED SSE events
// (event: step, event: module_ready, ...), so each one needs its own listener.
const EVENT_TYPES = [
  'started',
  'step',
  'stream_url',
  'module_ready',
  'warning',
  'heartbeat',
  'completed',
  'failed',
] as const;

export function useInvestigationStream(reportId: string | undefined) {
  const [report, setReport] = useState<Report | null>(null);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    if (!reportId) return;
    try {
      const data = await getReport(reportId);
      setReport(data);
      setError(null);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to load report.');
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    if (!reportId) return;

    setReport(null);
    setEvents([]);
    setLoading(true);
    setError(null);

    refetch();

    const es = new EventSource(`${BASE_URL}/api/reports/${reportId}/events`);

    const onEvent = (e: MessageEvent) => {
      let evt: JobEvent;
      try {
        evt = JSON.parse(e.data) as JobEvent;
      } catch {
        return;
      }
      setEvents((prev) => [...prev, evt]);

      if (evt.type === 'module_ready' || evt.type === 'completed') {
        refetch();
      }
      if (evt.type === 'completed' || evt.type === 'failed') {
        refetch();
        es.close(); // stop the browser from auto-reconnecting and replaying
      }
    };

    EVENT_TYPES.forEach((t) => es.addEventListener(t, onEvent as EventListener));

    // Server closes the stream when it finishes; EventSource would reconnect forever.
    es.onerror = () => es.close();

    return () => es.close();
  }, [reportId, refetch]);

  return { report, events, loading, error, refetch };
}