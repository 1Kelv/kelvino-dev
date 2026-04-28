import React, { useState } from 'react';
import type { CRMDraft, CallStatus } from '../types';

interface Props { crmDraft: CRMDraft | null; callStatus: CallStatus; onUpdate: (u: Partial<CRMDraft>) => void; }

export function CRMPanel({ crmDraft, callStatus, onUpdate }: Props) {
  const [saved, setSaved] = useState(false);
  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 3000); };

  if (callStatus === 'idle' || callStatus === 'connecting') {
    return <div className="crm-panel"><div className="panel-header"><span className="panel-title">CRM Note</span></div><div className="panel-empty">CRM note will auto-generate when vulnerability is detected.</div></div>;
  }
  if (!crmDraft) {
    return <div className="crm-panel"><div className="panel-header"><span className="panel-title">CRM Note</span><span className="crm-badge-pending">Listening...</span></div><div className="panel-empty">Monitoring for vulnerability signals...</div></div>;
  }

  return (
    <div className="crm-panel crm-ready">
      <div className="panel-header"><span className="panel-title">CRM Note Draft</span><span className="crm-badge-ready">Auto-generated</span></div>
      <div className="crm-body">
        <div className="crm-field">
          <label>Vulnerability Types</label>
          <div className="tag-list">{crmDraft.vulnerabilityTypes.map((v, i) => <span key={i} className="tag tag-vuln">{v}</span>)}</div>
        </div>
        <div className="crm-field">
          <label>Evidence</label>
          <ul className="evidence-list">{crmDraft.evidenceSnippets.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>
        <div className="crm-field">
          <label>Consent Obtained</label>
          <button className={`consent-toggle ${crmDraft.consentObtained ? 'consent-yes' : ''}`} onClick={() => onUpdate({ consentObtained: !crmDraft.consentObtained })}>
            {crmDraft.consentObtained ? '✓ Yes — consent recorded' : '✗ Not yet obtained'}
          </button>
        </div>
        <div className="crm-field">
          <label>Support Offered</label>
          <div className="tag-list">{crmDraft.supportOffered.map((s, i) => <span key={i} className="tag tag-support">{s}</span>)}</div>
        </div>
        <div className="crm-field">
          <label>Review Date</label>
          <input type="date" className="crm-input" value={crmDraft.reviewDate} onChange={e => onUpdate({ reviewDate: e.target.value })} />
        </div>
        <div className="crm-field">
          <label>Agent Notes</label>
          <textarea className="crm-textarea" placeholder="Add any additional context..." value={crmDraft.agentNotes} rows={3} onChange={e => onUpdate({ agentNotes: e.target.value })} />
        </div>
        {crmDraft.escalationRequired && <div className="escalation-notice">⚠ Escalation required — refer to Specialist Support Team</div>}
        <button className={`save-crm-btn ${saved ? 'save-success' : ''}`} onClick={handleSave}>{saved ? '✓ Saved to CRM' : 'Save to CRM'}</button>
      </div>
    </div>
  );
}
