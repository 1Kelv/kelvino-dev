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
            &nbsp;and aspiring Software Engineer passionate about building clean, scalable, and reliable applications across frontend and backend.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn">View My Projects</a>
            <a
  href="mailto:kelvinolasupo@yahoo.com?subject=Request%20for%20Kelvin%20Olasupo%20CV&body=Hi%20Kelvin,%0D%0A%0D%0AI came across your portfolio and would like to request a copy of your CV.%0D%0A%0D%0AName:%0D%0ACompany/Role:%0D%0AReason:%0D%0A%0D%0AThanks!%0D%0A"
  className="cv-request-link"
  aria-label="Request CV by email"
>
  Request CV
</a>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
