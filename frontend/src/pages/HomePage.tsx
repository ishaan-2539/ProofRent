import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ListingInput } from '../components/home/ListingInput';
import { startInvestigation, ApiClientError } from '../api/client';
import type { ExampleId } from '../types/api';
import constants from '@shared/constants.json';

const FEATURES = [
  { icon: '🔁', title: 'Compare Listings', text: 'Identify price gaps and duplicate posts across portals.' },
  { icon: '🔎', title: 'Check Evidence', text: 'View the quoted passage and source link behind every number.' },
  { icon: '🧾', title: 'Real Breakdown', text: 'See actual monthly and move-in costs, with unknowns marked.' },
  { icon: '🤝', title: 'Informed Decisions', text: 'Walk in with the right questions to ask the landlord.' },
];

const EXAMPLES: { id: ExampleId; label: string }[] = [
  { id: 'match', label: '🔍 Price Gap Example' },
  { id: 'hidden_fees', label: '🧾 Extra Fees Example' },
  { id: 'no_match', label: '✅ No Match Example' },
  { id: 'blocked', label: '🚧 Blocked Portal Example' },
];

export function HomePage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const showError = (err: unknown) => {
    if (err instanceof ApiClientError) {
      setError(err.error.message + (err.error.next_step ? ' ' + err.error.next_step : ''));
    } else {
      setError('Could not reach the backend. Is it running on http://localhost:8000?');
    }
  };

  const handleAnalyzeUrl = async (url: string) => {
    setAnalyzing(true);
    setError(null);
    try {
      const res = await startInvestigation({
        url,
        replay_example_id: null,
        force_refresh: false,
      });
      navigate(`/investigate/${res.report_id}`);
    } catch (err: unknown) {
      showError(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePickExample = async (exampleId: ExampleId) => {
    setError(null);
    try {
      const res = await startInvestigation({
        url: null,
        replay_example_id: exampleId,
        force_refresh: false,
      });
      navigate(`/investigate/${res.report_id}`);
    } catch (err: unknown) {
      showError(err);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <section className="relative rounded-[2rem] bg-gradient-to-br from-white via-[#FAF8F5] to-[#F6E9E6] border border-[#F4EFEA] p-8 lg:p-12 shadow-luxury overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-[#B80D1D]/20 text-[#B80D1D] text-xs font-bold tracking-wide shadow-sm">
              <span className="w-2 h-2 rounded-full bg-[#B80D1D]" />
              <span>Rent cost verification engine</span>
            </div>

            <h1 className="text-4xl lg:text-5xl font-extrabold text-[#1A261C] font-display tracking-tight leading-[1.1]">
              Find the real cost behind{' '}
              <span className="text-[#B80D1D]">any rental listing.</span>
            </h1>

            <p className="text-[#1A261C]/65 text-base max-w-xl leading-relaxed">
              Paste a PG or rental listing link and let ProofRent cross-compare portals,
              calculate the true all-inclusive monthly expenditure, and reveal the evidence
              behind every figure.
            </p>

            <div className="space-y-3">
              <ListingInput onSubmit={handleAnalyzeUrl} busy={analyzing} />
              {error && <p className="text-xs text-[#B80D1D] font-semibold pl-2">{error}</p>}
            </div>

            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A261C]/40 block">
                Try a recorded example
              </span>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex.id}
                    type="button"
                    onClick={() => handlePickExample(ex.id)}
                    className="px-3.5 py-1.5 bg-white border border-[#F4EFEA] hover:border-[#B80D1D]/40 hover:text-[#B80D1D] rounded-full text-xs font-semibold text-[#1A261C] transition-all shadow-sm"
                  >
                    {ex.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Illustration card */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-3xl bg-white/80 backdrop-blur border border-[#F4EFEA] shadow-luxury p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D]" />
                  <span className="text-sm font-bold text-[#1A261C]">ProofRent Evidence</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-emerald-100 text-emerald-800">
                  Live Scrape
                </span>
              </div>

              <div className="relative h-44 flex items-end justify-center gap-3">
                <div className="w-20 h-28 rounded-xl bg-gradient-to-b from-[#1A261C] to-[#0B110C] shadow-md p-2.5 space-y-1.5">
                  <div className="h-2.5 rounded bg-white/25" />
                  <div className="h-2.5 rounded bg-white/25 w-2/3" />
                  <div className="h-2.5 rounded bg-[#B80D1D]/80 w-1/2" />
                </div>
                <div className="w-24 h-40 rounded-xl bg-gradient-to-b from-[#C80D2E] to-[#8B0000] shadow-md p-2.5 space-y-1.5">
                  <div className="h-2.5 rounded bg-white/30" />
                  <div className="h-2.5 rounded bg-white/30 w-3/4" />
                  <div className="mx-auto mt-10 w-7 h-10 rounded-t-lg bg-[#FAF8F5]" />
                </div>
                <div className="w-20 h-24 rounded-xl bg-[#E9DEC3] shadow-md p-2.5 space-y-1.5">
                  <div className="h-2.5 rounded bg-white/60" />
                  <div className="h-2.5 rounded bg-white/60 w-2/3" />
                </div>
                <div className="absolute top-0 right-6 w-14 h-14 rounded-full bg-white border-4 border-[#B80D1D] shadow-lg flex items-center justify-center text-lg">
                  🔎
                </div>
              </div>

              <div className="flex items-center justify-between text-xs pt-3 border-t border-[#F4EFEA] text-[#1A261C]/60">
                <span>Portals supported</span>
                <span className="font-extrabold text-[#1A261C]">{constants.portals.length}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="p-5 rounded-3xl bg-white border border-[#F4EFEA] shadow-card flex items-start gap-3"
          >
            <div className="w-11 h-11 rounded-2xl bg-[#FAF8F5] flex items-center justify-center text-lg shrink-0">
              {f.icon}
            </div>
            <div>
              <h3 className="font-bold text-sm text-[#1A261C]">{f.title}</h3>
              <p className="text-xs text-[#1A261C]/55 mt-1 leading-relaxed">{f.text}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}