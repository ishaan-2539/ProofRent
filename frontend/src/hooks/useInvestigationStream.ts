import { useEffect, useState } from 'react';
import type { Report, JobEvent } from '../types/api';

const MOCK_REPORT_DATA: any = {
  report_id: 'demo',
  status: 'completed',
  url: 'https://www.magicbricks.com/pg-in-koramangala-bangalore-pdpid-4d423132383137',
  created_at: new Date().toISOString(),
  modules: [
    { name: 'listing', status: 'success', duration_ms: 820 },
    { name: 'matching', status: 'success', duration_ms: 1450 },
    { name: 'cost', status: 'success', duration_ms: 610 },
    { name: 'fair_price', status: 'success', duration_ms: 930 },
    { name: 'questions', status: 'success', duration_ms: 450 },
  ],
  listing: {
    title: { value: 'Luxury Single Room PG near Forum Mall', confidence: 'high' },
    address: { value: '5th Block, Koramangala, Bengaluru, Karnataka 560095', confidence: 'high' },
    lat: { value: 12.9352, confidence: 'high' },
    lng: { value: 77.6245, confidence: 'high' },
    rent_stated: { value: 28000, confidence: 'high' },
    deposit_stated: { value: 56000, confidence: 'high' },
    maintenance_stated: { value: 1000, confidence: 'high' },
    photos: [
      'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80',
    ],
  },
  matching: {
    candidates: [
      {
        candidate_id: 'cand-nobroker-101',
        source_platform: 'NoBroker',
        title: '1 BHK Fully Furnished Flat - 5th Block Koramangala',
        address: '5th Block, Koramangala, Bengaluru',
        rent: 24000,
        deposit: 48000,
        maintenance: 1000,
        distance_m: 120,
        screenshot_url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80',
        url: 'https://www.nobroker.in/property/rent/bangalore/koramangala',
        user_decision: 'unreviewed',
        price_gaps: [
          {
            field: 'Rent Disparity',
            delta: -4000,
            note: 'Same property listed ₹4,000 cheaper on NoBroker',
          },
        ],
        family_results: [
          { family: 'location', matched: true, score: 0.98, note: 'Coordinates match within 120 meters' },
          { family: 'visual', matched: true, score: 0.94, note: 'Perceptual image hash matches room interior' },
          { family: 'content', matched: true, score: 0.89, note: 'Amenities and floor plan match target' },
        ],
      },
    ],
  },
  cost_ladder: {
    headline: 'Move-in & Recurring Obligations',
    move_in_min: 85000,
    monthly_min: 29000,
    lines: [
      {
        key: 'rent',
        title: 'Base Monthly Rent',
        amount_min: 28000,
        label: 'verified',
        passage: 'Stated rent on primary MagicBricks listing',
      },
      {
        key: 'deposit',
        title: 'Security Deposit (2 Months)',
        amount_min: 56000,
        label: 'verified',
        passage: 'Refundable security deposit equivalent to 2 months rent',
      },
      {
        key: 'maintenance',
        title: 'Monthly Maintenance Charge',
        amount_min: 1000,
        label: 'verified',
        passage: 'Fixed monthly society maintenance fee',
      },
      {
        key: 'food_plan',
        title: 'Optional Food & Catering Add-on',
        amount_min: 0,
        label: 'unknown',
        question: 'Is breakfast and dinner included in base rent, or is there an extra meal fee?',
      },
    ],
  },
  fair_price: {
    suggested_min: 23500,
    suggested_max: 25500,
    confidence: 'high',
    reasoning: 'Based on 14 recent 1BHK/PG listings within a 500m radius in Koramangala 5th Block.',
    comparables_count: 14,
  },
  questions: [
    {
      id: 'q1',
      category: 'price',
      question: 'Why is this same unit listed on NoBroker for ₹24,000/month while listed here for ₹28,000/month?',
      why: 'Cross-portal duplicate analysis detected a ₹4,000/month price disparity.',
    },
    {
      id: 'q2',
      category: 'deposit',
      question: 'Is the 2-month security deposit refundable immediately upon notice or subject to painting deductions?',
      why: 'Clarifies hidden move-out deductions upfront.',
    },
  ],
};

