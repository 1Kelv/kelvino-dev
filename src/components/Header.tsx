import React, { useState, useEffect } from 'react';
import './Header.css';
import logo from '../assets/KO.png';

const Header = () => {
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'light';
  });
  
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.body.setAttribute('data-page-theme', theme);
    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(`theme-${theme}`);
    document.body.style.setProperty('background-color', theme === 'dark' ? '#0a0a0a' : '#ffffff');
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(prev => !prev);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when clicking on a nav link
  const handleNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  // Close mobile menu when pressing Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      <header className="header">
        <div className="container">
          <a href="#home" className="site-title">
            <img src={logo} alt="Logo" className="logo-icon" />
            KelvinO.dev
          </a>
          
          {/* Desktop Navigation */}
          <nav className="nav-links">
            <a href="#projects">Projects</a>
            <a href="#about">About</a>
            <a href="#journey">Journey</a>
            <a href="#contact">Contact</a>
            <a href="/KelvinOlasupo-CV.pdf" target="_blank" rel="noopener noreferrer">
              View CV
            </a>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </nav>

          {/* Mobile Menu Toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <button
              onClick={toggleTheme}
              className="theme-toggle"
              aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              title={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
              style={{ display: 'none' }}
              id="mobile-theme-toggle"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            
            <button
              onClick={toggleMobileMenu}
              className="mobile-menu-toggle"
              aria-label="Toggle mobile menu"
              title="Menu"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="mobile-nav-overlay open" 
          onClick={closeMobileMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <button
          onClick={closeMobileMenu}
          className="mobile-nav-close"
          aria-label="Close mobile menu"
        >
          ×
        </button>
        
        <div className="mobile-nav-links">
          <a href="#projects" onClick={handleNavClick}>Projects</a>
          <a href="#about" onClick={handleNavClick}>About</a>
          <a href="#journey" onClick={handleNavClick}>Journey</a>
          <a href="#contact" onClick={handleNavClick}>Contact</a>
          <a 
            href="/KelvinOlasupo-CV.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            onClick={handleNavClick}
          >
            View CV
          </a>
          
          <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)' }}>
            <button
              onClick={() => {
                toggleTheme();
                handleNavClick();
              }}
              className="theme-toggle"
              style={{ width: '100%', borderRadius: '6px', padding: '0.75rem' }}
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