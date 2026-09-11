import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ambient } from './audio/ambient';

export interface Toast {
  id: number;
  message: string;
  emoji?: string;
}

interface UIContextType {
  terminalOpen: boolean;
  openTerminal: () => void;
  closeTerminal: () => void;
  toggleTerminal: () => void;
  musicOn: boolean;
  setMusicOn: (on: boolean) => void;
  toggleMusic: () => void;
  toasts: Toast[];
  toast: (message: string, emoji?: string) => void;
  dismissToast: (id: number) => void;
  konamiActive: boolean;
  triggerKonami: () => void;
}

export const UIContext = createContext<UIContextType>({
  terminalOpen: false,
  openTerminal: () => {},
  closeTerminal: () => {},
  toggleTerminal: () => {},
  musicOn: false,
  setMusicOn: () => {},
  toggleMusic: () => {},
  toasts: [],
  toast: () => {},
  dismissToast: () => {},
  konamiActive: false,
  triggerKonami: () => {},
});

export const UIProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [terminalOpen, setTerminalOpen] = useState(false);
  const [musicOn, setMusicState] = useState(false);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [konamiActive, setKonamiActive] = useState(false);
  const toastId = useRef(0);

  const openTerminal = useCallback(() => setTerminalOpen(true), []);
  const closeTerminal = useCallback(() => setTerminalOpen(false), []);
  const toggleTerminal = useCallback(() => setTerminalOpen(o => !o), []);

  const dismissToast = useCallback((id: number) => {
    setToasts(t => t.filter(x => x.id !== id));
  }, []);

  const toast = useCallback((message: string, emoji?: string) => {
    const id = ++toastId.current;
    setToasts(t => [...t.slice(-2), { id, message, emoji }]);
    window.setTimeout(() => dismissToast(id), 4200);
  }, [dismissToast]);

  const setMusicOn = useCallback((on: boolean) => {
    if (on) {
      ambient.start().then(ok => {
        setMusicState(ok);
        if (!ok) toast('Audio is not available in this browser.', '🔇');
      });
    } else {
      ambient.stop();
      setMusicState(false);
    }
  }, [toast]);

  const toggleMusic = useCallback(() => setMusicOn(!musicOn), [musicOn, setMusicOn]);

  const triggerKonami = useCallback(() => {
    setKonamiActive(true);
    toast('Unauthorised cheat code detected. Access granted anyway.', '🚨');
    window.setTimeout(() => setKonamiActive(false), 3200);
  }, [toast]);

  // Stop the audio engine when the page is being torn down.
  useEffect(() => {
    const stop = () => ambient.stop();
    window.addEventListener('pagehide', stop);
    return () => window.removeEventListener('pagehide', stop);
  }, []);

  const value = useMemo(
    () => ({
      terminalOpen, openTerminal, closeTerminal, toggleTerminal,
      musicOn, setMusicOn, toggleMusic,
      toasts, toast, dismissToast,
      konamiActive, triggerKonami,
    }),
    [terminalOpen, openTerminal, closeTerminal, toggleTerminal, musicOn, setMusicOn, toggleMusic, toasts, toast, dismissToast, konamiActive, triggerKonami]
  );

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
