import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero: React.FC = () => {
  const handleCVRequest = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.location.href = 'mailto:kelvinolasupo@yahoo.com?subject=CV%20Request&body=Hi%20Kelvin,%0A%0AI%20would%20like%20to%20request%20a%20copy%20of%20your%20CV.%0A%0AThank%20you!';
  };

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          viewport={{ once: true }}
        >
          <h1 className="hero-title">
            👋 Hi, I'm <span className="highlight">Kelvin Olasupo</span>
          </h1>

          <p className="hero-subtitle">
            Fraud Operations Lead @ <a href="https://www.nala.com/" target="_blank" rel="noopener noreferrer" className="link-inline">Nala</a>  
            &nbsp;and aspiring Software Engineer passionate about building clean, scalable, and reliable applications across frontend and backend.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn">View My Projects</a>
            <a href="#" onClick={handleCVRequest} className="hero-btn hero-btn-outline">
              Request CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;