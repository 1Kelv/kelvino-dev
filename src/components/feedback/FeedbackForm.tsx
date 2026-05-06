import React, { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { Select } from '../ui/Select';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { feedbackDb } from '../../lib/db';
import { FeedbackEntry } from '../../types';

interface FeedbackFormProps {
  userId: string;
  userEmail: string;
}

export function FeedbackForm({ userId, userEmail }: FeedbackFormProps) {
  const [category, setCategory] = useState<FeedbackEntry['category']>('general');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subject.trim() || !message.trim()) {
      setError('Please fill in the subject and message.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await feedbackDb.create({ userId, userEmail: email, category, subject: subject.trim(), message: message.trim() });
      setSubmitted(true);
    } catch {
      setError('Failed to send feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <div className="w-16 h-16 rounded-full bg-brand-light flex items-center justify-center">
          <CheckCircle size={32} className="text-brand-mint" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Thank you!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            Your feedback has been received. We read every submission and really appreciate you helping shape Mylestone.
          </p>
        </div>
        <button
          onClick={() => { setSubmitted(false); setSubject(''); setMessage(''); setCategory('general'); }}
          className="text-sm text-brand-mint font-semibold"
        >
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Select
        label="Type of feedback"
        value={category}
        onChange={(e) => setCategory(e.target.value as FeedbackEntry['category'])}
        options={[
          { value: 'feature_request', label: '💡 Feature request' },
          { value: 'bug_report', label: '🐛 Bug report' },
          { value: 'general', label: '💬 General enquiry' },
        ]}
      />
      <Input
        label="Subject"
        type="text"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        placeholder="Brief summary of your feedback"
        required
      />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Message</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us more..."
          rows={5}
          required
          className="w-full rounded-xl border border-gray-300 dark:border-gray-600 px-4 py-3 text-base text-gray-900 dark:text-white bg-white dark:bg-gray-700 placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30 resize-none"
        />
      </div>
      <Input
        label="Your email (optional, if you'd like a reply)"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="your@email.com"
      />
      {error && <p className="text-sm text-red-500 bg-red-50 rounded-xl px-4 py-3">{error}</p>}
      <Button type="submit" loading={loading} className="w-full">Send Feedback</Button>
    </form>
  );
}
