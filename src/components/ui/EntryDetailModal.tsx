import React from 'react';
import { Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export interface DetailField {
  label: string;
  value: string | undefined | null;
  markdown?: boolean;
}

interface EntryDetailModalProps {
  open: boolean;
  onClose: () => void;
  onEdit?: () => void;
  title: string;
  timestamp: string;
  badge?: React.ReactNode;
  fields: DetailField[];
  actions?: React.ReactNode;
}

export function EntryDetailModal({ open, onClose, onEdit, title, timestamp, badge, fields, actions }: EntryDetailModalProps) {
  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 z-50"
          />
          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl max-h-[85vh] overflow-y-auto"
            style={{ paddingBottom: 'env(safe-area-inset-bottom, 16px)' }}
          >
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 rounded-full bg-gray-200 dark:bg-gray-700" />
            </div>

            <div className="px-5 pt-3 pb-6 flex flex-col gap-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-xs text-gray-400 font-medium">{timestamp}</span>
                    {badge}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h2>
                </div>
                {onEdit && (
                  <button
                    onClick={() => { onClose(); setTimeout(onEdit, 150); }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-brand-light text-brand-dark text-sm font-semibold shrink-0"
                  >
                    <Pencil size={14} />
                    Edit
                  </button>
                )}
              </div>

              {/* Fields */}
              <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800">
                {fields.filter(f => f.value).map((field) => (
                  <div key={field.label} className="py-3 flex gap-3">
                    <span className="text-sm text-gray-400 dark:text-gray-500 w-28 shrink-0 pt-0.5">{field.label}</span>
                    {field.markdown ? (
                      <div className="text-sm text-gray-900 dark:text-white flex-1 prose prose-sm dark:prose-invert max-w-none prose-p:my-1 prose-ul:my-1 prose-li:my-0.5 prose-headings:mb-1">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0 leading-relaxed">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-outside pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-outside pl-4 mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="leading-relaxed">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
                            h3: ({ children }) => <h3 className="font-bold text-gray-900 dark:text-white mt-3 mb-1">{children}</h3>,
                            h4: ({ children }) => <h4 className="font-semibold mt-2 mb-1">{children}</h4>,
                          }}
                        >
                          {field.value as string}
                        </ReactMarkdown>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-900 dark:text-white font-medium flex-1">{field.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {actions}

              <button
                onClick={onClose}
                className="w-full py-3 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 font-semibold text-sm"
              >
                Close
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
