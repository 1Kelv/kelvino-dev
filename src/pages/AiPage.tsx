import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, Sparkles, FileText, AlertTriangle } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  previewUrl?: string;
  fileName?: string;
}

const SUGGESTED = [
  "What could this rash be?",
  "Explain this discharge letter",
  "Is this normal for a newborn?",
  "What does this prescription mean?",
];

const MAX_FILE_BYTES = 3 * 1024 * 1024; // 3 MB raw → ~4 MB base64, safe under Vercel's 4.5 MB limit

function TypingDots() {
  return (
    <div className="flex gap-1 items-center py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-2 h-2 rounded-full bg-brand-mint"
          animate={{ y: [0, -6, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

function AiAvatar() {
  return (
    <motion.div
      className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-mint to-emerald-400 flex items-center justify-center flex-shrink-0 shadow"
      animate={{ scale: [1, 1.05, 1] }}
      transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
    >
      <Sparkles size={14} className="text-white" />
    </motion.div>
  );
}

export function AiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileError('');

    if (file.size > MAX_FILE_BYTES) {
      setFileError('File is too large (max 3 MB). Please compress or resize it.');
      e.target.value = '';
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    if (!allowed.includes(file.type)) {
      setFileError('Unsupported file type. Use JPEG, PNG, WebP, GIF, or PDF.');
      e.target.value = '';
      return;
    }

    setSelectedFile(file);
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async (text: string, file?: File | null) => {
    if (!text.trim() && !file) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      previewUrl: file?.type.startsWith('image/') ? previewUrl || undefined : undefined,
      fileName: file?.type === 'application/pdf' ? file.name : undefined,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    clearFile();
    setLoading(true);

    try {
      let fileBase64: string | undefined;
      let fileMediaType: string | undefined;
      let fileName: string | undefined;

      if (file) {
        const buffer = await file.arrayBuffer();
        fileBase64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
        fileMediaType = file.type;
        fileName = file.name;
      }

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text.trim(), fileBase64, fileMediaType, fileName }),
      });

      const data = await res.json();
      const reply = data.response || data.error || 'Sorry, something went wrong.';

      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_ai', role: 'assistant', text: reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_err', role: 'assistant', text: 'Sorry, I couldn\'t reach the AI right now. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input, selectedFile);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input, selectedFile);
    }
  };

  const isEmpty = messages.length === 0;

  return (
    <AppShell>
      <PageHeader title="Mylo — AI Companion" />

      {/* disclaimer */}
      <div className="mx-4 mt-2 mb-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3">
        <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
          For guidance only — always consult your GP, midwife, or paediatrician for medical advice.
        </p>
      </div>

      {/* chat area */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {isEmpty && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="text-center pt-6 pb-4"
          >
            <motion.div
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-mint to-emerald-400 flex items-center justify-center mx-auto mb-4 shadow-lg"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 2.5, ease: 'easeInOut' }}
            >
              <Sparkles size={30} className="text-white" />
            </motion.div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Hi, I'm Mylo</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 max-w-xs mx-auto">
              Your Mylestone AI companion. Upload a photo of a rash, a medical letter, or ask me anything about your baby's health.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => send(s)}
                  className="text-xs px-3 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-brand-mint hover:text-brand-mint transition-colors shadow-sm"
                >
                  {s}
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {msg.role === 'assistant' && <AiAvatar />}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
                {msg.previewUrl && (
                  <img
                    src={msg.previewUrl}
                    alt="Uploaded"
                    className="max-w-[200px] rounded-xl border border-gray-200 dark:border-gray-700 object-cover"
                  />
                )}
                {msg.fileName && (
                  <div className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                    <FileText size={16} className="text-brand-mint flex-shrink-0" />
                    <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{msg.fileName}</span>
                  </div>
                )}
                {msg.text && (
                  <div
                    className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                      msg.role === 'user'
                        ? 'bg-brand-mint text-white rounded-tr-sm'
                        : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm'
                    }`}
                  >
                    {msg.text}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex gap-2"
          >
            <AiAvatar />
            <div className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <TypingDots />
            </div>
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* input area */}
      <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        {fileError && (
          <p className="text-xs text-red-500 mb-2">{fileError}</p>
        )}

        <AnimatePresence>
          {selectedFile && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex items-center gap-2 bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-gray-200 dark:border-gray-700"
            >
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-10 h-10 rounded-lg object-cover" />
              ) : (
                <FileText size={20} className="text-brand-mint" />
              )}
              <span className="text-xs text-gray-700 dark:text-gray-300 flex-1 truncate">{selectedFile.name}</span>
              <button onClick={clearFile} className="text-gray-400 hover:text-red-400 transition-colors">
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <motion.button
            type="button"
            whileTap={{ scale: 0.92 }}
            onClick={() => fileRef.current?.click()}
            className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-brand-mint hover:border-brand-mint transition-colors flex-shrink-0"
          >
            <Paperclip size={18} />
          </motion.button>

          <textarea
            ref={textRef}
            rows={1}
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 120) + 'px';
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask Mylo about your baby's health…"
            className="flex-1 resize-none bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-mint/50 focus:border-brand-mint transition-colors min-h-[42px] max-h-[120px] overflow-y-auto"
          />

          <motion.button
            type="submit"
            disabled={loading || (!input.trim() && !selectedFile)}
            whileTap={{ scale: 0.92 }}
            className="p-2.5 rounded-xl bg-brand-mint text-white disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0 shadow"
          >
            <Send size={18} />
          </motion.button>
        </form>
        <p className="text-[10px] text-gray-400 dark:text-gray-600 text-center mt-2">
          Photos & documents are not stored · Always verify with a healthcare professional
        </p>
      </div>
    </AppShell>
  );
}
