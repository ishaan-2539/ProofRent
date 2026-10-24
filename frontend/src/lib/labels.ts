import constants from '../../../shared/constants.json';
import type { EvidenceLabel, CostLabel, Confidence, PortalId } from '../types/api';

export function getEvidenceLabelText(label: EvidenceLabel): string {
  const labels = (constants as any).evidence_labels || {};
  return labels[label] || label;
}

export function getCostLabelText(label: CostLabel): string {
  const labels = (constants as any).cost_labels || {};
  return labels[label] || label;
}

export function getConfidenceText(confidence: Confidence): string {
  const labels = (constants as any).confidence_labels || {};
  return labels[confidence] || confidence;
}

export function getPortalName(portalId: PortalId | string): string {
  const portals = (constants as any).portals || [];
  const found = portals.find((p: any) => p.id === portalId);
  return found ? found.display_name : portalId;
}

export function getErrorMessage(code: string, vars?: Record<string, string>): string {
  const messages = (constants as any).error_messages || {};
  let msg = messages[code] || 'An unexpected error occurred. Please try again.';
  if (vars) {
    Object.entries(vars).forEach(([key, val]) => {
      msg = msg.replace(`{${key}}`, val);
    });
  }
  return msg;
}