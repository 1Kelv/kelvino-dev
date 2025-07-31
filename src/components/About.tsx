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
            Hello 👋🏾,<span className="highlight">I'm Kelvin, a Computer Science First-Class Graduate and current Fraud Operations Lead at Nala – a high-growth FinTech company. With over 6 years of experience in fraud analysis & prevention, I specialise in building fraud detection systems, designing rules, & creating real-time dashboards using tools like Hex and SQL.</span> At Nala, I lead initiatives that combat fraud across multiple channels, while also building scalable processes and documentation to support global operations. My role blends technical skill with operational insight, from fraud rule optimisation to chargeback strategy and team workflow design.
 <span className="highlight">I’m also passionate about software development & recently launched this personal portfolio to showcase my journey. It highlights some of my proudest tech work</span> I enjoy turning ideas into functional, user-focused web tools, & I’m always learning. 
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;

