import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../UIContext';
import './Toasts.css';

const Toasts: React.FC = () => {
  const { toasts, dismissToast } = useUI();
  return (
    <div className="toast-stack" aria-live="polite">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.button
            key={t.id}
            className="toast"
            type="button"
            onClick={() => dismissToast(t.id)}
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            {t.emoji && <span className="toast-emoji" aria-hidden="true">{t.emoji}</span>}
            <span>{t.message}</span>
          </motion.button>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default Toasts;
