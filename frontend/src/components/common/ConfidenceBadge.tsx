import React from 'react';
import type { Confidence } from '../../types/api';
import { Badge } from './Badge';
import { getConfidenceText } from '../../lib/labels';

export const ConfidenceBadge: React.FC<{ confidence: Confidence }> = ({ confidence }) => {
  const toneMap: Record<Confidence, 'green' | 'yellow' | 'red'> = {
    high: 'green',
    medium: 'yellow',
    low: 'red',
  };

  return (
    <Badge tone={toneMap[confidence]}>
      {getConfidenceText(confidence)}
    </Badge>
  );
};