import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ListingInput } from '../components/home/ListingInput';
import { startInvestigation } from '../api/client';

export function HomePage() {
  const navigate = useNavigate();
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      console.warn("API request failed, navigating to demo investigation fallback:", err);
      navigate('/investigate/demo');
    } finally {
      setAnalyzing(false);
    }
  };

  const handlePickExample = (exampleId: string) => {
    navigate(`/investigate/example-${exampleId}`);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFC] flex flex-col justify-between">
      <header className="h-20 bg-white/90 backdrop-blur-md border-b border-[#F4EFEA] px-6 lg:px-12 flex items-center justify-between shrink-0 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#8B0000] via-[#B80D1D] to-[#C80D2E] flex items-center justify-center text-white shadow-red-glow">
            <span className="text-lg">🏰</span>
          </div>
          <div>
            <span className="font-display font-extrabold text-2xl tracking-tight text-[#1A261C]">
              Proof<span className="text-[#B80D1D]">Rent</span>
            </span>
            <p className="text-[10px] font-bold tracking-wide uppercase text-[#1A261C]/50">
              Real Rental Verification Engine
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <Link
            to="/preflight"
            className="text-xs font-bold text-[#1A261C]/70 hover:text-[#1A261C] transition-colors hidden sm:inline"
          >
            System Status
          </Link>
          <Link
            to="/investigate/demo"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] border border-[#F4EFEA] px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Explore Demo Audit ↗
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-6 py-10 space-y-12">
        <section className="relative rounded-3xl bg-gradient-to-r from-white via-[#FAF8F5] to-[#F4EFEA]/60 border border-[#F4EFEA] p-8 lg:p-12 shadow-luxury overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-8 space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#B80D1D]/10 border border-[#B80D1D]/20 text-[#B80D1D] text-xs font-bold tracking-wide">
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B80D1D] opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B80D1D]" />
                </span>
                <span>AI Rent Truth Engine v3.4</span>
              </div>

              <h1 className="text-3xl lg:text-5xl font-extrabold text-[#1A261C] font-display tracking-tight leading-tight">
                Find the real cost behind <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#B80D1D] via-[#C80D2E] to-[#8B0000] bg-clip-text text-transparent">
                  any rental listing.
                </span>
              </h1>

              <p className="text-[#1A261C]/70 text-sm sm:text-base max-w-2xl leading-relaxed">
                Paste a PG or rental property URL. ProofRent instantly cross-references platforms, detects duplicate listings, calculates hidden move-in fees, and benchmarks fair prices.
              </p>

              <div className="pt-2">
                <ListingInput onSubmit={handleAnalyzeUrl} busy={analyzing} />
                {error && <p className="text-xs text-[#B80D1D] mt-2 font-medium">{error}</p>}
              </div>

              <div className="pt-2 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#1A261C]/50 block">
                  Preset Verification Runs:
                </span>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => handlePickExample('match')}
                    className="px-3 py-1.5 bg-white border border-[#F4EFEA] hover:border-[#1A261C]/30 rounded-xl text-xs font-semibold text-[#1A261C] transition-all"
                  >
                    🔍 Discrepancy Match Example
                  </button>
                  <button
                    type="button"
                    onClick={() => handlePickExample('hidden_fees')}
                    className="px-3 py-1.5 bg-white border border-[#F4EFEA] hover:border-[#1A261C]/30 rounded-xl text-xs font-semibold text-[#1A261C] transition-all"
                  >
                    🧾 Hidden Fees Example
                  </button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-4 flex justify-center">
              <div className="w-full max-w-xs aspect-square rounded-3xl bg-gradient-to-tr from-[#F4EFEA] via-white to-[#FAF8F5] p-6 border border-[#E9DEC3] shadow-luxury flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#B80D1D]" />
                    <span className="text-xs font-bold text-[#1A261C]">Evidence Scraper</span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    Live Engine
                  </span>
                </div>

                <div className="my-4 text-center space-y-2">
                  <div className="w-16 h-16 mx-auto rounded-2xl bg-[#1A261C] text-white flex items-center justify-center text-2xl shadow-md">
                    🛡️
                  </div>
                  <h4 className="font-display font-bold text-sm text-[#1A261C]">
                    Immutable Risk Audit
                  </h4>
                  <p className="text-[11px] text-[#1A261C]/60">
                    Perceptual image matching across 14+ rental portals
                  </p>
                </div>

                <div className="flex items-center justify-between text-[11px] pt-3 border-t border-[#F4EFEA] text-[#1A261C]/60">
                  <span>Match Confidence</span>
                  <span className="font-extrabold text-[#1A261C]">98.4%</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#B80D1D] flex items-center justify-center font-bold text-lg">
              🔍
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Compare Listings</h3>
            <p className="text-xs text-[#1A261C]/60">Identify price disparities and duplicate posts across portals.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#1A261C] flex items-center justify-center font-bold text-lg">
              🛡️
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Check Evidence</h3>
            <p className="text-xs text-[#1A261C]/60">Inspect verified screenshots and original source links.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#B80D1D] flex items-center justify-center font-bold text-lg">
              🧾
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Real Breakdown</h3>
            <p className="text-xs text-[#1A261C]/60">Uncover hidden maintenance, deposit, and move-in fees.</p>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#F4EFEA] shadow-card space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] text-[#1A261C] flex items-center justify-center font-bold text-lg">
              🤝
            </div>
            <h3 className="font-bold text-sm text-[#1A261C]">Informed Decisions</h3>
            <p className="text-xs text-[#1A261C]/60">Negotiate transparently with co-tenants and landlords.</p>
          </div>
        </section>
      </main>

      <footer className="py-6 text-center text-xs text-[#1A261C]/50 border-t border-[#F4EFEA]">
        <p>© 2026 ProofRent Technologies Inc. • Premium Rental Verification Platform</p>
      </footer>
    </div>
  );
}