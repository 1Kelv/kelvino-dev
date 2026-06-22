import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import gradPhoto from '../assets/gradphoto.jpg';

const skills = [
  'React', 'TypeScript', 'JavaScript', 'Python', 'Streamlit',
  'Supabase', 'Appwrite', 'Node.js', 'SQL', 'Playwright',
  'Hex Dashboards', 'Claude AI', 'Fraud Operations', 'Data Analytics', 'Git',
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
            <h2 className="section-title">Engineer. Founder. Fraud specialist.</h2>
          </div>

          <p className="about-text">
            I'm Kelvin, a First-Class CS graduate and Fraud Operations Lead at Nala. I build the tools my team actually relies on: fraud detection frameworks, dispute automation, analyst onboarding, and the dashboards that surface risk before it becomes a problem.
          </p>

          <p className="about-text">
            My stack spans React, TypeScript, Python, and a growing set of AI tooling. I've shipped production software across fraud operations, fintech, and healthcare. Outside Nala, I co-founded Sentinel, an AI agent assist platform for debt support teams, and run Thrive Finance, a personal finance app with 12+ active users.
          </p>

          <p className="about-text">
            I'm looking for software engineering roles focused on product and AI systems. Working toward an MSc in AI and Machine Learning.
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
