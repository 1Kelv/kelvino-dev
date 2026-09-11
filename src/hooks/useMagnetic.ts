import { useEffect } from 'react';
import { useFinePointer, useReducedMotion } from './useMediaQuery';

/** Buttons with the `.magnetic` class lean towards the cursor when it is near. */
export function useMagnetic(selector = '.magnetic', strength = 0.35) {
  const finePointer = useFinePointer();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (!finePointer || reducedMotion) return;
    const elements = Array.from(document.querySelectorAll<HTMLElement>(selector));
    const cleanups = elements.map(el => {
      const onMove = (e: MouseEvent) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
      };
      const onLeave = () => { el.style.transform = ''; };
      el.addEventListener('mousemove', onMove);
      el.addEventListener('mouseleave', onLeave);
      return () => {
        el.removeEventListener('mousemove', onMove);
        el.removeEventListener('mouseleave', onLeave);
      };
    });
    return () => cleanups.forEach(fn => fn());
  }, [selector, strength, finePointer, reducedMotion]);
}
