import React, { useState } from 'react';
import './Projects.css';
import { motion, type Variants } from 'framer-motion';
import agileflowImg from '../assets/af1.jpeg';

/** Live screenshot of a site, fetched on demand. Falls back to the emoji tile. */
const microshot = (url: string) =>
  `https://api.microlink.io/?url=${encodeURIComponent(url)}&screenshot=true&meta=false&embed=screenshot.url`;

interface ProjectLink {
  label: string;
  href: string;
  type: 'primary' | 'secondary';
  external: boolean;
}

interface Project {
  title: string;
  emoji: string;
  tag: string;
  description: string;
  image: string | null;
  tech: string[];
  links: ProjectLink[];
}

const featuredProjects: Project[] = [
  {
    title: 'AgileFlow',
    emoji: '⚙️',
    tag: 'Final Year Project · Bronze Award',
    description:
      'An Agile project management tool with AI-driven sprint predictions using TensorFlow. Built with React, TypeScript, and Supabase. Earned the Bronze Award for Innovation from SwitchShop Limited.',
    image: agileflowImg,
    tech: ['React', 'TypeScript', 'Supabase', 'TensorFlow'],
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
    tech: ['React', 'TypeScript', 'Supabase'],
    links: [
      { label: 'Visit Live App', href: 'https://getmythrive.io', type: 'primary', external: true },
    ],
  },
];

const projects: Project[] = [
  {
    title: 'Mylestone',
    emoji: '👶',
    tag: 'Personal Project · PWA',
    description:
      'A production PWA for tracking care schedules for medically complex infants, including babies with congenital heart conditions. Covers feeds, medication, growth, symptoms, appointments, and sleep, with per-user data isolation.',
    image: microshot('https://mylestone-seven.vercel.app'),
    tech: ['React', 'TypeScript', 'Appwrite'],
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
    tech: ['React', 'JavaScript', 'Vite'],
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
    tech: ['React', 'Python', 'Node.js', 'Streamlit'],
    links: [
      { label: 'Case study on request', href: '#contact', type: 'secondary', external: false },
    ],
  },
];

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

/** Moves the spotlight highlight to follow the cursor across a card. */
const onSpotlight = (e: React.MouseEvent<HTMLDivElement>) => {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty('--mx', `${e.clientX - rect.left}px`);
  el.style.setProperty('--my', `${e.clientY - rect.top}px`);
};

const ProjectCard: React.FC<{ project: Project; index: number; featured?: boolean }> = ({
  project,
  index,
  featured,
}) => {
  // Screenshots come from a third-party service, so assume they may not arrive.
  const [imageFailed, setImageFailed] = useState(false);
  const showImage = project.image && !imageFailed;

  return (
    <motion.div
      className={`project-card ${featured ? 'project-card-featured' : ''}`}
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={cardVariants}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.2 }}
      onMouseMove={onSpotlight}
    >
      <span className="project-spotlight" aria-hidden="true" />

      {showImage ? (
        <div className="project-image-wrap">
          <img
            className="project-image"
            src={project.image as string}
            alt={`${project.title} screenshot`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        </div>
      ) : (
        <div className="project-image-wrap project-image-placeholder">
          <span className="placeholder-emoji" aria-hidden="true">{project.emoji}</span>
        </div>
      )}

      <div className="project-content">
        <div className="project-meta">
          <span className="project-tag">{project.tag}</span>
        </div>
        <h3 className="project-title">
          <span aria-hidden="true">{project.emoji}</span> {project.title}
        </h3>
        <p className="project-description">{project.description}</p>

        <ul className="tech-stack" aria-label={`${project.title} tech stack`}>
          {project.tech.map(t => (
            <li key={t} className="tech-chip">{t}</li>
          ))}
        </ul>

        <div className="project-actions">
          {project.links.map(link => (
            <a
              key={link.label}
              className={`btn ${link.type === 'primary' ? 'btn-primary' : 'btn-secondary'}`}
              href={link.href}
              target={link.external ? '_blank' : undefined}
              rel={link.external ? 'noopener noreferrer' : undefined}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

const Projects: React.FC = () => (
  <section className="projects-section" id="projects">
    <div className="projects-container">
      <div className="projects-header">
        <span className="section-label">Projects</span>
        <h2 className="section-title">Things I've Built</h2>
        <p className="section-subtitle">
          Personal projects, my own startup, and internal tooling, built to solve real problems.
        </p>
      </div>

      <div className="projects-featured-grid">
        {featuredProjects.map((proj, i) => (
          <ProjectCard key={proj.title} project={proj} index={i} featured />
        ))}
      </div>

      <div className="projects-grid">
        {projects.map((proj, i) => (
          <ProjectCard key={proj.title} project={proj} index={i} />
        ))}
      </div>
    </div>
  </section>
);

export default Projects;
