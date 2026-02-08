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
            Hello 👋 I’m Kelvin, a First-Class Computer Science graduate and Fraud Operations Lead with a strong focus on building practical software and data solutions. I work at the intersection of software engineering, data analytics, and fraud operations, where I design and build internal tools that improve decision-making, reduce manual effort, and scale operational processes. My day-to-day work blends hands-on development with real-world problem solving, from building React-based interfaces and Python tooling to designing Hex dashboards that surface meaningful risk signals.
          </p>

          <p className="about-text">
            Alongside my operational role, I collaborate closely with engineers and data teams to review fraud-rule performance, translate operational pain points into technical requirements, and iterate on solutions that work in production. I care deeply about clarity in code, in data, and in process, which is why I also create structured SOPs and workflows that support fast-growing teams.

Looking ahead, I’m continuing to transition towards software engineering roles, with a particular interest in product-focused engineering, internal tooling, and data-driven systems. I enjoy building software that sits close to real users and real problems, where technical decisions have immediate, practical impact.
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
