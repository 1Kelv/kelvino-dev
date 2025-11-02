import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero: React.FC = () => {
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
            👋🏾 Hi, I’m <span className="highlight">Kelvin Olasupo</span>
          </h1>

          <p className="hero-subtitle">
            Fraud Operations Lead @ <a href="https://www.nala.com/" target="_blank" rel="noopener noreferrer" className="link-inline">Nala</a>  
            &nbsp;and aspiring Frontend Developer passionate about building clean, responsive, and interactive web applications.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn">View My Projects</a>
            <a href="/KelvinOlasupo.Dev_Resume.pdf" target="_blank" rel="noopener noreferrer" className="btn-outline">
              Download CV
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
