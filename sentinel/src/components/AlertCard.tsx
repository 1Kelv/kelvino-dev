import React from 'react';
import type { VulnerabilityAlert } from '../types';

interface Props {
  alert: VulnerabilityAlert;
  onAcknowledge: (id: string) => void;
}

const LEVEL_CONFIG = {
  monitor: { label: 'Monitor', icon: '◉' },
  soft: { label: 'Soft Prompt', icon: '◈' },
  hard: { label: 'Hard Alert', icon: '▲' },
  critical: { label: 'Critical', icon: '⚠' },
};

const CATEGORY_LABELS: Record<string, string> = {
  financial_distress: 'Financial Distress',
  life_event: 'Life Event',
  health: 'Health',
  capability: 'Capability',
  wellbeing: 'Wellbeing',
};

export function AlertCard({ alert, onAcknowledge }: Props) {
  const config = LEVEL_CONFIG[alert.level];

  return (
    <div className={`alert-card alert-${alert.level} ${alert.acknowledged ? 'alert-acknowledged' : ''}`}>
      <div className="alert-top">
        <div className="alert-level-badge">
          <span className="alert-icon">{config.icon}</span>
          <span>{config.label}</span>
        </div>
        <div className="alert-meta">
          <span className="alert-category">{CATEGORY_LABELS[alert.category]}</span>
          <span className="alert-confidence">{alert.confidence}%</span>
          <span className="alert-time">{alert.timestamp}</span>
        </div>
      </div>

      <div className="alert-headline">{alert.headline}</div>

      <div className="alert-field">
        <span className="field-label">Evidence</span>
        <span className="field-evidence">{alert.evidence}</span>
      </div>

      <div className="alert-field">
        <span className="field-label">Agent Prompt</span>
        <p className="field-prompt">{alert.agentPrompt}</p>
      </div>

      {alert.requiredAction && (
        <div className="alert-required-action">
          <span className="field-label required-label">Required Action</span>
          <p>{alert.requiredAction}</p>
        </div>
      )}

      {!alert.acknowledged && (alert.level === 'hard' || alert.level === 'critical') && (
        <button className="acknowledge-btn" onClick={() => onAcknowledge(alert.id)}>
          Acknowledge
        </button>
      )}

      {alert.acknowledged && (
        <div className="acknowledged-tag">✓ Acknowledged</div>
      )}
    </div>
  );
}
