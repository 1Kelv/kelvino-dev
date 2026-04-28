import { useState, useEffect, useRef, useCallback } from 'react';
import { DEMO_STEPS, CALL_DURATION, DEMO_CRM_NOTE } from '../data/demoScript';
import type { TranscriptEntry, VulnerabilityAlert, CRMDraft, CallStatus } from '../types';

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${String(m).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}

export function useDemoCall() {
  const [callStatus, setCallStatus] = useState<CallStatus>('idle');
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [alerts, setAlerts] = useState<VulnerabilityAlert[]>([]);
  const [confidence, setConfidence] = useState(0);
  const [elapsed, setElapsed] = useState(0);
  const [crmDraft, setCrmDraft] = useState<CRMDraft | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepIndexRef = useRef(0);
  const callEndedRef = useRef(false);

  const startCall = useCallback(() => {
    setCallStatus('connecting');
    setTimeout(() => {
      setCallStatus('active');
      startTimeRef.current = Date.now();
      stepIndexRef.current = 0;
      callEndedRef.current = false;
    }, 1500);
  }, []);

  const resetDemo = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCallStatus('idle'); setTranscript([]); setAlerts([]);
    setConfidence(0); setElapsed(0); setCrmDraft(null);
    startTimeRef.current = null; stepIndexRef.current = 0; callEndedRef.current = false;
  }, []);

  const acknowledgeAlert = useCallback((id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, acknowledged: true } : a));
  }, []);

  const updateCRM = useCallback((updates: Partial<CRMDraft>) => {
    setCrmDraft(prev => prev ? { ...prev, ...updates } : prev);
  }, []);

  useEffect(() => {
    if (callStatus !== 'active') return;
    intervalRef.current = setInterval(() => {
      if (!startTimeRef.current) return;
      const now = Date.now() - startTimeRef.current;
      setElapsed(now);
      while (stepIndexRef.current < DEMO_STEPS.length) {
        const step = DEMO_STEPS[stepIndexRef.current];
        if (now < step.delay) break;
        const stepIdx = stepIndexRef.current;
        step.entries.forEach((entry, i) => {
          setTranscript(prev => [...prev, { id: `${stepIdx}-${i}`, speaker: entry.speaker, text: entry.text, timestamp: formatTime(now) }]);
        });
        if (step.alert) {
          const { alert } = step;
          setAlerts(prev => [...prev, { ...alert, id: `alert-${stepIdx}`, timestamp: formatTime(now), acknowledged: false }]);
          setConfidence(alert.confidence);
        }
        stepIndexRef.current++;
      }
      if (now >= CALL_DURATION && !callEndedRef.current) {
        callEndedRef.current = true;
        setCallStatus('ended');
        setCrmDraft(DEMO_CRM_NOTE);
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
    }, 100);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [callStatus]);

  return { callStatus, transcript, alerts, confidence, elapsed, crmDraft, startCall, resetDemo, acknowledgeAlert, updateCRM };
}
