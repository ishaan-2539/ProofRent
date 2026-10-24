import React from "react";
import { Link } from "react-router-dom";

export const Navbar: React.FC = () => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-slate-900 font-bold text-xl tracking-tight">
          <span className="bg-blue-600 text-white px-2 py-0.5 rounded-md text-sm font-black">PR</span>
          <span>ProofRent</span>
        </Link>
        <nav className="flex items-center space-x-4">
          <Link
            to="/preflight"
            className="text-xs font-semibold text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            System Status
          </Link>
        </nav>
      </div>
    </header>
  );
};