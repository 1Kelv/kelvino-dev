import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useReducedMotion } from '../hooks/useMediaQuery';
import './BootScreen.css';

const BOOT_KEY = 'kelvin-booted';

/* How long the whole sequence runs, end to end. The per-character speed is
   derived from this, so editing LINES below changes what is said without
   changing how long it takes. */
const BOOT_DURATION_MS = 20000;
const HOLD_MS = 1200;        // sit on the finished screen before fading out
const LINE_PAUSE_CHARS = 7;  // a beat between lines, measured in characters

const LINES = [
  '> kelvino.dev boot sequence v2.0',
  '> POST .............................. ok',
  '> mounting /dev/kelvin .............. ok',
  '',
  '> [auth]  verifying visitor ......... trusted',
  '> [core]  loading profile ........... ok',
  '',
  '    name:    Kelvin Olasupo',
  '    role:    Fraud Operations Lead @ Nala',
  '    degree:  BSc Computer Science, First-Class',
  '    status:  open to software engineering roles',
  '',
  '> [build] compiling projects ........ 4 found',
  '',
  '    thrive-finance ........ live, real users',
  '    agileflow ............. bronze award',
  '    mylestone ............. live',
  '    alertiq ............... live',
  '',
  '> [risk]  arming fraud detection .... ok',
  '> [risk]  scanning this session ..... 0 threats',
  '> [audio] tuning ambient synth ...... ok',
  '> [ui]    mounting portfolio ........ ok',
  '',
  '> welcome, visitor.',
  '> press ` at any time for a real terminal.',
];

const LENGTHS = LINES.map(l => l.length);

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

  const totalUnits = useMemo(
    () => LENGTHS.reduce((a, b) => a + b, 0) + LINE_PAUSE_CHARS * (LINES.length - 1),
    []
  );

  useEffect(() => {
    if (!visible) return;
    if (reducedMotion) {
      setVisible(false);
      return;
    }

    document.body.style.overflow = 'hidden';
    const charMs = BOOT_DURATION_MS / totalUnits;
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
      const typed = Math.floor((now - startedAt) / charMs);
      setCount(Math.min(typed, totalUnits));
      if (typed >= totalUnits) {
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
  }, [visible, reducedMotion, totalUnits]);

  const lines = slice(count);
  const progress = Math.min(100, (count / totalUnits) * 100);
  const secondsLeft = Math.max(0, Math.ceil((BOOT_DURATION_MS * (1 - count / totalUnits)) / 1000));

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
                <span
                  key={i}
                  className={i === lines.length - 1 ? 'boot-line active' : 'boot-line'}
                >
                  {l || ' '}
                </span>
              ))}
            </pre>

            <div className="boot-bar" aria-hidden="true">
              <span style={{ width: `${progress}%` }} />
            </div>

            <div className="boot-actions">
              <span className="boot-countdown" aria-hidden="true">
                {secondsLeft > 0 ? `${secondsLeft}s remaining` : 'ready'}
              </span>
              {/* Skipping is also bound to any key and any click, but a real
                  button makes that discoverable, especially on touch. */}
              <button type="button" className="boot-skip">
                Skip intro <span aria-hidden="true">→</span>
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootScreen;
