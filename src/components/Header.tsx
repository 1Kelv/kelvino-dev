import React, { useEffect, useMemo, useState } from 'react';
import './Header.css';
import logo from '../assets/KO.png';

type Theme = 'light' | 'dark';

const THEME_KEY = 'theme';

function getSystemPrefersDark(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) return false;
  return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function getInitialTheme(): Theme {
  const saved = (localStorage.getItem(THEME_KEY) as Theme | null);
  if (saved === 'light' || saved === 'dark') return saved;
  return getSystemPrefersDark() ? 'dark' : 'light';
}

const Header: React.FC = () => {
  const hasSavedPreference = useMemo(
    () => localStorage.getItem(THEME_KEY) !== null,
    []
  );

  const [theme, setTheme] = useState<Theme>(() => getInitialTheme());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    document.body.setAttribute('data-page-theme', theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  useEffect(() => {
    if (hasSavedPreference) return;

    const mql = window.matchMedia?.('(prefers-color-scheme: dark)');
    if (!mql) return;

    const handle = (e: MediaQueryListEvent) => setTheme(e.matches ? 'dark' : 'light');
    if (mql.addEventListener) mql.addEventListener('change', handle);
    else mql.addListener?.(handle);

    return () => {
      if (mql.removeEventListener) mql.removeEventListener('change', handle);
      else mql.removeListener?.(handle);
    };
  }, [hasSavedPreference]);

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'light' ? 'dark' : 'light';
      localStorage.setItem(THEME_KEY, next);
      return next;
    });
  };

  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleNavClick = () => setIsMobileMenuOpen(false);

  const handleCVRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = 'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';
    handleNavClick();
  };

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

  return (
    <>
      <header className="header" role="banner">
        <div className="container header-grid">
          {/* LEFT: brand */}
          <a href="#home" className="site-title" aria-label="Go to top">
            <img src={logo} alt="KelvinO.dev logo" className="logo-icon" />
            <span className="brand-text">KelvinO.dev</span>
          </a>

          {/* CENTER: desktop nav */}
          <nav className="nav-links" aria-label="Primary">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#contact">Contact</a>
            <a href="#" onClick={handleCVRequest} className="header-nav-btn">
              Request CV
            </a>
          </nav>

          {/* RIGHT: actions */}
          <div className="header-actions">
            <button
              className="theme-toggle theme-toggle-desktop"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>

            <button
              onClick={toggleMobileMenu}
              className={`mobile-menu-toggle ${isMobileMenuOpen ? 'open' : ''}`}
              aria-label="Toggle mobile menu"
              title="Menu"
            >
              <span aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE: overlay */}
      {isMobileMenuOpen && (
        <div
          className="mobile-nav-overlay open"
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* MOBILE: drawer */}
      <nav className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`} aria-label="Mobile">
        <button className="mobile-nav-close" onClick={closeMobileMenu} aria-label="Close menu">×</button>

        <div className="mobile-nav-links">
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#journey" onClick={handleNavClick}>Journey</a>
          <a href="#contact" onClick={handleNavClick}>Contact</a>
          <a href="#" onClick={handleCVRequest}>
            Request CV
          </a>

          <div className="mobile-theme-wrap">
            <button
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