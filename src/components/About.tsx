import React from 'react';
import { motion } from 'framer-motion';
import './About.css';
import gradPhoto from '../assets/gradphoto.jpg'; // <- put your image in src/assets

const About: React.FC = () => {
  return (
    <motion.section
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="about-container">
        {/* Text */}
        <motion.div
          className="about-text-col"
          initial={{ opacity: 0, x: -16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55 }}
          viewport={{ once: true }}
        >
          <h2 className="about-heading">About Me</h2>

          <p className="about-text">
            Hello 👋🏾 I’m Kelvin, a First-Class Computer Science graduate and current Fraud Operations Lead at{' '}
  <a href="https://www.nala.com/" target="_blank" rel="noopener noreferrer">Nala</a>. 
  I lead initiatives that combat fraud, streamline investigations, and strengthen internal operations through 
  clear, process-driven documentation and data-backed insights.
          </p>

          <p className="about-text">
           I collaborate closely with engineers to review fraud rule performance and share actionable feedback, while 
  creating structured SOPs and workflows in Scribe to support a fast-growing team.  
  Looking ahead, I’m eager to transition into Software Engineering, building scalable, user-focused tools 
  that combine my technical foundation with my operational experience.
          </p>
        </motion.div>

        {/* Image */}
        <motion.div
          className="about-image-col"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.55, delay: 0.05 }}
          viewport={{ once: true }}
        >
          <img
            src={gradPhoto}
            alt="Kelvin Olasupo at graduation"
            className="about-image"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
