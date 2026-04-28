import React from 'react';
import { useDemoCall } from '../hooks/useDemoCall';
import { CallHeader } from './CallHeader';
import { TranscriptPanel } from './TranscriptPanel';
import { AlertsPanel } from './AlertsPanel';
import { CRMPanel } from './CRMPanel';
import type { Theme } from '../hooks/useTheme';

interface Props { onBack: () => void; theme: Theme; onToggleTheme: () => void; }

export function AgentDashboard({ onBack, theme, onToggleTheme }: Props) {
  const { callStatus, transcript, alerts, confidence, elapsed, crmDraft, startCall, resetDemo, acknowledgeAlert, updateCRM } = useDemoCall();

  const handleReset = () => { resetDemo(); onBack(); };

  return (
    <div className="dashboard">
      <CallHeader callStatus={callStatus} elapsed={elapsed} theme={theme} onToggleTheme={onToggleTheme} onReset={handleReset} />
      <div className="dashboard-body">
        {(callStatus === 'idle' || callStatus === 'connecting') && (
          <div className="start-screen">
            <div className="start-card">
              {callStatus === 'idle' && (
                <>
                  <div className="start-icon">◈</div>
                  <h2>Demo Call Ready</h2>
                  <p>This demo simulates a live collections call with a financially vulnerable customer. Watch Sentinel detect vulnerability signals in real time and guide the agent through the conversation.</p>
                  <p className="start-hint">The call runs for approximately 48 seconds and escalates through monitor → soft prompt → hard alert → critical.</p>
                  <button className="start-call-btn" onClick={startCall}>Connect Call</button>
                </>
              )}
              {callStatus === 'connecting' && <><div className="connecting-spinner" /><p className="connecting-text">Connecting to call...</p></>}
            </div>
          </div>
        )}
        {callStatus === 'ended' && (
          <div className="call-ended-bar">
            <span>Call completed — CRM note auto-generated. Review and save below.</span>
            <button className="run-again-btn" onClick={resetDemo}>↺ Run Demo Again</button>
          </div>
        )}
        {(callStatus === 'active' || callStatus === 'ended') && (
          <div className="dashboard-grid">
            <TranscriptPanel transcript={transcript} callStatus={callStatus} />
            <AlertsPanel alerts={alerts} confidence={confidence} onAcknowledge={acknowledgeAlert} />
            <CRMPanel crmDraft={crmDraft} callStatus={callStatus} onUpdate={updateCRM} />
          </div>
        )}
      </div>
    </div>
  );
}
