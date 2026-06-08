import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Paperclip, X, Sparkles, FileText, AlertTriangle, RefreshCw, Copy, Check, Pencil } from 'lucide-react';
import { AppShell } from '../components/layout/AppShell';
import { PageHeader } from '../components/layout/PageHeader';

interface Attachment {
  previewUrl?: string;
  fileName?: string;
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  attachments?: Attachment[];
  isError?: boolean;
  retryText?: string;
}

interface PendingFile {
  file: File;
  previewUrl?: string;
}

const SUGGESTED = [
  "What could this rash be?",
  "Explain this discharge letter",
  "Is this normal for a newborn?",
  "What does this prescription mean?",
];

const MAX_FILE_BYTES = 4 * 1024 * 1024; // 4 MB per file
const MAX_FILES = 5;

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

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  const chunkSize = 8192;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.slice(i, i + chunkSize));
  }
  return btoa(binary);
}

async function compressImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const MAX = 1024;
      let { width, height } = img;
      if (width > MAX || height > MAX) {
        if (width > height) { height = Math.round(height * MAX / width); width = MAX; }
        else { width = Math.round(width * MAX / height); height = MAX; }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      canvas.getContext('2d')!.drawImage(img, 0, 0, width, height);
      URL.revokeObjectURL(url);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
      resolve(dataUrl.split(',')[1]);
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Image load failed')); };
    img.src = url;
  });
}

