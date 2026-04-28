import React, { useEffect, useRef } from 'react';
import type { TranscriptEntry, CallStatus } from '../types';

interface Props { transcript: TranscriptEntry[]; callStatus: CallStatus; }

export function TranscriptPanel({ transcript, callStatus }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [transcript]);

  return (
    <div className="transcript-panel">
      <div className="panel-header">
        <span className="panel-title">Live Transcript</span>
        {callStatus === 'active' && <span className="transcribing-badge"><span className="dot-pulse" />Transcribing</span>}
        {callStatus === 'ended' && <span className="ended-badge">Complete</span>}
      </div>
      <div className="transcript-body">
        {transcript.length === 0 && (
          <div className="transcript-empty">
            {callStatus === 'connecting' ? 'Connecting to call...' : 'Transcript will appear here when the call begins.'}
          </div>
        )}
        {transcript.map(entry => (
          <div key={entry.id} className={`transcript-entry entry-${entry.speaker}`}>
            <div className="entry-meta">
              <span className="entry-speaker">{entry.speaker === 'agent' ? 'Agent' : 'Customer'}</span>
              <span className="entry-time">{entry.timestamp}</span>
            </div>
            <div className="entry-text">{entry.text}</div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
