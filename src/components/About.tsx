import React from 'react';
import { motion } from 'framer-motion';
import './About.css';

const About = () => {
  return (
    <motion.section
      className="about-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.6 }}
      viewport={{ once: true, margin: "-100px" }}
    >
      <div className="about-container">
        <motion.h2
          className="about-heading"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.9, delay: 1.3 }}
          viewport={{ once: true }}
        >
          About Me
        </motion.h2>
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.9 }}
          viewport={{ once: true }}
        >
          <p className="about-text">
            Hello 👋🏾, I'm <span className="highlight">Kelvin</span>, a <span className="highlight">Computer Science First-Class Graduate</span> and current <span className="highlight">Fraud Operations Lead</span> at Nala – a high-growth FinTech. I blend <span className="highlight">technical skill</span> with <span className="highlight">operational leadership</span>, having delivered projects like <span className="highlight">AgileFlow</span>, <span className="highlight">NextGenAI</span>, and the <span className="highlight">Banana Game</span>. My work spans <span className="highlight">ethical AI</span>, <span className="highlight">fraud systems</span>, and <span className="highlight">user-focused tools</span>. I'm passionate about transparency, learning, and turning ideas into useful software.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;