import React, { useEffect, useState } from 'react';
import './Header.css';
import logo from '../assets/KO.png';

const Header: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme') as 'light' | 'dark' | null;
    return saved ?? 'light';
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Apply theme
  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-page-theme', theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    document.body.style.setProperty('background-color', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  const toggleMobileMenu = () => setIsMobileMenuOpen(o => !o);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);
  const handleNavClick = () => setIsMobileMenuOpen(false);

  // ESC to close drawer + body scroll lock
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
            <a href="/KelvinOlasupo.Dev_Resume.pdf" target="_blank" rel="noopener noreferrer">View my CV</a>
            <a href="/AgileFlow-Award.pdf" target="_blank" rel="noopener noreferrer">Final Year Project Award</a>
            <a href="/CodeInstitute-Cert.pdf" target="_blank" rel="noopener noreferrer">Certifications</a>
          </nav>

          {/* RIGHT: desktop actions */}
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
              className="mobile-menu-toggle"
              onClick={toggleMobileMenu}
              aria-label="Open menu"
              title="Menu"
            >
              ☰
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
          <a href="/KelvinOlasupo.Dev_Resume.pdf" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>View my CV</a>
          <a href="/AgileFlow-Award.pdf" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>Final Year Project Award</a>
          <a href="/CodeInstitute-Cert.pdf" target="_blank" rel="noopener noreferrer" onClick={handleNavClick}>Certifications</a>

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
