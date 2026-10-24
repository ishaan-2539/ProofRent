import React, { useState } from "react";
import { validateListingInput } from "../../lib/validators";
import { Button } from "../common/Button";

interface ListingInputProps {
  onSubmit: (url: string) => void;
  busy: boolean;
}

export const ListingInput: React.FC<ListingInputProps> = ({ onSubmit, busy }) => {
  const [url, setUrl] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = validateListingInput(url);
    if (!result.ok) {
      setError(result.message || "Invalid URL");
      return;
    }
    setError(null);
    onSubmit(url.trim());
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-2xl space-y-3">
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => {
            setUrl(e.target.value);
            if (error) setError(null);
          }}
          placeholder="Paste listing URL from Magicbricks, Housing, NoBroker..."
          className="flex-1 px-4 py-3 text-slate-900 border border-slate-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100"
          disabled={busy}
        />
        <Button type="submit" disabled={busy} className="py-3 px-6 text-base">
          {busy ? "Investigating..." : "Investigate"}
        </Button>
      </div>
      {error && <p className="text-sm font-medium text-rose-600 px-1">{error}</p>}
    </form>
  );
};