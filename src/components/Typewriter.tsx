import React, { useEffect, useState } from 'react';
import { useReducedMotion } from '../hooks/useMediaQuery';

interface Props {
  phrases: string[];
  typeSpeed?: number;
  deleteSpeed?: number;
  pause?: number;
  className?: string;
}

const Typewriter: React.FC<Props> = ({ phrases, typeSpeed = 55, deleteSpeed = 30, pause = 1800, className }) => {
  const reducedMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [text, setText] = useState(reducedMotion ? phrases[0] : '');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (reducedMotion) {
      setText(phrases[index]);
      const t = window.setTimeout(() => setIndex(i => (i + 1) % phrases.length), pause * 2);
      return () => window.clearTimeout(t);
    }

    const full = phrases[index];
    let delay = deleting ? deleteSpeed : typeSpeed;

    if (!deleting && text === full) delay = pause;
    else if (deleting && text === '') delay = 320;

    const t = window.setTimeout(() => {
      if (!deleting && text === full) {
        setDeleting(true);
      } else if (deleting && text === '') {
        setDeleting(false);
        setIndex(i => (i + 1) % phrases.length);
      } else {
        setText(deleting ? full.slice(0, text.length - 1) : full.slice(0, text.length + 1));
      }
    }, delay);

    return () => window.clearTimeout(t);
  }, [text, deleting, index, phrases, typeSpeed, deleteSpeed, pause, reducedMotion]);

  return (
    <span className={className} aria-live="polite" aria-atomic="true">
      {text}
      <span className="typewriter-caret" aria-hidden="true">|</span>
    </span>
  );
};

export default Typewriter;
