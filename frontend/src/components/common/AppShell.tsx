import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/', label: 'Dashboard', icon: '🧭', end: true },
  { to: '/investigate/replay_match', label: 'Demo Audit', icon: '🕘', end: false },
  { to: '/preflight', label: 'System Status', icon: '🩺', end: false },
];

function pageTitle(pathname: string): { title: string; subtitle: string } {
  if (pathname.startsWith('/preflight')) {
    return { title: 'System Status', subtitle: 'Service checks • Verification engine diagnostics' };
  }
  if (pathname.startsWith('/investigate')) {
    return { title: 'Investigation', subtitle: 'Delhi NCR • Live rent cost verification' };
  }
  if (pathname.startsWith('/report')) {
    return { title: 'Audit Report', subtitle: 'Delhi NCR • Evidence-based rent cost report' };
  }
  return { title: 'Welcome to ProofRent', subtitle: 'Delhi NCR • Rent cost verification' };
}

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-3">
      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#B80D1D] to-[#8B0000] flex items-center justify-center text-white shadow-red-glow text-xl">
        🏠
      </div>
      <div>
        <div className="font-display font-extrabold text-2xl tracking-tight text-[#1A261C] leading-none">
          Proof<span className="text-[#B80D1D]">Rent</span>
        </div>
        <div className="text-[10px] font-semibold tracking-wide uppercase text-[#1A261C]/45 mt-1">
          Real rent cost verification
        </div>
      </div>
    </Link>
  );
}

export function AppShell() {
  const { pathname } = useLocation();
  const { title, subtitle } = pageTitle(pathname);

  return (
    <div className="min-h-screen flex">
      {/* Sidebar (desktop) */}
      <aside className="hidden lg:flex w-72 shrink-0 flex-col justify-between bg-white border-r border-[#F4EFEA] px-6 py-7 sticky top-0 h-screen">
        <div className="space-y-8">
          <Logo />

          <div className="space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-widest text-[#1A261C]/40 px-2">
              Main menu
            </p>
            <nav className="space-y-1.5">
              {NAV.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `flex items-center justify-between gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive
                        ? 'bg-gradient-to-r from-[#B80D1D] to-[#8B0000] text-white shadow-red-glow'
                        : 'text-[#1A261C]/70 hover:bg-[#FAF8F5] hover:text-[#1A261C]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className="flex items-center gap-3">
                        <span className="text-base">{item.icon}</span>
                        {item.label}
                      </span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-white/80" />}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
          </div>
        </div>

        <div className="rounded-2xl bg-gradient-to-br from-[#1A261C] to-[#0B110C] text-white p-4 shadow-luxury">
          <div className="flex items-center gap-2 text-[10px] font-mono font-bold uppercase tracking-widest text-[#E11D48]">
            <span className="w-2 h-2 rounded-full bg-[#E11D48]" />
            Evidence first
          </div>
          <p className="text-sm font-bold mt-1.5 leading-snug">
            Transparent rentals. Better decisions.
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile top bar */}
        <div className="lg:hidden bg-white border-b border-[#F4EFEA] px-4 py-3 flex items-center justify-between gap-3">
          <Logo />
          <nav className="flex items-center gap-1.5">
            {NAV.slice(1).map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className="text-[11px] font-bold text-[#1A261C]/70 border border-[#F4EFEA] rounded-xl px-2.5 py-1.5"
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Top header */}
        <header className="hidden lg:flex bg-white/90 backdrop-blur-md border-b border-[#F4EFEA] px-10 h-24 items-center justify-between sticky top-0 z-30">
          <div>
            <h2 className="font-display font-extrabold text-2xl tracking-tight text-[#1A261C]">
              {title}
            </h2>
            <p className="text-sm text-[#1A261C]/55 font-medium">{subtitle}</p>
          </div>
          <Link
            to="/investigate/replay_match"
            className="text-xs font-bold text-[#1A261C] hover:bg-[#F4EFEA] border border-[#F4EFEA] px-4 py-2 rounded-xl transition-all shadow-sm"
          >
            Explore Demo Audit ↗
          </Link>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-10 py-8 [&_.min-h-screen]:min-h-[70vh]">
          <Outlet />
        </main>

        <footer className="py-5 text-center text-xs text-[#1A261C]/45 border-t border-[#F4EFEA]">
          © 2026 ProofRent • Rental cost transparency platform
        </footer>
      </div>
    </div>
  );
}