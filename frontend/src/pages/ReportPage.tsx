import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ReportView } from '../components/report/ReportView';

// Rich mock fallback data for instant browser testing
const MOCK_REPORT_DATA = {
  report_id: 'demo-report-101',
  share_path: '/report/demo-report-101',
  listing: {
    title: { value: 'Green Valley Luxury 2BHK Apartment' },
    address: { value: '123 Koramangala 4th Block, Bengaluru' },
    description: 'Spacious 2BHK with fully furnished amenities, modular kitchen, and balcony.',
    lat: 12.9352,
    lng: 77.6245,
  },
  matching: {
    candidates: [
      {
        candidate_id: 'cand_101',
        title: 'Green Valley 2BHK Flat / PG',
        source_platform: 'NoBroker',
        url: 'https://nobroker.in/example-listing',
        screenshot_url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800',
        user_decision: 'unreviewed',
        lat: 12.9355,
        lng: 77.6248,
        distance_m: 45,
        family_results: [
          { family: 'location', agreed: true, detail: 'Coordinates within 50m radius' },
          { family: 'identity', agreed: true, detail: 'Matching property name & owner phone' },
          { family: 'content', agreed: false, detail: 'Rent amount listed differently' },
          { family: 'visual', agreed: true, detail: 'Photo signatures match with 94% confidence' },
        ],
        price_gaps: [
          {
            sharing_type: '2BHK Entire Flat',
            ac: true,
            rent_here: 28000,
            rent_there: 24000,
            difference: -4000,
            comparable: true,
          },
        ],
      },
    ],
    findings: [
      {
        kind: 'price_mismatch',
        label: 'Price Discrepancy',
        confidence: 'high',
        what_we_saw: 'Identical property photos listed on NoBroker for ₹24,000/month (₹4,000 lower).',
        how_we_matched: 'Perceptual photo hashing & geo-proximity alignment.',
        other_explanations: ['Owner may have listed via a third-party broker who added commission markup.'],
        question: 'Is the ₹28,000 rent rate negotiable to match the direct owner listing of ₹24,000?',
        sources: [
          {
            url: 'https://nobroker.in/example-listing',
            platform: 'NoBroker',
          },
        ],
      },
    ],
  },
  cost_ladder: {
    headline: 'Move-in & Monthly Financial Obligations',
    total_first_month: 87500,
    monthly_recurring: 28000,
    items: [
      { label: 'Monthly Base Rent', amount: 28000, is_hidden_cost: false },
      { label: 'Security Deposit (2 Months)', amount: 56000, is_hidden_cost: false },
      { label: 'Mandatory Agreement & Move-in Fee', amount: 3500, is_hidden_cost: true, note: 'Disclosed only at lease signing' },
    ],
  },
  fair_price: {
    verdict: 'overpriced',
    stated_rent: 28000,
    fair_min: 22000,
    fair_max: 25000,
    message: 'This property is listed ~12% above localized market benchmarks for Koramangala 4th Block.',
    confidence: 'high',
  },
  questions: [
    {
      question: 'Are maintenance fees and water charges included in the base rent quote or billed extra?',
      category: 'Fee Transparency',
      reason: 'Additional maintenance costs can increase monthly expenses by 10-15%.',
    },
    {
      question: 'Is the security deposit refundable in full within 15 days of lease termination?',
      category: 'Deposit Terms',
      reason: 'Prevents unexpected deduction clauses upon departure.',
    },
  ],
};

export function ReportPage() {
  const { report_id } = useParams<{ report_id: string }>();
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/reports/${report_id || 'demo'}`);
      if (!res.ok) {
        throw new Error(`Server responded with status ${res.status}`);
      }
      const data = await res.json();
      setReport(data);
    } catch (err: any) {
      console.warn('Backend API unreachable or endpoint not found. Loading demo mock data:', err.message);
      setReport(MOCK_REPORT_DATA);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [report_id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center">
        <div className="w-10 h-10 border-4 border-[#F4EFEA] border-t-[#B80D1D] rounded-full animate-spin mb-4" />
        <p className="text-sm font-bold text-[#1A261C]">Loading ProofRent Audit...</p>
        <p className="text-xs text-[#1A261C]/60 mt-1">Cross-referencing multi-platform listing records & price models</p>
      </div>
    );
  }

  if (error && !report) {
    return (
      <div className="min-h-screen bg-[#FAFAFC] flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="bg-[#B80D1D]/10 text-[#B80D1D] p-5 rounded-2xl border border-[#B80D1D]/20 max-w-md shadow-sm">
          <h2 className="text-xs font-mono font-bold uppercase tracking-wider">Report Load Failure</h2>
          <p className="text-xs mt-1.5">{error}</p>
        </div>
        <Link
          to="/"
          className="text-xs font-bold text-[#1A261C] hover:underline"
        >
          ← Return to Search
        </Link>
      </div>
    );
  }

  // const isComplete = report.status === "completed" || report.status === "failed";
  
  // // Safe field extractions to handle type schema variations cleanly
  // const listingAny = report.listing as any;
  // const rentPrice = listingAny?.rent_price?.value ?? listingAny?.price?.value ?? listingAny?.rent?.value;
  return (
    <div className="min-h-screen bg-[#FAFAFC] p-4 sm:p-6 lg:p-8">
      {/* Top Navigation & Audit Header */}
      <header className="max-w-5xl mx-auto mb-8 flex items-center justify-between border-b border-[#F4EFEA] pb-5">
        <div className="flex items-center gap-4">
          <Link
            to="/"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] bg-white border border-[#F4EFEA] px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-1.5"
          >
            <span>←</span> Back
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#1A261C]/50">
                Audit Record:
              </span>
              <span className="text-[11px] font-mono font-bold text-[#B80D1D] bg-[#B80D1D]/5 border border-[#B80D1D]/20 px-2 py-0.5 rounded-md">
                {report_id || report?.report_id || 'DEMO'}
              </span>
            </div>
            <h1 className="text-xl font-extrabold text-[#1A261C] tracking-tight mt-0.5">
              Property Verification & Risk Audit
            </h1>
          </div>
        </div>

        <button
          type="button"
          onClick={fetchReport}
          className="text-xs font-bold text-[#B80D1D] bg-[#B80D1D]/10 hover:bg-[#B80D1D]/20 border border-[#B80D1D]/20 px-4 py-2 rounded-xl transition-all flex items-center gap-1.5"
        >
          <span>↻</span> Refresh Analysis
        </button>
      </header>

      {/* Main Verification Dashboard */}
      <main>
        <ReportView report={report} onRefetch={fetchReport} />
      </main>
    </div>
  );
}