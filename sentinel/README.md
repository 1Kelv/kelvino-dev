# Sentinel AI

**Real-time vulnerability intelligence for collections and debt support teams.**

Sentinel listens to live customer calls, detects financial vulnerability signals as they happen, and guides agents with intelligent prompts — so the right support reaches customers at the moment it matters most.

> This is not a chatbot. This is not post-call analytics.
> This is a **voice-first, real-time agent assist platform**.

---

## The Problem

Contact centre agents in collections and debt support roles carry enormous cognitive load. They must simultaneously listen, take notes, identify vulnerability signals, follow compliance requirements, and navigate internal systems — all on a live call.

The result: vulnerability is missed, documentation is inconsistent, and regulatory risk increases.

Most tools analyse calls **after** they end. But vulnerability must be identified **during** the call so agents can gather consent, offer support, adjust treatment, and update the CRM correctly.

---

## What Sentinel Does

| Step | What happens |
|---|---|
| **Listens** | Transcribes the live call in real time |
| **Detects** | AI identifies vulnerability signals by phrase, pattern, and context |
| **Guides** | Soft prompts and hard alerts appear on the agent's screen |
| **Documents** | CRM note is auto-generated with evidence, consent, and support offered |
| **Audits** | A clean, structured record is created for every flagged call |

---

## Confidence Thresholds

Sentinel calibrates alerts by confidence level so agents are guided — not overwhelmed.

| Range | Level | Action |
|---|---|---|
| 20–49% | Monitor | Silent observation — agent remains aware |
| 50–74% | Soft Prompt | Gentle nudge to explore further |
| 75–100% | Hard Alert | Mandatory steps — consent, support, pause collections |

---

## Demo

The MVP includes a fully simulated 48-second live call that escalates through all four stages:

1. Customer indicates general difficulty → **Monitor (35%)**
2. Redundancy and Universal Credit disclosed → **Soft Prompt (64%)**
3. Debt cycling behaviour confirmed → **Hard Alert (83%)**
4. Relationship breakdown, single parent → **Hard Alert (91%)**
5. Wellbeing concern expressed → **Critical (96%)**

At call end, a structured CRM note is auto-generated and ready to confirm.

---

## Features

- Real-time call transcript with agent/customer lanes
- Animated confidence meter with soft/hard thresholds marked
- Colour-coded alert cards with flash effects on escalation
- Agent prompts and required actions per alert level
- Auto-generated CRM note draft (vulnerability type, evidence, consent, support offered, review date)
- Dark and light mode with preference saved to localStorage
- FCA Consumer Duty aligned — human-in-the-loop, no automated decisions

---

## Vulnerability Categories Detected

- Financial distress (income loss, debt cycling, overdraft reliance)
- Life events (redundancy, bereavement, relationship breakdown)
- Health and capability issues
- Wellbeing and emotional distress signals
- Coercion and sensitive situation indicators

---

## Getting Started

```bash
git clone https://github.com/1Kelv/sentinel.git
cd sentinel
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and click **Launch Demo**.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build | Vite 4 |
| Styling | CSS custom properties (no framework) |
| State | React hooks (useState, useEffect, useReducer) |
| Theme | CSS `data-theme` attribute + localStorage |
| Demo engine | Custom hook with interval-based script playback |

---

## Roadmap

- [ ] Live speech-to-text integration (Deepgram / Whisper)
- [ ] Real NLP vulnerability classification model
- [ ] CRM integrations (Salesforce, Dynamics, Freshdesk)
- [ ] Multi-language support
- [ ] QA automation and compliance scoring
- [ ] Conversation analytics dashboard
- [ ] Enterprise SSO and role-based access

---

## Ethical Design Principles

Sentinel is designed around human-centred, responsible AI:

- **Human-in-the-loop** — AI never makes decisions or denies services
- **Transparency** — customers are informed that AI may assist agents
- **Fairness** — models are monitored to prevent bias by accent, tone, or language style
- **Data minimisation** — only the data necessary for vulnerability support is retained
- **Opt-out** — customers can request that AI assistance is disabled for their call

---

## Compliance

- FCA Consumer Duty
- UK GDPR
- Data Protection Act 2018
- FCA CONC and MCOB guidelines

---

## Licence

Private — all rights reserved. Built by [Kelvin Olasupo](https://github.com/1Kelv).
