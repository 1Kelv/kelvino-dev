import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useMediaQuery';
import './BootScreen.css';

const BOOT_KEY = 'kelvin-booted';

const LINES = [
  '> kelvin.dev boot sequence v2.0',
  '> loading profile .............. ok',
  '> compiling projects ........... ok',
  '> scanning for fraud ........... 0 threats',
  '> mounting portfolio ........... ok',
  '> welcome, visitor.',
];

/* Characters per line, and the running total, so a single counter can be
   turned back into "which lines are visible and how far into the last one". */
const LENGTHS = LINES.map(l => l.length);
const TOTAL = LENGTHS.reduce((a, b) => a + b, 0);
const CHAR_MS = 7;          // typing speed
const LINE_PAUSE_CHARS = 6; // a short beat between lines, counted in characters
const HOLD_MS = 320;        // pause on the finished screen before fading out

function alreadyBooted(): boolean {
  try {
    return sessionStorage.getItem(BOOT_KEY) === '1';
  } catch {
    return false;
  }
}

/** Turn a character count into the lines to render. */
function slice(count: number): string[] {
  const out: string[] = [];
  let left = count;
  for (let i = 0; i < LINES.length; i++) {
    if (left <= 0) break;
    const take = Math.min(left, LENGTHS[i]);
    out.push(LINES[i].slice(0, take));
    left -= take + LINE_PAUSE_CHARS;
  }
  return out;
}

const BootScreen: React.FC = () => {
  const reducedMotion = useReducedMotion();
  const [visible, setVisible] = useState<boolean>(() => !alreadyBooted());
  const [count, setCount] = useState(0);
  const finished = useRef(false);

  const totalWithPauses = useMemo(
    () => TOTAL + LINE_PAUSE_CHARS * (LINES.length - 1),
    []
  );

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    const startedAt = performance.now();
    let raf = 0;
    let hideTimer = 0;

    const finish = () => {
      if (finished.current) return;
      finished.current = true;
      try { sessionStorage.setItem(BOOT_KEY, '1'); } catch { /* ignore */ }
      setVisible(false);
    };

    // One rAF loop driven by elapsed time: immune to double-mounting, and it
    // cannot fall behind or type a character twice.
    const step = (now: number) => {
      const elapsed = now - startedAt;
      const typed = Math.floor(elapsed / CHAR_MS);
      setCount(Math.min(typed, totalWithPauses));
      if (typed >= totalWithPauses) {
        hideTimer = window.setTimeout(finish, HOLD_MS);
        return;
      }
      raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);

    window.addEventListener('keydown', finish);
    window.addEventListener('pointerdown', finish);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(hideTimer);
      window.removeEventListener('keydown', finish);
      window.removeEventListener('pointerdown', finish);
      document.body.style.overflow = '';
    };
  }, [visible, reducedMotion, totalWithPauses]);

  const lines = slice(count);
  const progress = Math.min(100, (count / totalWithPauses) * 100);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="boot-screen"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.45, ease: 'easeInOut' }}
        >
          <div className="boot-inner">
            <div className="boot-logo" aria-hidden="true">
              <span>K</span><span>O</span>
            </div>
            <pre className="boot-log">
              {lines.map((l, i) => (
                <span key={i} className={i === lines.length - 1 ? 'boot-line active' : 'boot-line'}>
                  {l}
                </span>
              ))}
            </pre>
            <div className="boot-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>
            <p className="boot-hint">press any key to skip</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