export function AiPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [pendingFiles, setPendingFiles] = useState<PendingFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [fileError, setFileError] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files || []);
    if (!incoming.length) return;
    setFileError('');

    const remaining = MAX_FILES - pendingFiles.length;
    if (remaining <= 0) {
      setFileError(`Maximum ${MAX_FILES} files per message.`);
      e.target.value = '';
      return;
    }

    const allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'application/pdf'];
    const toAdd: PendingFile[] = [];

    for (const file of incoming.slice(0, remaining)) {
      if (file.size > MAX_FILE_BYTES) {
        setFileError(`"${file.name}" is too large (max 4 MB).`);
        continue;
      }
      if (!allowed.includes(file.type)) {
        setFileError(`"${file.name}" is not supported. Use JPEG, PNG, WebP, GIF, or PDF.`);
        continue;
      }
      toAdd.push({
        file,
        previewUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      });
    }

    if (toAdd.length) setPendingFiles((prev) => [...prev, ...toAdd]);
    e.target.value = '';
  };

  const removeFile = (idx: number) => {
    setPendingFiles((prev) => {
      const copy = [...prev];
      copy.splice(idx, 1);
      return copy;
    });
  };

  const clearFiles = () => {
    setPendingFiles([]);
    setFileError('');
    if (fileRef.current) fileRef.current.value = '';
  };

  const send = async (text: string, files: PendingFile[]) => {
    if (!text.trim() && files.length === 0) return;

    const attachments: Attachment[] = files.map((pf) => ({
      previewUrl: pf.file.type.startsWith('image/') ? pf.previewUrl : undefined,
      fileName: pf.file.type === 'application/pdf' ? pf.file.name : undefined,
    }));

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: text.trim(),
      attachments: attachments.length > 0 ? attachments : undefined,
    };

    const historySnapshot = messages.map((m) => ({ role: m.role, text: m.text }));

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    clearFiles();
    setLoading(true);

    try {
      const encodedFiles = await Promise.all(
        files.map(async (pf) => {
          if (pf.file.type.startsWith('image/')) {
            return {
              fileBase64: await compressImageToBase64(pf.file),
              fileMediaType: 'image/jpeg',
              fileName: pf.file.name,
            };
          }
          const buffer = await pf.file.arrayBuffer();
          return {
            fileBase64: arrayBufferToBase64(buffer),
            fileMediaType: pf.file.type,
            fileName: pf.file.name,
          };
        })
      );

      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text.trim(),
          files: encodedFiles.length > 0 ? encodedFiles : undefined,
          history: historySnapshot,
        }),
      });

      let data: { response?: string; error?: string };
      try { data = await res.json(); } catch { throw new Error('routing'); }

      if (!res.ok && data.error) throw new Error(data.error);

      const reply = data.response || 'Sorry, something went wrong.';
      setMessages((prev) => [...prev, { id: Date.now().toString() + '_ai', role: 'assistant', text: reply }]);
    } catch (err: any) {
      const message = err?.message === 'routing' || !err?.message
        ? "Mylo couldn't connect right now. Please check your internet connection and try again."
        : err.message;
      setMessages((prev) => [
        ...prev,
        { id: Date.now().toString() + '_err', role: 'assistant', text: message, isError: true, retryText: text },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleEdit = (msg: Message) => {
    const idx = messages.findIndex((m) => m.id === msg.id);
    setMessages((prev) => prev.slice(0, idx));
    setInput(msg.text);
    setTimeout(() => {
      textRef.current?.focus();
      if (textRef.current) {
        textRef.current.style.height = 'auto';
        textRef.current.style.height = Math.min(textRef.current.scrollHeight, 120) + 'px';
      }
    }, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input, pendingFiles);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      send(input, pendingFiles);
    }
  };

  const isEmpty = messages.length === 0;
  const canAddMore = pendingFiles.length < MAX_FILES;

  return (
    <AppShell>
      <PageHeader title="Mylo — AI Companion" />

      <div className="mx-4 mt-2 mb-3 flex items-start gap-2 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-2xl px-4 py-3">
        <AlertTriangle size={15} className="text-amber-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-amber-700 dark:text-amber-300 leading-snug">
          For guidance only — always consult your GP, midwife, or paediatrician for medical advice.
        </p>
      </div>

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
              Your Mylestone AI companion. Upload photos, PDFs, or a mix — up to {MAX_FILES} files per message.
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              {SUGGESTED.map((s) => (
                <motion.button
                  key={s}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => send(s, [])}
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
                {msg.attachments && msg.attachments.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 justify-end">
                    {msg.attachments.map((att, i) =>
                      att.previewUrl ? (
                        <img
                          key={i}
                          src={att.previewUrl}
                          alt="Uploaded"
                          className="w-24 h-24 rounded-xl border border-gray-200 dark:border-gray-700 object-cover"
                        />
                      ) : att.fileName ? (
                        <div key={i} className="flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3 py-2">
                          <FileText size={16} className="text-brand-mint flex-shrink-0" />
                          <span className="text-xs text-gray-700 dark:text-gray-300 truncate max-w-[140px]">{att.fileName}</span>
                        </div>
                      ) : null
                    )}
                  </div>
                )}
                {msg.text && (
                  <>
                    <div
                      className={`rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === 'user'
                          ? 'bg-brand-mint text-white rounded-tr-sm whitespace-pre-wrap'
                          : msg.isError
                          ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 rounded-tl-sm'
                          : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 border border-gray-100 dark:border-gray-700 rounded-tl-sm shadow-sm'
                      }`}
                    >
                      {msg.isError && msg.retryText ? (
                        <div className="flex flex-col gap-2">
                          <p>{msg.text}</p>
                          <button
                            onClick={() => send(msg.retryText!, [])}
                            disabled={loading}
                            className="flex items-center gap-1.5 text-xs font-semibold text-red-600 dark:text-red-400 hover:text-red-700 disabled:opacity-50 self-start"
                          >
                            <RefreshCw size={12} />
                            Try again
                          </button>
                        </div>
                      ) : msg.role === 'assistant' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                            li: ({ children }) => <li className="text-sm">{children}</li>,
                            strong: ({ children }) => <strong className="font-semibold text-gray-900 dark:text-white">{children}</strong>,
                            em: ({ children }) => <em className="italic">{children}</em>,
                            h3: ({ children }) => <h3 className="font-bold text-gray-900 dark:text-white mb-1 mt-2">{children}</h3>,
                            h4: ({ children }) => <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-1">{children}</h4>,
                            hr: () => <hr className="my-2 border-gray-200 dark:border-gray-600" />,
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      ) : (
                        msg.text
                      )}
                    </div>
                    {!msg.isError && (
                      <div className={`flex gap-2 mt-1 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'user' && (
                          <button
                            onClick={() => handleEdit(msg)}
                            className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-brand-mint transition-colors py-0.5 px-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                          >
                            <Pencil size={11} />
                            Edit
                          </button>
                        )}
                        <button
                          onClick={() => handleCopy(msg.id, msg.text)}
                          className="flex items-center gap-1 text-[11px] text-gray-400 hover:text-brand-mint transition-colors py-0.5 px-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
                        >
                          {copiedId === msg.id ? <Check size={11} className="text-brand-mint" /> : <Copy size={11} />}
                          {copiedId === msg.id ? 'Copied' : 'Copy'}
                        </button>
                      </div>
                    )}
                  </>
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

      <div className="px-4 pb-4 pt-2 bg-gray-50 dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800">
        {fileError && <p className="text-xs text-red-500 mb-2">{fileError}</p>}

        <AnimatePresence>
          {pendingFiles.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-2 flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            >
              {pendingFiles.map((pf, idx) => (
                <div
                  key={idx}
                  className="relative flex-shrink-0 w-16 h-16 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden"
                >
                  {pf.previewUrl ? (
                    <img src={pf.previewUrl} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center gap-1 px-1">
                      <FileText size={18} className="text-brand-mint" />
                      <span className="text-[9px] text-gray-500 truncate w-full text-center leading-tight">
                        {pf.file.name}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => removeFile(idx)}
                    className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-gray-900/60 text-white flex items-center justify-center hover:bg-red-500/80 transition-colors"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
              {canAddMore && (
                <button
                  onClick={() => fileRef.current?.click()}
                  className="flex-shrink-0 w-16 h-16 rounded-xl border-2 border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center gap-1 text-gray-400 hover:border-brand-mint hover:text-brand-mint transition-colors"
                >
                  <Paperclip size={16} />
                  <span className="text-[9px]">Add</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="flex items-end gap-2">
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif,application/pdf"
            multiple
            onChange={handleFileChange}
            className="hidden"
          />
          {pendingFiles.length === 0 && (
            <motion.button
              type="button"
              whileTap={{ scale: 0.92 }}
              onClick={() => fileRef.current?.click()}
              className="p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:text-brand-mint hover:border-brand-mint transition-colors flex-shrink-0"
            >
              <Paperclip size={18} />
            </motion.button>
          )}

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
            disabled={loading || (!input.trim() && pendingFiles.length === 0)}
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
