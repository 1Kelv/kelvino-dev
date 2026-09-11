import React from 'react';
import './Marquee.css';

const ROW_ONE = [
  'React', 'TypeScript', 'Python', 'Node.js', 'Supabase', 'Appwrite', 'SQL',
  'Playwright', 'Streamlit', 'Hex', 'Claude AI', 'TensorFlow', 'Vite', 'Git',
];

const ROW_TWO = [
  'Fraud Operations', 'Regulation E', 'Chargeback Automation', 'Risk Dashboards',
  'First-Class Honours', 'Founder', 'MSc AI (in progress)', 'London',
  'Thrive Finance', 'AgileFlow', 'Mylestone', 'AlertIQ', 'Riposte',
];

const Row: React.FC<{ items: string[]; reverse?: boolean }> = ({ items, reverse }) => {
  const doubled = [...items, ...items];
  return (
    <div className={`marquee-row ${reverse ? 'reverse' : ''}`}>
      <div className="marquee-track">
        {doubled.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item" aria-hidden={i >= items.length}>
            {item}
            <span className="marquee-dot" aria-hidden="true">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
};

const Marquee: React.FC = () => (
  <div className="marquee" aria-label="Skills and interests">
    <Row items={ROW_ONE} />
    <Row items={ROW_TWO} reverse />
  </div>
);

export default Marquee;
