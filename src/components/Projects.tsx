import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';
import agileflowImg from '../assets/af1.jpeg';
import bananaImg from '../assets/banana.png';
import otHelperImg from '../assets/ot_helper.jpeg';
import regEImg from '../assets/reg_e.jpeg';
import skypulseImg from '../assets/skypulse.png';

const getTechStackUrl = (techArray: string[]) =>
  `https://skillicons.dev/icons?i=${techArray.join(',')}`;

const featuredProjects = [
  {
    title: 'AgileFlow',
    emoji: '⚙️',
    tag: 'Final Year Project · Bronze Award',
    description:
      'An Agile project management tool with AI-driven sprint predictions using TensorFlow. Built with React, TypeScript, and Supabase — earned the Bronze Award for Innovation from SwitchShop Limited.',
    image: agileflowImg,
    techStack: ['react', 'ts', 'js', 'supabase', 'tensorflow', 'github'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/1Kelv/AgileFlow', type: 'primary', external: true },
    ],
  },
  {
    title: 'Thrive Finance',
    emoji: '💸',
    tag: 'Live Product',
    description:
      'A personal finance app that helps users track spending, detect suspicious activity before it costs them, and build healthy financial habits — built by someone who understands fraud firsthand.',
    image: null,
    techStack: ['react', 'ts', 'supabase'],
    links: [
      { label: 'Visit Live App', href: 'https://getmythrive.io', type: 'primary', external: true },
    ],
  },
];

const projects = [
  {
    title: 'Reg-E Radar',
    emoji: '🛡️',
    tag: 'Internal Tool',
    description:
      'A decision-support tool that classifies Regulation E disputes and drafts consistent case notes using a structured checklist and rule-based logic.',
    image: regEImg,
    techStack: ['react', 'js'],
    links: [
      { label: 'Case study on request', href: '#contact', type: 'secondary', external: false },
    ],
  },
  {
    title: 'Overtime Helper',
    emoji: '⏱️',
    tag: 'Internal Tool',
    description:
      'Standardises overtime and bank-holiday calculations from workforce management exports, reducing manual reconciliation work significantly.',
    image: otHelperImg,
    techStack: ['py', 'streamlit'],
    links: [
      { label: 'Case study on request', href: '#contact', type: 'secondary', external: false },
    ],
  },
  {
    title: 'NextGen AI Résumé Analyser',
    emoji: '📊',
    tag: 'AI / ML',
    description:
      'AI-powered résumé analyser using SHAP, LIME, and fairness audit techniques — focused on ethical AI and explainable predictions.',
    image: null,
    techStack: ['py', 'streamlit', 'scikitlearn'],
    links: [
      { label: 'View Analysis', href: 'https://g3tsfvzt8zlfbxsttxk5bh.streamlit.app/', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/nextgen-ai-resume-analyser', type: 'secondary', external: true },
    ],
  },
  {
    title: 'Banana Game',
    emoji: '🍌',
    tag: 'Full Stack',
    description:
      'Interactive browser puzzle fetching banana-themed challenges via an external API. Features authentication, live gameplay, and score tracking.',
    image: bananaImg,
    techStack: ['html', 'css', 'js', 'nodejs', 'express', 'mysql', 'netlify'],
    links: [
      { label: 'Play Game', href: 'https://api-banana-game.netlify.app/', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/banana-game', type: 'secondary', external: true },
    ],
  },
  {
    title: 'SkyPulse Weather App',
    emoji: '🌦',
    tag: 'Frontend',
    description:
      'Responsive weather app delivering real-time forecasts via the OpenWeatherMap API in a clean, intuitive interface.',
    image: skypulseImg,
    techStack: ['html', 'css', 'js', 'netlify'],
    links: [
      { label: 'Check Weather', href: 'https://weather-app-kelvin.netlify.app/', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/weather-app', type: 'secondary', external: true },
    ],
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Projects: React.FC = () => {
  return (
    <section className="projects-section" id="projects">
      <div className="projects-container">
        {/* Section header */}
        <div className="projects-header">
          <span className="section-label">Projects</span>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-subtitle">
            A mix of personal projects, AI tools, and anonymised internal products — built to solve real problems.
          </p>
        </div>

        {/* Featured 2-col grid */}
        <div className="projects-featured-grid">
          {featuredProjects.map((proj, i) => (
            <motion.div
              key={proj.title}
              className="project-card project-card-featured"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {proj.image ? (
                <div className="project-image-wrap">
                  <img
                    className="project-image"
                    src={proj.image}
                    alt={`${proj.title} screenshot`}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="project-image-wrap project-image-placeholder">
                  <span className="placeholder-emoji">{proj.emoji}</span>
                </div>
              )}
              <div className="project-content">
                <div className="project-meta">
                  <span className="project-tag">{proj.tag}</span>
                </div>
                <h3 className="project-title">{proj.emoji} {proj.title}</h3>
                <p className="project-description">{proj.description}</p>
                <div className="tech-stack">
                  <img
                    src={getTechStackUrl(proj.techStack)}
                    alt="Tech stack"
                    className="tech-stack-icons"
                    loading="lazy"
                  />
                </div>
                <div className="project-actions">
                  {proj.links.map((link, idx) => (
                    <a
                      key={idx}
                      className={`btn ${link.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                      href={link.href}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noreferrer' : ''}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Regular grid */}
        <div className="projects-grid">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.title}
              className="project-card"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.15 }}
              variants={cardVariants}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
            >
              {proj.image ? (
                <div className="project-image-wrap">
                  <img
                    className="project-image"
                    src={proj.image}
                    alt={`${proj.title} screenshot`}
                    loading="lazy"
                  />
                </div>
              ) : (
                <div className="project-image-wrap project-image-placeholder">
                  <span className="placeholder-emoji">{proj.emoji}</span>
                </div>
              )}
              <div className="project-content">
                <div className="project-meta">
                  <span className="project-tag">{proj.tag}</span>
                </div>
                <h3 className="project-title">{proj.emoji} {proj.title}</h3>
                <p className="project-description">{proj.description}</p>
                <div className="tech-stack">
                  <img
                    src={getTechStackUrl(proj.techStack)}
                    alt="Tech stack"
                    className="tech-stack-icons"
                    loading="lazy"
                  />
                </div>
                <div className="project-actions">
                  {proj.links.map((link, idx) => (
                    <a
                      key={idx}
                      className={`btn ${link.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
                      href={link.href}
                      target={link.external ? '_blank' : '_self'}
                      rel={link.external ? 'noreferrer' : ''}
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;
