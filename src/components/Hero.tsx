import React from 'react';
import { motion } from 'framer-motion';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero-section">
      {/* Background Elements */}
      <div className="hero-background">
        <div className="hero-gradient-1"></div>
        <div className="hero-gradient-2"></div>
        <div className="hero-grid"></div>
      </div>

      {/* Main Content */}
      <div className="hero-container">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          {/* Greeting */}
          <motion.div
            className="hero-greeting"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            👋 Hello, I'm
          </motion.div>

          {/* Main Name */}
          <motion.h1
            className="hero-name"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <span className="hero-name-first">Kelvin</span>
            <span className="hero-name-last">Olasupo</span>
          </motion.h1>

          {/* Role */}
          <motion.div
            className="hero-role"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 1.8 }}
          >
            <span className="hero-role-text">
             Fraud Operations Lead on a journey into Software Engineering & Data Analytics
            </span>
          </motion.div>

          {/* Description */}
          <motion.p
            className="hero-description"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 2.1 }}
          >
            First-Class Computer Science Graduate • Fraud Ops Lead @ <span className="hero-highlight">Nala</span> • 
            Crafting <span className="hero-highlight">Frontend magic,</span>  <span className="hero-highlight">one commit at a time.</span>
          </motion.p>

          {/* Action Buttons */}
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.4 }}
          >
            <a href="#projects" className="hero-btn hero-btn-primary">
              View My Work
            </a>
            <a href="#contact" className="hero-btn hero-btn-secondary">
              Get In Touch
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="hero-scroll"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 2 }}
          >
            <div className="hero-scroll-text">Scroll to explore</div>
            <div className="hero-scroll-arrow">↓</div>
          </motion.div>
        </motion.div>

        {/* Side Elements */}
        <motion.div
          className="hero-side-elements"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 3.8 }}
        >
          <div className="hero-tech-stack">
            <div className="hero-tech-item">React</div>
            <div className="hero-tech-item">TypeScript</div>
            <div className="hero-tech-item">JavaScript</div>
            <div className="hero-tech-item">Node.js</div>
            <div className="hero-tech-item">Python</div>
            <div className="hero-tech-item">SQL</div>
            <div className="hero-tech-item">MySQL</div>
            <div className="hero-tech-item">PostgresDB</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;