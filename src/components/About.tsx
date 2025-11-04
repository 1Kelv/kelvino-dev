import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import gradPhoto from '../assets/gradphoto.jpg';

const About: React.FC = () => {
  // Track scroll progress *within* the About section
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    // Starts reacting as the section begins to enter, and stops as it fully leaves
    offset: ['start 80%', 'end 20%'],
  });

  // Fade/scale curve: invisible at edges, fully visible through the middle
  const imgOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const imgScale   = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.96, 1, 1, 0.96]);

  return (
    <motion.section
      ref={sectionRef}
      id="about"
      className="about-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.25 }}
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
            I collaborate closely with engineers to review fraud-rule performance and share actionable feedback, while
            creating structured SOPs and workflows in Scribe to support a fast-growing team. Looking ahead, I’m eager to
            transition into Software Engineering, building scalable, user-focused tools that combine my technical
            foundation with my operational experience.
          </p>
        </motion.div>

        {/* Image (scroll-linked fade) */}
        <motion.div
          className="about-image-col"
          initial={{ opacity: 0, x: 16 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.55, delay: 0.25 }}
          viewport={{ once: true }}
        >
          <motion.img
            src={gradPhoto}
            alt="Kelvin Olasupo at graduation"
            className="about-image"
            style={{ opacity: imgOpacity, scale: imgScale, willChange: 'opacity, transform' }}
          />
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
