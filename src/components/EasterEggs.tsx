import React, { useEffect } from 'react';
import { useKonami } from '../hooks/useKonami';
import { useMagnetic } from '../hooks/useMagnetic';
import { useUI } from '../UIContext';
import './EasterEggs.css';

const EasterEggs: React.FC = () => {
  const { triggerKonami, konamiActive } = useUI();
  useKonami(triggerKonami);
  useMagnetic();

  useEffect(() => {
    document.body.classList.toggle('konami', konamiActive);
    return () => document.body.classList.remove('konami');
  }, [konamiActive]);

  // A little note for anyone who opens the dev tools.
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log(
      '%c👋 Hi, fellow developer.%c\nThis site is React + TypeScript + Vite, hand-written CSS, and a Web Audio synth.\nPress ` for the terminal. Source: https://github.com/1Kelv/kelvino-dev',
      'font-weight:700;font-size:14px;color:#818cf8',
      'color:inherit'
    );
  }, []);

  return konamiActive ? (
    <div className="konami-overlay" aria-hidden="true">
      <div className="konami-banner">🚨 FRAUD ALERT 🚨 unauthorised cheat code 🚨 access granted anyway 🚨</div>
    </div>
  ) : null;
};

export default EasterEggs;
