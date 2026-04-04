import React from 'react';
import './Footer.css';

const Footer: React.FC = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="footer">
      <div className="footer-inner">
        <p className="footer-copy">
          © {year} <span className="footer-name">Kelvin Olasupo</span>. Designed &amp; built with React + TypeScript.
        </p>
        <div className="footer-links">
          <a href="https://github.com/1Kelv" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/kelvin-o-72a874226/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
          <a href="https://medium.com/@1kelv" target="_blank" rel="noopener noreferrer">Medium</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
