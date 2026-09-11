import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useUI } from '../UIContext';
import { useTheme } from '../ThemeContext';
import { useFinePointer } from '../hooks/useMediaQuery';
import './Terminal.css';

type Line = { id: number; kind: 'in' | 'out' | 'err' | 'sys'; content: React.ReactNode };

const CV_MAILTO =
  'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';

const SECTIONS = ['home', 'projects', 'about', 'achievements', 'experience', 'contact'];

const COMMANDS = [
  'help', 'about', 'whoami', 'projects', 'skills', 'experience', 'contact',
  'socials', 'cv', 'goto', 'theme', 'music', 'neofetch', 'cat', 'ls',
  'echo', 'date', 'uptime', 'coffee', 'secrets', 'clear', 'exit',
];

const PROJECTS = [
  { name: 'thrive-finance', desc: 'Personal finance app, live with real users', url: 'https://getmythrive.io' },
  { name: 'agileflow', desc: 'AI sprint prediction, Bronze Award for Innovation', url: 'https://github.com/1Kelv/AgileFlow' },
  { name: 'mylestone', desc: 'Care-tracking PWA for medically complex infants', url: 'https://mylestone-seven.vercel.app' },
  { name: 'alertiq', desc: 'Fraud analyst training simulator', url: 'https://fraud-simulator-three.vercel.app' },
  { name: 'nala-internal', desc: 'Riposte, Fraud Academy, EXCO Reporter, Reg-E Radar, Overtime Helper', url: '#contact' },
];

const SKILLS = 'React · TypeScript · JavaScript · Python · Node.js · SQL · Supabase · Appwrite · Streamlit · Hex · Playwright · Claude AI · Fraud Operations · Data Analytics';

const NEOFETCH = String.raw`
   ██╗  ██╗ ██████╗    kelvin@kelvino.dev
   ██║ ██╔╝██╔═══██╗   ------------------
   █████╔╝ ██║   ██║   OS:       KelvinOS 2.0 (React/TS)
   ██╔═██╗ ██║   ██║   Role:     Fraud Operations Lead @ Nala
   ██║  ██╗╚██████╔╝   Degree:   BSc CS, First-Class Honours
   ╚═╝  ╚═╝ ╚═════╝    Shell:    fraud-fighter-zsh
                       Uptime:   coding since 2021
                       Location: London, UK
`;

const A: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a href={href} target={href.startsWith('#') ? undefined : '_blank'} rel="noreferrer">{children}</a>
);

