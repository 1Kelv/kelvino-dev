import React, { useState } from 'react';
import { Trash2, Phone, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { CareTeamMember } from './hospitalExtras';
import { Button } from '../ui/Button';

interface CareTeamSectionProps {
  members: CareTeamMember[];
  onChange: (members: CareTeamMember[]) => void;
}

export function CareTeamSection({ members, onChange }: CareTeamSectionProps) {
  const [showAdd, setShowAdd] = useState(false);
  const [role, setRole] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const inputClass =
    'flex-1 text-sm rounded-xl border border-gray-200 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:border-brand-mint focus:outline-none focus:ring-2 focus:ring-brand-mint/30';

  const handleAdd = () => {
    if (!role.trim() || !name.trim()) return;
    const newMember: CareTeamMember = {
      id: `ct_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      role: role.trim(),
      name: name.trim(),
      phone: phone.trim() || undefined,
    };
    onChange([...members, newMember]);
    setRole('');
    setName('');
    setPhone('');
    setShowAdd(false);
  };

  const handleDelete = (id: string) => {
    onChange(members.filter((m) => m.id !== id));
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Care Team</p>
        <button
          onClick={() => setShowAdd((v) => !v)}
          className="flex items-center gap-1 text-xs font-semibold text-brand-mint hover:text-brand-dark transition-colors"
        >
          <UserPlus size={13} />
          Add
        </button>
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {members.map((member) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ type: 'spring', stiffness: 360, damping: 24 }}
              className="bg-gray-50 dark:bg-gray-700/50 rounded-xl px-3 py-2.5 flex items-center gap-2 group"
            >
              <div className="w-8 h-8 rounded-full bg-brand-mint/20 flex items-center justify-center flex-shrink-0">
                <span className="text-brand-mint text-xs font-bold">{member.name.charAt(0).toUpperCase()}</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{member.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{member.role}</p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="p-1.5 rounded-lg text-brand-mint hover:bg-brand-mint/10 transition-colors"
                    aria-label={`Call ${member.name}`}
                  >
                    <Phone size={14} />
                  </a>
                )}
                <button
                  onClick={() => handleDelete(member.id)}
                  className="p-1.5 rounded-lg text-gray-300 dark:text-gray-600 hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {members.length === 0 && !showAdd && (
          <p className="text-xs text-gray-400 dark:text-gray-500 italic py-1">
            No care team contacts yet. Tap Add to log a contact.
          </p>
        )}
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="pt-3 flex flex-col gap-2">
              <div className="flex gap-2">
                <input
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  placeholder="Role (e.g. Cardiologist)"
                  className={inputClass}
                />
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (e.g. Dr Smith)"
                  className={inputClass}
                />
              </div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone (optional)"
                type="tel"
                className={inputClass + ' w-full'}
              />
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => { setShowAdd(false); setRole(''); setName(''); setPhone(''); }}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAdd}
                  disabled={!role.trim() || !name.trim()}
                  className="flex-1"
                >
                  Save Contact
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
