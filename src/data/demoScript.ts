import type { DemoStep, CRMDraft } from '../types';

export const CALL_DURATION = 48000;

export const DEMO_STEPS: DemoStep[] = [
  {
    delay: 800,
    entries: [
      { speaker: 'agent', text: "Good afternoon, this is Sarah calling from Hartley Collections. Am I speaking with Mr Anderson?" },
    ],
  },
  {
    delay: 3800,
    entries: [{ speaker: 'customer', text: "Yes, speaking." }],
  },
  {
    delay: 5800,
    entries: [
      {
        speaker: 'agent',
        text: "Thank you Mr Anderson. I'm calling about your account ending 4721. There's an outstanding balance of £1,247. I wanted to discuss some repayment options with you today.",
      },
    ],
  },
  {
    delay: 11000,
    entries: [{ speaker: 'customer', text: "Right, yeah. I've actually been meaning to get in touch." }],
  },
  {
    delay: 13500,
    entries: [{ speaker: 'agent', text: "I'm glad you said that. How are things going for you at the moment?" }],
  },
  {
    delay: 17000,
    entries: [
      { speaker: 'customer', text: "Honestly, not great. Things have been really tough since the back end of last year." },
    ],
    alert: {
      level: 'monitor',
      confidence: 35,
      category: 'financial_distress',
      headline: 'Customer indicating general difficulty',
      evidence: '"Things have been really tough since last year"',
      agentPrompt: 'Listen carefully and allow the customer to expand without pressure.',
    },
  },
  {
    delay: 21000,
    entries: [
      { speaker: 'agent', text: "I'm sorry to hear that. Would you mind telling me a bit more about what's been happening?" },
    ],
  },
  {
    delay: 25000,
    entries: [
      {
        speaker: 'customer',
        text: "I was made redundant back in November. I've been on Universal Credit since then but it barely covers the basics.",
      },
    ],
    alert: {
      level: 'soft',
      confidence: 64,
      category: 'life_event',
      headline: 'Income loss — possible financial vulnerability',
      evidence: '"Made redundant in November" + "on Universal Credit"',
      agentPrompt:
        'Ask whether their financial situation has changed further. Explore whether income instability is ongoing.',
    },
  },
  {
    delay: 30000,
    entries: [{ speaker: 'agent', text: "That must have been really difficult. Are you currently looking for work?" }],
  },
  {
    delay: 33500,
    entries: [
      {
        speaker: 'customer',
        text: "I am yeah. But in the meantime I've had to dip into my overdraft and, if I'm honest, I've been using one credit card to pay another.",
      },
    ],
    alert: {
      level: 'hard',
      confidence: 83,
      category: 'financial_distress',
      headline: 'Confirmed financial distress — debt cycling detected',
      evidence: '"Using one credit card to pay another" + overdraft dependency',
      agentPrompt: 'Obtain consent to record vulnerability. Pause collections pressure. Offer a temporary arrangement.',
      requiredAction: 'Pause collections activity. Obtain vulnerability consent. Offer support options.',
    },
  },
  {
    delay: 39000,
    entries: [
      { speaker: 'agent', text: "Thank you for being honest with me. Is there anyone else at home depending on you financially?" },
    ],
  },
  {
    delay: 42500,
    entries: [
      {
        speaker: 'customer',
        text: "My two kids, yeah. And my partner left earlier this year so it's just me managing everything now.",
      },
    ],
    alert: {
      level: 'hard',
      confidence: 91,
      category: 'life_event',
      headline: 'Multiple vulnerabilities — single parent, relationship breakdown',
      evidence: 'Single parent | Two dependent children | Relationship breakdown',
      agentPrompt:
        'Signpost StepChange or internal SST. Discuss long-term support. Do not pursue payment today.',
      requiredAction: 'Refer to Specialist Support Team. Do not request payment this call.',
    },
  },
  {
    delay: 45500,
    entries: [
      {
        speaker: 'customer',
        text: "Some days I just... I don't really know how I'm going to get through it all. It feels like too much.",
      },
    ],
    alert: {
      level: 'critical',
      confidence: 96,
      category: 'wellbeing',
      headline: 'Wellbeing concern — potential emotional distress',
      evidence: '"Don\'t know how I\'m going to get through it all" + "feels like too much"',
      agentPrompt:
        'Pause. Check in directly. Ask how they are feeling right now. Offer to call back if needed.',
      requiredAction: 'Perform wellbeing check. Escalate to team manager. No collections activity.',
    },
  },
];

const reviewDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

export const DEMO_CRM_NOTE: CRMDraft = {
  vulnerabilityTypes: [
    'Financial Distress',
    'Life Event — Redundancy',
    'Life Event — Relationship Breakdown',
    'Wellbeing Concern',
  ],
  evidenceSnippets: [
    'Made redundant November — on Universal Credit',
    'Debt cycling — using credit card to pay credit card',
    'Single parent with two dependent children',
    '"Don\'t know how I\'m going to get through it all"',
  ],
  consentObtained: false,
  supportOffered: ['Temporary payment pause', 'StepChange referral', 'Specialist Support Team referral'],
  agentNotes: '',
  reviewDate,
  escalationRequired: true,
};
