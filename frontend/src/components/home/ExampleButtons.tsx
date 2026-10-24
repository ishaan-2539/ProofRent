import React from "react";
import { ExampleListing } from "@/types/api";

interface ExampleButtonsProps {
  examples: ExampleListing[];
  onPick: (example: ExampleListing) => void;
}

export const ExampleButtons: React.FC<ExampleButtonsProps> = ({ examples, onPick }) => {
  if (!examples || examples.length === 0) return null;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Try an example run:</p>
      <div className="flex flex-wrap gap-2">
        {examples.map((ex) => (
          <button
            key={ex.example_id}
            onClick={() => onPick(ex)}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-700 transition-colors text-left"
          >
            <span className="font-semibold text-blue-600 block">{ex.title}</span>
            <span className="text-slate-500">{ex.description}</span>
          </button>
        ))}
      </div>
    </div>
  );
};