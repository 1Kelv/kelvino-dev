import React, { useState } from 'react';
import { CheckSquare, Square, Trash2, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoundQuestion } from './hospitalExtras';
import { Button } from '../ui/Button';

interface RoundQuestionsProps {
  questions: RoundQuestion[];
  onChange: (questions: RoundQuestion[]) => void;
}

export function RoundQuestions({ questions, onChange }: RoundQuestionsProps) {
  const [newText, setNewText] = useState('');

  const handleToggle = (id: string) => {
    onChange(questions.map((q) => (q.id === id ? { ...q, asked: !q.asked } : q)));
  };

  const handleDelete = (id: string) => {
    onChange(questions.filter((q) => q.id !== id));
  };

  const handleAdd = () => {
    if (!newText.trim()) return;
    const newQ: RoundQuestion = {
      id: `rq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      text: newText.trim(),
      asked: false,
    };
    onChange([...questions, newQ]);
    setNewText('');
  };

  const handleClearAsked = () => {
    onChange(questions.filter((q) => !q.asked));
  };

  const askedCount = questions.filter((q) => q.asked).length;

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Round Questions</p>
        {askedCount > 0 && (
          <button
            onClick={handleClearAsked}
            className="flex items-center gap-1 text-xs font-semibold text-gray-400 hover:text-red-400 transition-colors"
          >
            <RotateCcw size={11} />
            Clear asked ({askedCount})
          </button>
        )}
      </div>

      <div className="flex flex-col gap-1.5">
        <AnimatePresence initial={false}>
          {questions.map((q) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -16, height: 0 }}
              transition={{ type: 'spring', stiffness: 360, damping: 26 }}
              className="flex items-start gap-2 group"
            >
              <button
                onClick={() => handleToggle(q.id)}
                className={`flex-shrink-0 mt-0.5 transition-colors ${q.asked ? 'text-brand-mint' : 'text-gray-300 dark:text-gray-600'}`}
              >
                {q.asked ? <CheckSquare size={18} /> : <Square size={18} />}
              </button>
              <p
                className={`flex-1 text-sm leading-snug pt-0.5 ${
                  q.asked ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-700 dark:text-gray-300'
                }`}
              >
                {q.text}
              </p>
              <button
                onClick={() => handleDelete(q.id)}
                className="p-0.5 flex-shrink-0 text-gray-300 dark:text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100 mt-0.5"
              >
                <Trash2 size={12} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {questions.length === 0 && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic py-1">
            No questions yet. Add questions for the next ward round below.
          </p>
        )}
      </div>

      <div className="flex gap-2 mt-3">
        <input
          value={newText}
          onChange={(e) => setNewText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
          placeholder="Add a question for the round…"
          className="flex-1 text-sm rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30"
        />
        <Button type="button" onClick={handleAdd} size="sm" disabled={!newText.trim()}>
          Add
        </Button>
      </div>
    </div>
  );
}
