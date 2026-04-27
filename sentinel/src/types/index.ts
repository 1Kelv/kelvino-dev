export type Speaker = 'agent' | 'customer';
export type AlertLevel = 'monitor' | 'soft' | 'hard' | 'critical';
export type VulnerabilityCategory =
  | 'financial_distress'
  | 'life_event'
  | 'health'
  | 'capability'
  | 'wellbeing';

export interface TranscriptEntry {
  id: string;
  speaker: Speaker;
  text: string;
  timestamp: string;
}

export interface VulnerabilityAlert {
  id: string;
  level: AlertLevel;
  category: VulnerabilityCategory;
  confidence: number;
  headline: string;
  evidence: string;
  agentPrompt: string;
  requiredAction?: string;
  timestamp: string;
  acknowledged: boolean;
}

export interface CRMDraft {
  vulnerabilityTypes: string[];
  evidenceSnippets: string[];
  consentObtained: boolean;
  supportOffered: string[];
  agentNotes: string;
  reviewDate: string;
  escalationRequired: boolean;
}

export type CallStatus = 'idle' | 'connecting' | 'active' | 'ended';

export interface DemoStep {
  delay: number;
  entries: Array<{ speaker: Speaker; text: string }>;
  alert?: {
    level: AlertLevel;
    category: VulnerabilityCategory;
    confidence: number;
    headline: string;
    evidence: string;
    agentPrompt: string;
    requiredAction?: string;
  };
}
