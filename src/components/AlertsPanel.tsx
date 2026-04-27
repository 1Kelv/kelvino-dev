import React from 'react';
import type { VulnerabilityAlert } from '../types';
import { AlertCard } from './AlertCard';
import { ConfidenceMeter } from './ConfidenceMeter';

interface Props {
  alerts: VulnerabilityAlert[];
  confidence: number;
  onAcknowledge: (id: string) => void;
}

export function AlertsPanel({ alerts, confidence, onAcknowledge }: Props) {
  const unacknowledged = alerts.filter(a => !a.acknowledged).length;

  return (
    <div className="alerts-panel">
      <div className="panel-header">
        <span className="panel-title">AI Insights</span>
        {unacknowledged > 0 && (
          <span className="alert-count-badge">{unacknowledged}</span>
        )}
      </div>

      <ConfidenceMeter confidence={confidence} />

      <div className="alerts-list">
        {alerts.length === 0 && (
          <div className="alerts-empty">No vulnerability signals detected yet.</div>
        )}
        {[...alerts].reverse().map(alert => (
          <AlertCard key={alert.id} alert={alert} onAcknowledge={onAcknowledge} />
        ))}
      </div>
    </div>
  );
}