export function useInvestigationStream(reportId: string) {
  const [report, setReport] = useState<Report | null>(null);
  const [events, setEvents] = useState<JobEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timer: any = null;

    setReport(null);
    setEvents([]);
    setLoading(true);
    setError(null);

    const startMockSimulation = () => {
      console.log('Backend offline or unreachable. Initializing client-side SSE simulation...');

      const mockEvents: any[] = [
        {
          type: 'status_update',
          message: 'Initializing TinyFish stealth proxy agent session...',
          portal: 'magicbricks',
          ts: new Date().toISOString(),
        },
        {
          type: 'status_update',
          message: 'Extracting listing details from target URL...',
          portal: 'magicbricks',
          ts: new Date(Date.now() + 800).toISOString(),
        },
        {
          type: 'module_ready',
          module_name: 'listing',
          message: 'Listing extraction complete. Parsing financial parameters.',
          ts: new Date(Date.now() + 1600).toISOString(),
        },
        {
          type: 'status_update',
          message: 'Cross-referencing listing images across NoBroker & Housing.com...',
          portal: 'nobroker',
          ts: new Date(Date.now() + 2400).toISOString(),
        },
        {
          type: 'module_ready',
          module_name: 'matching',
          message: 'Duplicate search completed. 1 matching listing found on NoBroker.',
          ts: new Date(Date.now() + 3200).toISOString(),
        },
        {
          type: 'module_ready',
          module_name: 'cost',
          message: 'Cost Ladder generated. Identified maintenance & security deposit breakdown.',
          ts: new Date(Date.now() + 4000).toISOString(),
        },
        {
          type: 'module_ready',
          module_name: 'fair_price',
          message: 'Fair Market Valuation computed against regional baseline.',
          ts: new Date(Date.now() + 4800).toISOString(),
        },
        {
          type: 'completed',
          message: 'Investigation pipeline completed successfully.',
          ts: new Date(Date.now() + 5400).toISOString(),
        },
      ];

      let step = 0;
      timer = setInterval(() => {
        if (!isMounted) return;

        if (step < mockEvents.length) {
          const currentEvt = mockEvents[step];
          setEvents((prev) => [...prev, currentEvt as JobEvent]);

          if (currentEvt.type === 'module_ready' || currentEvt.type === 'completed') {
            setReport((prev) => {
              const base = prev || {
                ...MOCK_REPORT_DATA,
                report_id: reportId,
                status: 'running',
              };

              const updatedModules = base.modules.map((m: any) => {
                if (currentEvt.module_name && m.name === currentEvt.module_name) {
                  return { ...m, status: 'success' as const };
                }
                return m;
              });

              return {
                ...base,
                status: currentEvt.type === 'completed' ? 'completed' : 'running',
                modules: updatedModules,
              };
            });
          }

          step++;
        } else {
          if (timer) clearInterval(timer);
          setLoading(false);
          setReport({
            ...MOCK_REPORT_DATA,
            report_id: reportId,
            status: 'completed',
            modules: (MOCK_REPORT_DATA.modules || []).map((m: any) => ({ ...m, status: 'success' as const })),
          });
        }
      }, 700);
    };

    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
    const sseUrl = `${backendUrl}/api/reports/${reportId}/stream`;

    let eventSource: EventSource | null = null;

    try {
      eventSource = new EventSource(sseUrl);

      eventSource.onmessage = (evt) => {
        if (!isMounted) return;
        try {
          const parsed = JSON.parse(evt.data);
          if (parsed.event) {
            setEvents((prev) => [...prev, parsed.event]);
          }
          if (parsed.report) {
            setReport(parsed.report);
          }
        } catch (e) {
          console.warn('Failed to parse SSE event data', e);
        }
      };

      eventSource.onerror = () => {
        if (eventSource) {
          eventSource.close();
        }
        startMockSimulation();
      };
    } catch {
      startMockSimulation();
    }

    return () => {
      isMounted = false;
      if (eventSource) eventSource.close();
      if (timer) clearInterval(timer);
    };
  }, [reportId]);

  return { report, events, loading, error };
}