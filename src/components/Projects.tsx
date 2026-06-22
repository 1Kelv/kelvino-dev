import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';
import agileflowImg from '../assets/af1.jpeg';

const getTechStackUrl = (techArray: string[]) =>
  `https://skillicons.dev/icons?i=${techArray.join(',')}`;

const microshot = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

const featuredProjects = [
  {
    title: 'AgileFlow',
    emoji: '⚙️',
    tag: 'Final Year Project · Bronze Award',
    description:
      'An Agile project management tool with AI-driven sprint predictions using TensorFlow. Built with React, TypeScript, and Supabase. Earned the Bronze Award for Innovation from SwitchShop Limited.',
    image: agileflowImg,
    techStack: ['react', 'ts', 'js', 'supabase', 'tensorflow', 'github'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/1Kelv/AgileFlow', type: 'primary', external: true },
    ],
  },
  {
    title: 'Thrive Finance',
    emoji: '💸',
    tag: 'Startup · Now Live',
    description:
      'My own startup. A personal finance app that helps users track spending, catch suspicious activity before it costs them, and build healthy financial habits, built by someone who understands fraud firsthand. 12+ users and actively iterating.',
    image: microshot('https://getmythrive.io'),
    techStack: ['react', 'ts', 'supabase'],
    links: [
      { label: 'Visit Live App', href: 'https://getmythrive.io', type: 'primary', external: true },
    ],
  },
];

const projects = [
  {
    title: 'Sentinel',
    emoji: '🔍',
    tag: 'Startup · Co-Founder',
    description:
      'Real-time AI vulnerability detection for collections and debt support agents. Listens to live calls, identifies financial distress signals, and guides agents with compliance-ready prompts. FCA Consumer Duty aligned.',
    image: microshot('https://sentinel-taupe-theta.vercel.app'),
    techStack: ['react', 'ts', 'nodejs'],
    links: [
      { label: 'Visit App', href: 'https://sentinel-taupe-theta.vercel.app/', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/sentinel', type: 'secondary', external: true },
    ],
  },
  {
    title: 'Mylestone',
    emoji: '👶',
    tag: 'Personal Project · PWA',
    description:
      'A production PWA for tracking care schedules for medically complex infants, including babies with congenital heart conditions. Covers feeds, medication, growth, symptoms, appointments, and sleep, with per-user data isolation.',
    image: microshot('https://mylestone-seven.vercel.app'),
    techStack: ['react', 'ts', 'appwrite'],
    links: [
      { label: 'Visit App', href: 'https://mylestone-seven.vercel.app', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/mylestone', type: 'secondary', external: true },
    ],
  },
  {
    title: 'AlertIQ',
    emoji: '🚨',
    tag: 'Training Tool',
    description:
      'Interactive fraud analyst training simulator built for the Fraud Analysis Bootcamp. Runs timed exam scenarios, scores performance, and sharpens threat detection skills using real-world alert patterns.',
    image: microshot('https://fraud-simulator-three.vercel.app'),
    techStack: ['react', 'js', 'vite'],
    links: [
      { label: 'Try It', href: 'https://fraud-simulator-three.vercel.app', type: 'primary', external: true },
      { label: 'GitHub', href: 'https://github.com/1Kelv/alertiq', type: 'secondary', external: true },
    ],
  },
  {
    title: 'Internal Tooling @ Nala',
    emoji: '🔧',
    tag: 'Internal · Nala',
    description:
      'Five production tools built for the Fraud Ops team: Riposte (chargeback automation), NALA Fraud Academy (analyst onboarding), EXCO Reporter (automated weekly reporting via Claude AI), Reg-E Radar (Regulation E dispute classification), and Overtime Helper (payroll reconciliation).',
    image: null,
    techStack: ['react', 'py', 'nodejs', 'js', 'streamlit'],
    links: [
      { label: 'Case study on request', href: '#contact', type: 'secondary', external: false },
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
        <div className="projects-header">
          <span className="section-label">Projects</span>
          <h2 className="section-title">Things I've Built</h2>
          <p className="section-subtitle">
            Personal projects, startup work, and internal tooling, built to solve real problems.
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
