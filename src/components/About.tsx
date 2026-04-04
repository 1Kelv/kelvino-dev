import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import gradPhoto from '../assets/gradphoto.jpg';

const skills = [
  'React', 'TypeScript', 'JavaScript', 'Python', 'Streamlit',
  'Supabase', 'Node.js', 'SQL', 'TensorFlow', 'Framer Motion',
  'Hex Dashboards', 'Fraud Operations', 'Data Analytics', 'Git',
];

const About: React.FC = () => {
  const sectionRef = useRef<HTMLElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start 80%', 'end 20%'],
  });

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
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="about-container">
        {/* Text column */}
        <motion.div
          className="about-text-col"
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="about-header">
            <span className="section-label">About Me</span>
            <h2 className="section-title">Engineer. Analyst. Builder.</h2>
          </div>

          <p className="about-text">
            I'm Kelvin — a First-Class Computer Science graduate and Fraud Operations Lead working at the intersection of software engineering, data analytics, and operational problem-solving. I design and build internal tools that improve decision-making, reduce manual effort, and scale operational processes.
          </p>

          <p className="about-text">
            My day-to-day blends hands-on development with real-world impact: React-based interfaces, Python tooling, and Hex dashboards that surface meaningful risk signals. I collaborate closely with engineers and data teams, translating operational pain points into technical requirements and iterating on solutions that work in production.
          </p>

          <p className="about-text">
            I'm actively transitioning toward software engineering roles — with a particular focus on product-focused engineering, internal tooling, and data-driven systems. Currently preparing for a master's degree in AI & Machine Learning.
          </p>

          <div className="about-skills">
            {skills.map(skill => (
              <span key={skill} className="skill-chip">{skill}</span>
            ))}
          </div>
        </motion.div>

        {/* Image column */}
        <motion.div
          className="about-image-col"
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.15 }}
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
