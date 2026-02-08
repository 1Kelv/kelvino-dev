import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';
import agileflowImg from '../assets/af1.jpeg';
import bananaImg from '../assets/banana.png';
import otHelperImg from '../assets/ot_helper.jpeg';
import regEImg from '../assets/reg_e.jpeg';
import skypulseImg from '../assets/skypulse.png';

const Projects = () => {
 const getTechStackUrl = (techArray: string[]) => {
  return `https://skillicons.dev/icons?i=${techArray.join(',')}`;
};

  const featuredProject = {
    title: '⚙️ AgileFlow',
    description: 'An Agile project management tool with AI-driven sprint predictions using TensorFlow. Built with React, TypeScript + JavaScript and Supabase.',
    image: agileflowImg,
    techStack: ['react', 'ts', 'js', 'supabase', 'tensorflow', 'github'],
    links: [
      { label: 'View on GitHub', href: 'https://github.com/1Kelv/AgileFlow', type: 'primary', external: true }
    ],
  };

  const projects = [
    {
      title: '🛡️ Reg-E Radar (Anonymised Internal Tool)',
      description: 'A decision-support tool that helps classify Regulation E disputes and draft consistent case notes using a structured checklist and rule-based logic.',
      image: regEImg,
      techStack: ['react', 'js'],
      links: [
        { label: 'Case study on request', href: '#contact', type: 'secondary', external: false }
      ],
    },
    {
      title: '⏱️ Overtime Helper (Anonymised Internal Tool)',
      description: 'An internal tool that standardises overtime and bank-holiday calculations from workforce management exports, reducing manual reconciliation work.',
      image: otHelperImg,
      techStack: ['py', 'streamlit'],
      links: [
        { label: 'Case study on request', href: '#contact', type: 'secondary', external: false }
      ],
    },
    {
      title: '📊 NextGen AI Résumé Analyser',
      description: 'AI-powered résumé analyser using SHAP, LIME, and Fairness Audit techniques, with a focus on ethical AI and explainable predictions.',
      image: null,
      techStack: ['py', 'streamlit', 'scikitlearn'],
      links: [
        { label: 'View Analysis', href: 'https://g3tsfvzt8zlfbxsttxk5bh.streamlit.app/', type: 'primary', external: true },
        { label: 'GitHub Repo', href: 'https://github.com/1Kelv/nextgen-ai-resume-analyser', type: 'secondary', external: true }
      ],
    },
    {
      title: '🍌 Banana Game',
      description: 'Interactive browser puzzle fetching banana-themed challenges via an external API. Features authentication, live gameplay, and score tracking.',
      image: bananaImg,
      techStack: ['html', 'css', 'js', 'nodejs', 'express', 'mysql', 'netlify'],
      links: [
        { label: 'Play Game', href: 'https://api-banana-game.netlify.app/', type: 'primary', external: true },
        { label: 'GitHub Repo', href: 'https://github.com/1Kelv/banana-game', type: 'secondary', external: true }
      ],
    },
    {
      title: '🌦 SkyPulse Weather App',
      description: 'Responsive weather app that delivers real-time forecasts via OpenWeatherMap API in a clean, intuitive interface.',
      image: skypulseImg,
      techStack: ['html', 'css', 'js', 'netlify'],
      links: [
        { label: 'Check Weather', href: 'https://weather-app-kelvin.netlify.app/', type: 'primary', external: true },
        { label: 'GitHub Repo', href: 'https://github.com/1Kelv/weather-app', type: 'secondary', external: true }
      ],
    },
  ];

  return (
    <section className="projects-container" id="projects">
      <h2 className="section-title">Projects</h2>
      <motion.div className="project-card project-card-featured" whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
        <div className="project-image-wrap">
          <img className="project-image" src={featuredProject.image} alt="AgileFlow screenshot" loading="lazy" />
        </div>
        <div className="project-content">
          <h3>{featuredProject.title}</h3>
          <p>{featuredProject.description}</p>
          <div className="tech-stack">
            <img src={getTechStackUrl(featuredProject.techStack)} alt="Tech stack icons" className="tech-stack-icons" loading="lazy" />
          </div>
          <div className="project-actions">
            {featuredProject.links.map((link, idx) => (
              <a key={idx} className={link.type === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'} href={link.href} target={link.external ? '_blank' : '_self'} rel={link.external ? 'noreferrer' : ''}>
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </motion.div>
      <div className="projects-grid">
        {projects.map((proj, projIdx) => (
          <motion.div key={projIdx} className="project-card" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            {proj.image ? (
              <div className="project-image-wrap">
                <img className="project-image" src={proj.image} alt={`${proj.title} screenshot`} loading="lazy" />
              </div>
            ) : (
              <div className="project-image-wrap project-image-placeholder">
                <span>Screenshot coming soon</span>
              </div>
            )}
            <div className="project-content">
              <h3>{proj.title}</h3>
              <p>{proj.description}</p>
              <div className="tech-stack">
                <img src={getTechStackUrl(proj.techStack)} alt="Tech stack icons" className="tech-stack-icons" loading="lazy" />
              </div>
              <div className="project-actions">
                {proj.links.map((link, linkIdx) => (
                  <a key={linkIdx} className={link.type === 'primary' ? 'btn btn-primary' : 'btn btn-secondary'} href={link.href} target={link.external ? '_blank' : '_self'} rel={link.external ? 'noreferrer' : ''}>
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Projects;