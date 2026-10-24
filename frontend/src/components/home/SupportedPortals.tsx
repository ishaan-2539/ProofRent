import React from "react";
import constants from "@shared/constants.json";

export const SupportedPortals: React.FC = () => (
  <div className="text-center space-y-1">
    <p className="text-xs text-slate-400 font-medium">Supported Delhi NCR Portals:</p>
    <div className="flex flex-wrap justify-center gap-2 text-xs text-slate-500 font-medium">
      {constants.portals.map((p) => (
        <span key={p.id} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
          {p.display_name}
        </span>
      ))}
    </div>
  </div>
);