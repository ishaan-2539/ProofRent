import React from "react";
import { EvidenceLabel } from "@/types/api";
import { Badge } from "./Badge";
import { getEvidenceLabelText } from "@/lib/labels";

export const EvidenceLabelBadge: React.FC<{ label: EvidenceLabel }> = ({ label }) => {
  const toneMap: Record<EvidenceLabel, "green" | "blue" | "yellow" | "gray"> = {
    verified: "green",
    inferred: "blue",
    uncertain: "yellow",
    unknown: "gray",
  };
  return <Badge tone={toneMap[label]}>{getEvidenceLabelText(label)}</Badge>;
};