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
    <section className="bg-white border border-[#F4EFEA] rounded-2xl shadow-sm overflow-hidden transition-all">
      {/* Section Header */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 text-left bg-[#FAFAFC] hover:bg-[#F4EFEA]/40 transition-colors focus:outline-none"
      >
        <div className="space-y-0.5">
          <div className="flex items-center gap-2.5">
            <h2 className="text-base font-bold text-[#1A261C]">
              {title}
            </h2>
            {badge && (
              <span className="text-[10px] font-bold uppercase tracking-wider bg-[#B80D1D]/10 text-[#B80D1D] border border-[#B80D1D]/20 px-2 py-0.5 rounded-md">
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-xs text-[#1A261C]/60">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-2 text-[#1A261C]/60">
          <span className="text-xs font-semibold">
            {isOpen ? 'Collapse' : 'Expand'}
          </span>
          <svg
            className={`w-4 h-4 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Section Content */}
      {isOpen && <div className="p-5 border-t border-[#F4EFEA]">{children}</div>}
    </section>
  );
}