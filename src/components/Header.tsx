import React, { useEffect, useRef, useState } from 'react';
import './Header.css';
import Logo from './Logo';
import { useTheme } from '../ThemeContext';
import { useUI } from '../UIContext';

const CV_MAILTO =
  'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';

const NAV = [
  { href: '#projects', label: 'Projects' },
  { href: '#about', label: 'About' },
  { href: '#experience', label: 'Experience' },
  { href: '#contact', label: 'Contact' },
];

const Header: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { toggleTerminal, toast } = useUI();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('');
  const logoClicks = useRef(0);
  const logoTimer = useRef<number | null>(null);

  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleNavClick = () => setIsMobileMenuOpen(false);

  const handleCVRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = CV_MAILTO;
    handleNavClick();
  };

  // Logo easter egg: five quick taps.
  const handleLogoClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    logoClicks.current += 1;
    if (logoTimer.current) window.clearTimeout(logoTimer.current);
    logoTimer.current = window.setTimeout(() => { logoClicks.current = 0; }, 900);
    if (logoClicks.current >= 5) {
      e.preventDefault();
      logoClicks.current = 0;
      toast('Persistent, aren\'t you? Press ` to open the terminal.', '🔓');
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Highlight the nav link for the section in view.
  useEffect(() => {
    const ids = NAV.map(n => n.href.slice(1));
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean) as HTMLElement[];
    if (!sections.length || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(
      entries => {
        const visible = entries.filter(e => e.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) setActiveSection(visible[0].target.id);
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: [0, 0.25, 0.5] }
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const onEsc = (e: KeyboardEvent) => { if (e.key === 'Escape') setIsMobileMenuOpen(false); };
    if (isMobileMenuOpen) {
      document.addEventListener('keydown', onEsc);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', onEsc);
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const themeLabel = `Switch to ${theme === 'light' ? 'dark' : 'light'} mode`;

  return (
    <>
      <header className={`header ${scrolled ? 'scrolled' : ''}`} role="banner">
        <div className="container header-grid">
          <a href="#home" className="site-title" aria-label="Kelvin Olasupo, back to top" onClick={handleLogoClick}>
            <Logo />
            <span className="brand-text">
              <span className="brand-first">Kelvin</span>
              <span className="brand-last">Olasupo</span>
            </span>
          </a>

          <nav className="nav-links" aria-label="Primary">
            {NAV.map(item => (
              <a
                key={item.href}
                href={item.href}
                className={activeSection === item.href.slice(1) ? 'active' : ''}
              >
                {item.label}
              </a>
            ))}
            <a href="#" onClick={handleCVRequest} className="header-nav-btn">
              Request CV
            </a>
          </nav>

          <div className="header-actions">
            <button
              type="button"
              className="icon-btn terminal-btn"
              onClick={toggleTerminal}
              aria-label="Open terminal"
              title="Open terminal (`)"
            >
              <span aria-hidden="true">&gt;_</span>
            </button>

            <button
              type="button"
              className="theme-toggle theme-toggle-desktop"
              onClick={toggleTheme}
              aria-label={themeLabel}
              title={themeLabel}
            >
              <span className={`theme-icon ${theme}`} aria-hidden="true">
                {theme === 'light' ? '🌙' : '☀️'}
              </span>
            </button>

            <button
              type="button"
              onClick={toggleMobileMenu}
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              aria-label="Toggle mobile menu"
              aria-expanded={isMobileMenuOpen}
              title="Menu"
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="mobile-nav-overlay open" onClick={closeMobileMenu} aria-hidden="true" />
      )}

      <nav className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Mobile">
        <button type="button" className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu">×</button>

        <div className="mobile-nav-links">
          {NAV.map(item => (
            <a key={item.href} href={item.href} onClick={handleNavClick}>{item.label}</a>
          ))}
          <a href="#" onClick={handleCVRequest}>Request CV</a>
          <button
            type="button"
            className="mobile-terminal-btn"
            onClick={() => { closeMobileMenu(); toggleTerminal(); }}
          >
            <span aria-hidden="true">&gt;_</span> Open terminal
          </button>

          <div className="mobile-theme-wrap">
            <button
              type="button"
              onClick={() => { toggleTheme(); handleNavClick(); }}
              className="theme-toggle"
              id="mobile-theme-toggle"
            >
              {theme === 'light' ? '🌙 Switch to Dark Mode' : '☀️ Switch to Light Mode'}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
