import React, { useEffect, useRef } from 'react';
import { ambient } from '../audio/ambient';
import { useUI } from '../UIContext';
import './MusicPlayer.css';

const BARS = 5;

const MusicPlayer: React.FC = () => {
  const { musicOn, toggleMusic } = useUI();
  const barsRef = useRef<HTMLSpanElement[]>([]);

  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const levels = ambient.levels(BARS);
      barsRef.current.forEach((bar, i) => {
        if (!bar) return;
        const h = musicOn ? Math.max(18, (levels[i] / 255) * 100) : 18;
        bar.style.transform = `scaleY(${h / 100})`;
      });
      raf = requestAnimationFrame(loop);
    };
    if (musicOn) raf = requestAnimationFrame(loop);
    else barsRef.current.forEach(bar => { if (bar) bar.style.transform = 'scaleY(0.18)'; });
    return () => cancelAnimationFrame(raf);
  }, [musicOn]);

  return (
    <button
      type="button"
      className={`music-pill ${musicOn ? 'on' : ''}`}
      onClick={toggleMusic}
      aria-pressed={musicOn}
      aria-label={musicOn ? 'Turn ambient music off' : 'Turn ambient music on'}
      title={musicOn ? 'Ambient on (click to mute)' : 'Play ambient music (generated live)'}
      data-cursor="link"
    >
      <span className="music-bars" aria-hidden="true">
        {Array.from({ length: BARS }).map((_, i) => (
          <span
            key={i}
            ref={el => { if (el) barsRef.current[i] = el; }}
            className="music-bar"
          />
        ))}
      </span>
      <span className="music-label">
        <span className="music-title">{musicOn ? 'ambient · on' : 'ambient · off'}</span>
        <span className="music-sub">{musicOn ? 'generated live in your browser' : 'click for lo-fi synth'}</span>
      </span>
    </button>
  );
};

export default MusicPlayer;
