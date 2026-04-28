import React from 'react';
import { ThemeToggle } from './ThemeToggle';
import type { Theme } from '../hooks/useTheme';

interface Props { onLaunch: () => void; theme: Theme; onToggleTheme: () => void; }

export function LandingPage({ onLaunch, theme, onToggleTheme }: Props) {
  return (
    <div className="landing">
      <header className="landing-header">
        <div className="logo">
          <span className="logo-icon">◈</span>
          <span className="logo-text">Sentinel</span>
          <span className="logo-badge">AI</span>
        </div>
        <nav className="landing-nav">
          <span>Collections</span><span>Banking</span><span>Lending</span><span>Utilities</span>
        </nav>
        <ThemeToggle theme={theme} onToggle={onToggleTheme} />
      </header>

      <main className="landing-main">
        <div className="landing-hero">
          <div className="hero-tag">Real-time Agent Assist · FCA Consumer Duty Ready</div>
          <h1 className="hero-title">
            Identify vulnerability.<br />
            Guide your agents.<br />
            <span className="hero-accent">In every live call.</span>
          </h1>
          <p className="hero-description">
            Sentinel listens to live collections calls, detects financial vulnerability signals in real time,
            and guides agents with intelligent prompts — so the right support reaches customers at the moment it matters most.
          </p>
          <div className="hero-cta">
            <button className="launch-btn" onClick={onLaunch}>
              Launch Demo <span className="btn-arrow">→</span>
            </button>
            <p className="demo-note">Uses simulated call data · No real customer data</p>
          </div>
        </div>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon blue-icon">◉</div>
            <h3>Detect</h3>
            <p>Real-time transcription and AI analysis surfaces vulnerability signals the moment they appear — not after the call ends.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon amber-icon">◈</div>
            <h3>Guide</h3>
            <p>Soft prompts and hard alerts give agents the right words and required actions, live during the call, calibrated by confidence level.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon green-icon">◇</div>
            <h3>Document</h3>
            <p>Structured CRM notes auto-generated with evidence, consent status, and support offered — agents confirm and save in one click.</p>
          </div>
        </div>

        <div className="confidence-legend">
          <div className="legend-item"><span className="legend-dot monitor-dot" /><span className="legend-label">20–49% Monitor</span></div>
          <div className="legend-divider" />
          <div className="legend-item"><span className="legend-dot soft-dot" /><span className="legend-label">50–74% Soft Prompt</span></div>
          <div className="legend-divider" />
          <div className="legend-item"><span className="legend-dot hard-dot" /><span className="legend-label">75%+ Hard Alert</span></div>
        </div>

        <div className="compliance-bar">
          <span>FCA Consumer Duty</span><span>UK GDPR</span><span>Human-in-the-loop</span>
          <span>Data Minimisation</span><span>Fairness Monitored</span><span>Agent empowerment — not replacement</span>
        </div>
      </main>
    </div>
  );
}
