import React, { useRef, useState, useLayoutEffect } from 'react';
import './Journey.css';

/** Small inner component for a single flip card */
function FlipCard({
  year,
  emoji,
  details,
  hint = 'Tap / click to reveal',
}: {
  year: string;
  emoji: string;
  details: React.ReactNode;
  hint?: string;
}) {
  const [flipped, setFlipped] = useState(false);
  const innerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);

  // Keep the container height equal to the visible face so nothing overlaps
  const syncHeight = () => {
    const inner = innerRef.current;
    if (!inner) return;
    const height = flipped
      ? (backRef.current?.scrollHeight ?? 170)
      : (frontRef.current?.scrollHeight ?? 170);
    inner.style.height = `${Math.max(height, 160)}px`;
  };

  useLayoutEffect(() => {
    syncHeight();
    const onResize = () => syncHeight();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [flipped]);

  const toggle = () => setFlipped(v => !v);

  return (
    <div
      className={`flip-card ${flipped ? 'flipped' : ''}`}
      onClick={toggle}
      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle()}
      role="button"
      tabIndex={0}
      aria-expanded={flipped}
      aria-label={`Journey ${year} ${flipped ? 'details shown' : 'details hidden'}`}
    >
      <div className="flip-card-inner" ref={innerRef}>
        {/* Front */}
        <div className="flip-card-front" ref={frontRef}>
          <div className="year-circle">
            <div className="year-emoji">{emoji}</div>
            <h3 className="year-text">{year}</h3>
          </div>
          <div className="flip-hint">
            <span className="hint-icon">👆</span>
            <span className="hint-text">{hint}</span>
          </div>
        </div>

        {/* Back */}
        <div className="flip-card-back" ref={backRef}>
          <div className="back-year-badge">{year}</div>
          <p className="journey-details">{details}</p>
        </div>
      </div>
    </div>
  );
}

export default function Journey() {
  // Your timeline entries
  const items = [
    {
      year: '2021',
      emoji: '📚',
      details: (
        <>
          Started Foundation Year in Computer Science at the University of Bedfordshire.
        </>
      ),
    },
    {
      year: '2022',
      emoji: '💻',
      details: (
        <>
          Developed PenCraft, a collaborative author portal built with HTML, CSS, and JavaScript. 
          This project helped me strengthen my understanding of front-end development and UI/UX basics, sparking my passion for software engineering.
        </>
      ),
    },
    {
      year: '2023',
      emoji: '🧠',
      details: (
        <>
          Learned Python and completed several university projects, including:

Taxi Booking System (Java + SQLite Studio)

Hotel Booking System (Java + SQLite Studio)

Designed and implemented a normalised ERD in Oracle APEX.
These experiences gave me a strong grounding in back-end logic, database management, and system design.
        </>
      ),
    },
    {
      year: '2024',
      emoji: '👨🏽‍💻',
      details: (
        <>
          Created the Banana Game, a full-stack API-fetching banana-themed game using HTML, CSS, JavaScript, Express.js, and MongoDB.
          This project sharpened my ability to integrate APIs and build interactive front-to-back solutions.
        </>
      ),
    },
    {
      year: '2025',
      emoji: '🎓',
      details: (
        <>
          Graduated with First-Class Honours in Computer Science.

Served as Risk Manager in a group Agile project, leading SHAP and LIME integration for AI fairness in the NextGen AI Resumer (AI-powered CV analyser).

Developed AgileFlow, my final-year project, which earned the Bronze Award for Innovation from SwitchShop Limited.

Joined Nala as Fraud Operations Lead, building internal SOPs, fraud detection frameworks, and data dashboards.

Currently preparing for a master’s degree in Artificial Intelligence & Machine Learning.
        </>
      ),
    },
  ];

  return (
    <section id="journey" className="journey">
      <h2 className="journey-title">Journey Till Date 🚀</h2>
      {/* Optional: <p className="journey-subtitle">Tap or click a year to reveal more.</p> */}
      <div className="journey-timeline">
        {items.map(item => (
          <FlipCard
            key={item.year}
            year={item.year}
            emoji={item.emoji}
            details={item.details}
          />
        ))}
      </div>
    </section>
  );
}
