import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import Typewriter from './Typewriter';
import CountUp from './CountUp';
import { useFinePointer, useReducedMotion } from '../hooks/useMediaQuery';
import './Hero.css';

const ROLES = [
  'Fraud Operations Lead',
  'Software Engineer',
  'Founder of Thrive Finance',
  'MSc AI student (soon)',
  'builder of internal tools',
];

const CV_MAILTO =
  'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';

function useLondonTime() {
  const [time, setTime] = useState('');
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'Europe/London',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
    const tick = () => setTime(fmt.format(new Date()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);
  return time;
}

/* The snippet on the hero card, as [cssClass, text] tokens so the line breaks
   survive JSX whitespace collapsing. */
type Token = [string, string];
const CODE: Token[][] = [
  [['tk-kw', 'const'], ['', ' '], ['tk-var', 'kelvin'], ['', ' '], ['tk-op', '='], ['', ' {']],
  [['', '  '], ['tk-key', 'role'], ['tk-op', ': '], ['tk-str', '"Fraud Ops Lead @ Nala"'], ['tk-op', ',']],
  [['', '  '], ['tk-key', 'builds'], ['tk-op', ': ['], ['tk-str', '"Thrive Finance"'], ['tk-op', ', '], ['tk-str', '"AgileFlow"'], ['tk-op', '],']],
  [['', '  '], ['tk-key', 'stack'], ['tk-op', ': ['], ['tk-str', '"React"'], ['tk-op', ', '], ['tk-str', '"TypeScript"'], ['tk-op', ', '], ['tk-str', '"Python"'], ['tk-op', '],']],
  [['', '  '], ['tk-key', 'degree'], ['tk-op', ': '], ['tk-str', '"BSc CS, First-Class"'], ['tk-op', ',']],
  [['', '  '], ['tk-key', 'next'], ['tk-op', ': '], ['tk-str', '"MSc AI & Machine Learning"'], ['tk-op', ',']],
  [['', '  '], ['tk-key', 'status'], ['tk-op', ': '], ['tk-str', '"open to SWE roles"'], ['tk-op', ',']],
  [['', '  '], ['tk-key', 'coffee'], ['tk-op', ': '], ['tk-num', 'Infinity'], ['tk-op', ',']],
  [['tk-op', '} '], ['tk-kw', 'as const'], ['tk-op', ';']],
];

/** Profile card that tilts towards the cursor. */
const ProfileCard: React.FC = () => {
  const ref = useRef<HTMLDivElement>(null);
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();
  const enabled = finePointer && !reducedMotion;

  const onMove = (e: React.MouseEvent) => {
    if (!enabled || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    ref.current.style.setProperty('--rx', `${(-py * 10).toFixed(2)}deg`);
    ref.current.style.setProperty('--ry', `${(px * 12).toFixed(2)}deg`);
    ref.current.style.setProperty('--mx', `${((px + 0.5) * 100).toFixed(1)}%`);
    ref.current.style.setProperty('--my', `${((py + 0.5) * 100).toFixed(1)}%`);
  };
  const onLeave = () => {
    if (!ref.current) return;
    ref.current.style.setProperty('--rx', '0deg');
    ref.current.style.setProperty('--ry', '0deg');
  };

  return (
    <motion.div
      className="hero-card-wrap"
      initial={{ opacity: 0, y: 30, rotate: -2 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
    >
      <div ref={ref} className="hero-card" onMouseMove={onMove} onMouseLeave={onLeave} data-cursor="link">
        <div className="hero-card-bar">
          <span className="hero-card-dots" aria-hidden="true"><i /><i /><i /></span>
          <span className="hero-card-file">kelvin.ts</span>
          <span className="hero-card-status" aria-hidden="true">● saved</span>
        </div>
        <pre className="hero-code" aria-label="A snippet describing Kelvin as a TypeScript object">
          {CODE.map((line, i) => (
            <span key={i} className="hero-code-line">
              {line.map((tok, j) => (
                <span key={j} className={tok[0]}>{tok[1]}</span>
              ))}
              {'\n'}
            </span>
          ))}
        </pre>
        <div className="hero-card-glow" aria-hidden="true" />
      </div>
    </motion.div>
  );
};

const Hero: React.FC = () => {
  const londonTime = useLondonTime();

  const handleCVRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = CV_MAILTO;
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.div
            className="hero-status-row"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="hero-badge">
              <span className="hero-badge-dot" />
              Available for opportunities
            </span>
            <span className="hero-clock" title="My local time">
              <span aria-hidden="true">📍</span> London · <span className="hero-clock-time">{londonTime || '--:--:--'}</span>
            </span>
          </motion.div>

          <h1 className="hero-title">
            <span className="hero-title-line">Hi, I'm</span>
            <span className="hero-title-name gradient-text">Kelvin Olasupo</span>
          </h1>

          <p className="hero-role">
            <span className="hero-role-prefix">I'm a </span>
            <Typewriter phrases={ROLES} className="hero-typewriter" />
          </p>

          <p className="hero-description">
            I build software that solves operational problems. Fraud tooling at{' '}
            <a href="https://www.nala.com/" target="_blank" rel="noopener noreferrer" className="hero-company-link">Nala</a>,
            a personal finance startup in production, and an MSc in AI on the way.
          </p>

          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary hero-cta-primary magnetic">
              View My Work
            </a>
            <a href="#contact" className="btn hero-cta-ghost magnetic">
              Get In Touch
            </a>
            <a href="#" onClick={handleCVRequest} className="btn hero-cta-ghost magnetic">
              Request CV
            </a>
          </div>

          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">1st</span>
              <span className="hero-stat-label">Class Honours</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value"><CountUp to={10} suffix="+" /></span>
              <span className="hero-stat-label">Projects Built</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value"><CountUp to={5} suffix="+" /></span>
              <span className="hero-stat-label">Tools shipped at Nala</span>
            </div>
          </div>

          <p className="hero-hint">
            <kbd>`</kbd> opens the terminal <span className="hero-hint-sep">·</span> try the Konami code
          </p>
        </motion.div>

        <ProfileCard />
      </div>

      <a href="#projects" className="hero-scroll-cue" aria-label="Scroll to projects">
        <span className="hero-mouse" aria-hidden="true"><span /></span>
        <span className="hero-scroll-text">scroll</span>
      </a>
    </section>
  );
};

export default Hero;
