import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import './About.css';
import gradPhoto from '../assets/gradphoto.jpg';
import TechIcon from './TechIcon';

const skills = [
  // Fraud and risk first: this is the career, not the hobby.
  'Fraud Operations', 'Fraud Strategy', 'Detection & Controls', 'Disputes & Chargebacks',
  'Payments Risk', 'Team Leadership', 'Regulatory Reporting',
  // Then the analytics that back it up.
  'SQL', 'Snowflake', 'Hex', 'Metabase', 'Python',
  // Then the engineering that makes the tooling possible.
  'React', 'TypeScript', 'Node.js', 'Git',
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
            <h2 className="section-title">7+ years in fraud. I build the tooling too.</h2>
          </div>

          <p className="about-text">
            I'm Kelvin, a Fraud Operations Lead at Nala. I've spent 7+ years in fraud, risk and payments across fintech, card issuing and consumer finance. I built Nala's fraud operations function from zero to six analysts across Nairobi and Dakar, and before that managed a team of 20+ credit-card fraud analysts at TSYS.
          </p>

          <p className="about-text">
            Most of my work is detection and controls: finding where losses concentrate, working out whether a rule is firing late or catching good customers, and turning frontline findings into evidence Product and Engineering can act on. Redesigning chargeback evidence and coaching the team took win rates from 41% to over 80% in three months. I've built fraud reporting covering 4M+ transactions across 20 EU and UK markets, and owned the fraud analysis behind a Central Bank of Nigeria regulatory return.
          </p>

          <p className="about-text">
            I'm also a First-Class Computer Science graduate, which means I build the tooling rather than wait for it. Reg E Radar standardises Regulation E dispute decisions, Fraud Ops Pulse automates the team's reporting, and Card Scheme Health monitors authorisations and 3DS performance. That combination is the point: I can see the operational problem and close the loop myself.
          </p>

          <p className="about-text">
            I'm looking for fraud risk, fraud strategy and payments risk leadership roles. Engineering roles where the fraud domain genuinely matters are welcome too. Currently working through the Google Data Analytics certificate, with an MSc in AI and Machine Learning starting next year.
          </p>

          <div className="about-skills">
            {skills.map(skill => (
              <span key={skill} className="skill-chip">
                <TechIcon name={skill} />
                {skill}
              </span>
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
          <div className="about-image-frame">
            <motion.img
              src={gradPhoto}
              alt="Kelvin Olasupo at graduation"
              className="about-image"
              style={{ opacity: imgOpacity, scale: imgScale, willChange: 'opacity, transform' }}
            />
            <span className="about-sticker about-sticker-one" aria-hidden="true">First-Class 🎓</span>
            <span className="about-sticker about-sticker-two" aria-hidden="true">London 📍</span>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
};

export default About;