const Terminal: React.FC = () => {
  const { terminalOpen, closeTerminal, toggleTerminal, musicOn, setMusicOn, toast } = useUI();
  const { theme, setTheme } = useTheme();
  const finePointer = useFinePointer();

  const [lines, setLines] = useState<Line[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [pos, setPos] = useState<{ x: number; y: number } | null>(null);
  const idRef = useRef(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ dx: number; dy: number } | null>(null);
  const windowRef = useRef<HTMLDivElement>(null);

  const push = useCallback((kind: Line['kind'], content: React.ReactNode) => {
    setLines(prev => [...prev.slice(-200), { id: ++idRef.current, kind, content }]);
  }, []);

  // Welcome message on first open.
  useEffect(() => {
    if (terminalOpen && lines.length === 0) {
      push('sys', <>Welcome to <b>kelvin.sh</b>. Type <code>help</code> to see what I can do.</>);
    }
  }, [terminalOpen, lines.length, push]);

  // Keyboard shortcuts: ` toggles, Ctrl/Cmd+K opens, Esc closes.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if (e.key === '`' && !typing) {
        e.preventDefault();
        toggleTerminal();
        return;
      }
      if (e.key === 'Escape' && terminalOpen) closeTerminal();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [terminalOpen, toggleTerminal, closeTerminal]);

  useEffect(() => {
    if (terminalOpen) window.setTimeout(() => inputRef.current?.focus(), 60);
  }, [terminalOpen]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const goto = useCallback((section: string) => {
    const el = document.getElementById(section);
    if (!el) return false;
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return true;
  }, []);

  const run = useCallback((raw: string) => {
    const trimmed = raw.trim();
    push('in', trimmed);
    if (!trimmed) return;

    const [cmd, ...rest] = trimmed.split(/\s+/);
    const arg = rest.join(' ');
    const c = cmd.toLowerCase();

    switch (c) {
      case 'help':
        push('out', (
          <div className="term-help">
            {[
              ['about / whoami', 'who is this person?'],
              ['projects', 'things I have built'],
              ['skills', 'the toolbox'],
              ['experience', 'where I have worked'],
              ['contact / socials', 'how to reach me'],
              ['cv', 'request my CV'],
              ['goto <section>', `jump to: ${SECTIONS.join(', ')}`],
              ['theme [dark|light]', 'flip the lights'],
              ['music [on|off]', 'ambient synth, generated live in your browser'],
              ['neofetch', 'system info, obviously'],
              ['clear / exit', 'tidy up'],
            ].map(([k, v]) => (
              <div key={k} className="term-help-row"><span className="term-cmd">{k}</span><span>{v}</span></div>
            ))}
            <div className="term-help-row term-dim"><span className="term-cmd">secrets</span><span>you did not hear it from me</span></div>
          </div>
        ));
        break;

      case 'about':
      case 'whoami':
        push('out', (
          <>
            Kelvin Olasupo. Fraud Operations Lead at Nala, software engineer and founder of Thrive Finance.
            First-Class BSc in Computer Science, working towards an MSc in AI &amp; Machine Learning.
            I build the tools my team actually relies on, then go home and build some more.
          </>
        ));
        break;

      case 'projects':
      case 'ls':
        push('out', (
          <div className="term-list">
            {PROJECTS.map(p => (
              <div key={p.name} className="term-list-row">
                <A href={p.url}>{p.name}/</A>
                <span>{p.desc}</span>
              </div>
            ))}
          </div>
        ));
        break;

      case 'skills':
        push('out', SKILLS);
        break;

      case 'experience':
        push('out', (
          <>
            <b>Nala</b>, Fraud Operations Lead (Apr 2025 – present). Shipped 5+ internal tools, designed fraud
            frameworks and SOPs, built Hex dashboards and Python tooling for real-time risk monitoring.
            <br />
            <b>University of Bedfordshire</b>, BSc Computer Science, First-Class Honours (2021 – 2025).
          </>
        ));
        break;

      case 'contact':
      case 'socials':
        push('out', (
          <div className="term-list">
            <div className="term-list-row"><A href="https://github.com/1Kelv">github</A><span>github.com/1Kelv</span></div>
            <div className="term-list-row"><A href="https://www.linkedin.com/in/kelvin-o-72a874226/">linkedin</A><span>linkedin.com/in/kelvin-o-72a874226</span></div>
            <div className="term-list-row"><A href="https://medium.com/@1kelv">medium</A><span>medium.com/@1kelv</span></div>
            <div className="term-list-row"><A href="#contact">form</A><span>or just use the contact form below</span></div>
          </div>
        ));
        break;

      case 'cv':
        push('out', 'Opening your mail client with a CV request...');
        window.location.href = CV_MAILTO;
        break;

      case 'goto':
      case 'cd': {
        const target = arg.replace(/^#/, '').toLowerCase() || 'home';
        if (goto(target)) push('out', `Navigating to #${target}`);
        else push('err', `No such section: ${target}. Try: ${SECTIONS.join(', ')}`);
        break;
      }

      case 'theme': {
        const want = arg.toLowerCase();
        const next = want === 'dark' || want === 'light' ? want : theme === 'dark' ? 'light' : 'dark';
        setTheme(next);
        push('out', `Theme set to ${next}.`);
        break;
      }

      case 'music': {
        const want = arg.toLowerCase();
        const next = want === 'on' ? true : want === 'off' ? false : !musicOn;
        setMusicOn(next);
        push('out', next ? 'Ambient synth on. Chords are generated live, no file is being streamed.' : 'Ambient synth off.');
        break;
      }

      case 'neofetch':
        push('out', <pre className="term-pre">{NEOFETCH}</pre>);
        break;

      case 'cat':
        if (/kelvin\.json/i.test(arg)) {
          push('out', (
            <pre className="term-pre">{JSON.stringify({
              name: 'Kelvin Olasupo',
              role: 'Fraud Operations Lead @ Nala',
              builds: ['Thrive Finance', 'AgileFlow', 'Mylestone', 'AlertIQ'],
              stack: ['React', 'TypeScript', 'Python', 'Supabase'],
              studying: 'MSc AI & Machine Learning',
              status: 'open to software engineering roles',
            }, null, 2)}</pre>
          ));
        } else if (!arg) {
          push('err', 'usage: cat <file>   (try: cat kelvin.json)');
        } else {
          push('err', `cat: ${arg}: No such file. Try: cat kelvin.json`);
        }
        break;

      case 'echo':
        push('out', arg || '');
        break;

      case 'date':
        push('out', new Date().toLocaleString('en-GB', { timeZone: 'Europe/London', dateStyle: 'full', timeStyle: 'short' }) + ' (London)');
        break;

      case 'uptime': {
        const start = new Date('2021-09-20T09:00:00Z').getTime();
        const days = Math.floor((Date.now() - start) / 86400000);
        push('out', `up ${days} days since the first line of code at university. Load average: caffeinated.`);
        break;
      }

      case 'coffee':
        push('out', '☕ Brewing... Done. Productivity +12%.');
        break;

      case 'secrets':
        push('out', (
          <>
            Try the Konami code anywhere on the page. Also, the logo in the header has a short temper.
          </>
        ));
        break;

      case 'sudo':
        push('err', 'kelvin is not in the sudoers file. This incident will be reported to the fraud team. 🚨');
        break;

      case 'rm':
        push('err', 'Nice try. Transaction blocked, account flagged, analyst notified. 🛑');
        break;

      case 'hello':
      case 'hi':
        push('out', 'Hello! Thanks for stopping by. Type help if you are lost.');
        break;

      case 'clear':
        setLines([]);
        return;

      case 'exit':
      case 'quit':
        closeTerminal();
        return;

      default:
        push('err', `command not found: ${cmd}. Type help for a list.`);
    }
  }, [push, goto, theme, setTheme, musicOn, setMusicOn, closeTerminal]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    setHistory(h => [...h, input]);
    setHistoryIdx(-1);
    run(input);
    setInput('');
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (!history.length) return;
      const next = historyIdx === -1 ? history.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(next);
      setInput(history[next]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const next = historyIdx + 1;
      if (next >= history.length) {
        setHistoryIdx(-1);
        setInput('');
      } else {
        setHistoryIdx(next);
        setInput(history[next]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const match = COMMANDS.filter(c => c.startsWith(input.toLowerCase()));
      if (match.length === 1) setInput(match[0] + ' ');
      else if (match.length > 1 && input) push('out', match.join('   '));
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  // Dragging (desktop only)
  const onDragStart = (e: React.PointerEvent) => {
    if (!finePointer || !windowRef.current) return;
    const rect = windowRef.current.getBoundingClientRect();
    dragRef.current = { dx: e.clientX - rect.left, dy: e.clientY - rect.top };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };
  const onDragMove = (e: React.PointerEvent) => {
    if (!dragRef.current || !windowRef.current) return;
    const w = windowRef.current.offsetWidth;
    const h = windowRef.current.offsetHeight;
    const x = Math.min(Math.max(8, e.clientX - dragRef.current.dx), window.innerWidth - w - 8);
    const y = Math.min(Math.max(8, e.clientY - dragRef.current.dy), window.innerHeight - h - 8);
    setPos({ x, y });
  };
  const onDragEnd = () => { dragRef.current = null; };

  const style = useMemo(() => (pos ? { left: pos.x, top: pos.y, transform: 'none' } : undefined), [pos]);

  return (
    <AnimatePresence>
      {terminalOpen && (
        <motion.div
          key="terminal"
          ref={windowRef}
          className="terminal-window"
          style={style}
          role="dialog"
          aria-label="Interactive terminal"
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 8 }}
          transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
          onClick={() => inputRef.current?.focus()}
        >
          <div
            className="terminal-titlebar"
            onPointerDown={onDragStart}
            onPointerMove={onDragMove}
            onPointerUp={onDragEnd}
            onPointerCancel={onDragEnd}
          >
            <div className="terminal-lights" aria-hidden="true">
              <button type="button" className="light red" onClick={closeTerminal} aria-label="Close terminal" />
              <span className="light yellow" />
              <span className="light green" />
            </div>
            <span className="terminal-title">kelvin@kelvino.dev: ~</span>
            <button
              type="button"
              className="terminal-close"
              onClick={closeTerminal}
              aria-label="Close terminal"
              title="Close (Esc)"
            >
              ×
            </button>
          </div>

          <div className="terminal-body" ref={bodyRef}>
            {lines.map(l => (
              <div key={l.id} className={`term-line term-${l.kind}`}>
                {l.kind === 'in' && <span className="term-prompt">❯</span>}
                <div className="term-content">{l.content}</div>
              </div>
            ))}
            <form className="term-input-row" onSubmit={onSubmit}>
              <span className="term-prompt">❯</span>
              <input
                ref={inputRef}
                className="term-input"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={onKeyDown}
                spellCheck={false}
                autoComplete="off"
                autoCapitalize="off"
                aria-label="Terminal command"
                placeholder="type a command..."
              />
            </form>
          </div>
          <div className="terminal-footer" aria-hidden="true">
            <span>tab: autocomplete</span>
            <span>↑↓: history</span>
            <span>esc: close</span>
            <button type="button" className="terminal-footer-btn" onClick={() => { toast('Tip: press ` anywhere to reopen this.', '💡'); closeTerminal(); }}>
              hide
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Terminal;
