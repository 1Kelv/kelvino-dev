import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion, AnimatePresence } from 'framer-motion';

interface MilestoneCelebrationProps {
  babyName: string;
  months: number;
  onDismiss: () => void;
}

const BALLOON_COLOURS = ['#FF6B6B', '#4ECDC4', '#FFE66D', '#A78BFA', '#FB923C', '#34D399'];

function Balloon({ colour, x, delay }: { colour: string; x: number; delay: number }) {
  return (
    <motion.div
      className="absolute bottom-0 flex flex-col items-center pointer-events-none"
      style={{ left: `${x}%` }}
      initial={{ y: 0, opacity: 0 }}
      animate={{ y: '-110vh', opacity: [0, 1, 1, 0] }}
      transition={{ duration: 4.5 + Math.random() * 2, delay, ease: 'easeOut' }}
    >
      {/* Balloon body */}
      <motion.div
        animate={{ rotate: [-6, 6, -6] }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut', delay }}
        style={{ background: colour }}
        className="w-10 h-12 rounded-[50%_50%_45%_45%] shadow-md relative"
      >
        {/* Shine */}
        <div className="absolute top-1.5 left-2 w-2 h-3 bg-white/30 rounded-full" />
        {/* Knot */}
        <div
          className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
          style={{ background: colour }}
        />
      </motion.div>
      {/* String */}
      <div className="w-px h-8 bg-gray-400/60" />
    </motion.div>
  );
}

export function MilestoneCelebration({ babyName, months, onDismiss }: MilestoneCelebrationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const myConfetti = confetti.create(canvasRef.current, { resize: true, useWorker: true });

    const shoot = () => {
      myConfetti({
        particleCount: 120,
        spread: 90,
        origin: { x: 0.5, y: 0.55 },
        colors: BALLOON_COLOURS,
        scalar: 1.1,
      });
    };

    // Burst on open, then a smaller burst 800 ms later
    shoot();
    const t = setTimeout(() => {
      myConfetti({
        particleCount: 60,
        spread: 120,
        angle: 60,
        origin: { x: 0, y: 0.6 },
        colors: BALLOON_COLOURS,
      });
      myConfetti({
        particleCount: 60,
        spread: 120,
        angle: 120,
        origin: { x: 1, y: 0.6 },
        colors: BALLOON_COLOURS,
      });
    }, 800);

    return () => {
      clearTimeout(t);
      myConfetti.reset();
    };
  }, []);

  const balloons = BALLOON_COLOURS.map((colour, i) => ({
    colour,
    x: 5 + i * 16 + (Math.random() * 6 - 3),
    delay: i * 0.25,
  }));

  const ordinal = (n: number) => {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {/* Backdrop */}
        <motion.div
          className="absolute inset-0 bg-black/50"
          onClick={onDismiss}
        />

        {/* Canvas for confetti */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-10"
        />

        {/* Balloons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
          {balloons.map((b, i) => (
            <Balloon key={i} colour={b.colour} x={b.x} delay={b.delay} />
          ))}
        </div>

        {/* Card */}
        <motion.div
          className="relative z-20 mx-5 bg-white dark:bg-gray-900 rounded-3xl shadow-2xl p-7 flex flex-col items-center gap-4 text-center max-w-sm w-full"
          initial={{ scale: 0.7, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.15 }}
        >
          <motion.div
            className="text-5xl"
            animate={{ rotate: [0, -15, 15, -10, 10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            🎉
          </motion.div>

          <div>
            <p className="text-sm font-semibold text-brand-mint uppercase tracking-widest mb-1">
              Monthly Milestone
            </p>
            <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white font-heading leading-tight">
              {babyName} is {months} month{months > 1 ? 's' : ''} old today!
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Happy {ordinal(months)} month birthday, little one. 🎈
            </p>
          </div>

          <motion.button
            onClick={onDismiss}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="mt-1 w-full py-3 rounded-2xl bg-gradient-to-r from-brand-mint to-brand-dark text-white font-bold text-sm shadow-md"
          >
            Celebrate! 🎊
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
