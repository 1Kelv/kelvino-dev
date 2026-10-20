import React from 'react';
import './Marquee.css';

const ROW_ONE = [
  'Fraud Operations', 'Detection & Controls', 'Disputes & Chargebacks', 'Payments Risk',
  'Fraud Strategy', 'Team Leadership', 'SQL', 'Snowflake', 'Hex', 'Metabase',
  'Python', 'React', 'TypeScript', 'Node.js',
];

const ROW_TWO = [
  '7+ years in fraud & risk', 'Built 0 to 6 analysts', 'Managed 20+ analysts',
  'Chargeback win rate 41% to 80%', '4M+ transactions analysed', '20 EU & UK markets',
  'Reg E Radar', 'Fraud Ops Pulse', 'Card Scheme Health', 'AlertIQ',
  'First-Class Honours', 'London',
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
