import React from 'react';
import './ToolingTile.css';

/*
  Stand-in artwork for the Nala fraud-tooling card.

  The tools are internal, so there is no screenshot to show and no honest way
  to get one. A company logo would be worse than nothing: it is Nala's mark,
  not the work, and it tells a visitor nothing about what was built. So this
  renders a small abstract of the tooling itself, in the site's own palette.
*/

const TOOLS = [
  { name: 'Reg E Radar', meta: 'dispute assessment', level: 86, state: 'ok' },
  { name: 'Fraud Ops Pulse', meta: 'automated reporting', level: 72, state: 'ok' },
  { name: 'Card Scheme Health', meta: 'auth & 3DS monitoring', level: 94, state: 'watch' },
];

const ToolingTile: React.FC = () => (
  <div className="tooling-tile" aria-hidden="true">
    <div className="tooling-grid" />
    <div className="tooling-head">
      <span className="tooling-dot" />
      fraud ops tooling
      <span className="tooling-head-right">live</span>
    </div>

    <ul className="tooling-rows">
      {TOOLS.map(t => (
        <li key={t.name} className="tooling-row">
          <span className={`tooling-state tooling-state-${t.state}`} />
          <span className="tooling-name">
            {t.name}
            <em>{t.meta}</em>
          </span>
          <span className="tooling-bar">
            <span style={{ width: `${t.level}%` }} />
          </span>
        </li>
      ))}
    </ul>

    <div className="tooling-foot">
      <span><b>41%</b> → <b>80%</b> win rate</span>
      <span><b>4M+</b> txns</span>
      <span><b>20</b> markets</span>
    </div>
  </div>
);

export default ToolingTile;
