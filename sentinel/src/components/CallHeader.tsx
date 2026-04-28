import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';
import type { CallStatus } from '../types';

interface Props { callStatus: CallStatus; elapsed: number; theme: Theme; onToggleTheme: () => void; onReset: () => void; }

function formatElapsed(ms: number): string {
  const s = Math.floor(ms / 1000);
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function CallHeader({ callStatus, elapsed, theme, onToggleTheme, onReset }: Props) {
  return (
    <div className="call-header">
      <div className="call-header-left">
        <div className={`status-indicator status-${callStatus}`}>
          {callStatus === 'active' && <span className="pulse-dot" />}
          {callStatus === 'connecting' && <span className="connecting-dot" />}
          {callStatus === 'ended' && <span className="ended-dot" />}
          {callStatus === 'idle' && <span className="idle-dot" />}
          <span className="status-label">
            {callStatus === 'idle' && 'Ready'}{callStatus === 'connecting' && 'Connecting...'}
            {callStatus === 'active' && 'Live Call'}{callStatus === 'ended' && 'Call Ended'}
          </span>
        </div>
        {(callStatus === 'active' || callStatus === 'ended') && (
          <div className="call-meta">
            <span className="call-customer">Mr Anderson</span>
            <span className="call-account">Acc #4721 · £1,247 outstanding</span>
          </div>
        )}
      </div>
      <div className="call-header-center">
        {(callStatus === 'active' || callStatus === 'ended') && (
          <div className={`call-timer ${callStatus === 'ended' ? 'timer-ended' : ''}`}>{formatElapsed(elapsed)}</div>
        )}
      </div>
      <div className="call-header-right">
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
        <button className="sentinel-logo-btn" onClick={onReset}>
          <span className="logo-icon-sm">◈</span> Sentinel
        </button>
      </div>
    </div>
  );
}
