import React from 'react';

interface Props {
  confidence: number;
}

function getLevel(c: number): { label: string; cls: string } {
  if (c >= 75) return { label: 'High Risk — Hard Alert Active', cls: 'high' };
  if (c >= 50) return { label: 'Elevated — Soft Prompt Active', cls: 'elevated' };
  if (c >= 20) return { label: 'Monitoring', cls: 'monitor' };
  return { label: 'No signal detected', cls: 'none' };
}

export function ConfidenceMeter({ confidence }: Props) {
  const { label, cls } = getLevel(confidence);

  return (
    <div className="confidence-meter">
      <div className="confidence-header">
        <span className="confidence-label">Vulnerability Signal</span>
        <span className={`confidence-value conf-${cls}`}>{confidence}%</span>
      </div>
      <div className="meter-track">
        <div className={`meter-fill fill-${cls}`} style={{ width: `${confidence}%` }} />
        <div className="meter-tick tick-soft" title="Soft prompt threshold (50%)" />
        <div className="meter-tick tick-hard" title="Hard alert threshold (75%)" />
      </div>
      <div className="meter-labels">
        <span>0%</span>
        <span>Soft 50%</span>
        <span>Hard 75%</span>
        <span>100%</span>
      </div>
      <div className={`confidence-status conf-status-${cls}`}>{label}</div>
    </div>
  );
}
