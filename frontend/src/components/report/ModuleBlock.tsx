import { useState, type ReactNode } from 'react';

interface ModuleBlockProps {
  title: string;
  subtitle?: string;
  badge?: string;
  children: ReactNode;
  defaultOpen?: boolean;
}

export function ModuleBlock({
  title,
  subtitle,
  badge,
  children,
  defaultOpen = true,
}: ModuleBlockProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <section className="bg-white border border-[#F4EFEA] rounded-3xl shadow-luxury overflow-hidden transition-all">
      {/* Clean White & Deep Olive Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-6 text-left bg-white border-b border-[#F4EFEA] hover:bg-[#FAF8F5] transition-colors focus:outline-none"
      >
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h2 className="font-display font-extrabold text-xl text-[#1A261C] tracking-tight">
              {title}
            </h2>
            {badge && (
              <span className="text-[11px] font-bold uppercase tracking-wider bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/20 px-3 py-0.5 rounded-full">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#1A261C]/60 font-medium">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#1A261C]/60 shrink-0 ml-4">
          <span className="text-xs font-bold uppercase tracking-wider">
            {isOpen ? 'Minimize' : 'Expand'}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && <div className="p-6 bg-[#FAFAFC]">{children}</div>}
    </section>
  );
}