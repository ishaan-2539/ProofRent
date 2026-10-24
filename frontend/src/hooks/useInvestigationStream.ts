import { useEffect, useState } from "react";
import { getReport } from "@/api/client";
import type { Report, JobEvent } from "@/types/api";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export function useInvestigationStream(reportId: string | undefined) {
  const [report, setReport] = useState<Report | null>(null);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!reportId) return;

    let isMounted = true;

    // Initial report fetch
    getReport(reportId)
      .then((data) => {
        if (isMounted) {
          setReport(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || "Failed to load report.");
          setLoading(false);
        }
      });

    // Connect Server-Sent Events stream
    const eventSource = new EventSource(`${BASE_URL}/api/investigations/${reportId}/stream`);

    eventSource.onmessage = (event) => {
      try {
        const jobEvent = JSON.parse(event.data) as JobEvent;
        if (isMounted) {
          setEvents((prev) => [...prev, jobEvent]);

          // Refresh full report on completion or module milestones
          if (jobEvent.type === "completed" || jobEvent.type === "module_ready") {
            getReport(reportId).then((updated) => {
              if (isMounted) setReport(updated);
            });
          }
        }
      } catch {
        // Handle stream parse ignore
      }
    };

    eventSource.onerror = () => {
      eventSource.close();
    };

    return () => {
      isMounted = false;
      eventSource.close();
    };
  }, [reportId]);

  return { report, events, loading, error, setReport };
}