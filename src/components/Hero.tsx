import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero: React.FC = () => {
  const handleCVRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = 'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';
  };

  return (
    <section id="hero" className="hero">
      <div className="hero-bg-grid" aria-hidden="true" />
      <div className="hero-glow" aria-hidden="true" />

      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Badge */}
          <motion.div
            className="hero-badge"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="hero-badge-dot" />
            Available for opportunities
          </motion.div>

          {/* Headline */}
          <h1 className="hero-title">
            Hi, I'm{' '}
            <span className="gradient-text">Kelvin Olasupo</span>
          </h1>

          {/* Role line */}
          <p className="hero-role">
            Fraud Operations Lead{' '}
            <span className="hero-role-sep">@</span>{' '}
            <a
              href="https://www.nala.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="hero-company-link"
            >
              Nala
            </a>
            {' '}· Software Engineer · Co-Founder
          </p>

          {/* Description */}
          <p className="hero-description">
            I build software that solves operational problems. Fraud tooling at Nala,
            two startups in production, and an MSc in AI on the way.
          </p>

          {/* CTAs */}
          <div className="hero-cta">
            <a href="#projects" className="btn btn-primary hero-cta-primary">
              View My Work
            </a>
            <a href="#contact" className="btn hero-cta-ghost">
              Get In Touch
            </a>
            <a href="#" onClick={handleCVRequest} className="btn hero-cta-ghost">
              Request CV
            </a>
          </div>

          {/* Stats */}
          <div className="hero-stats">
            <div className="hero-stat">
              <span className="hero-stat-value">1st</span>
              <span className="hero-stat-label">Class Honours</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">10+</span>
              <span className="hero-stat-label">Projects Built</span>
            </div>
            <div className="hero-stat-divider" />
            <div className="hero-stat">
              <span className="hero-stat-value">2</span>
              <span className="hero-stat-label">Startups</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
