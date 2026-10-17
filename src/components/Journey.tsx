import React from 'react';
import { motion } from 'framer-motion';
import './Journey.css';
import TechIcon from './TechIcon';

interface Experience {
  company: string;
  /** Omitted when there is no single company to link to. */
  companyUrl?: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
  tags: string[];
}

const experiences: Experience[] = [
  {
    company: 'Nala',
    companyUrl: 'https://www.nala.com/',
    role: 'Fraud Operations Lead',
    period: 'April 2025 \u2013 Present',
    location: 'Remote \u00b7 London, UK',
    bullets: [
      'Shipped 5+ internal tools used daily by the fraud operations team, including Riposte (chargeback automation), NALA Fraud Academy (analyst onboarding), and EXCO Reporter (automated weekly reporting via Claude AI).',
      'Lead a six-person team, owning delivery across fraud operations, tooling, process improvement, and cross-functional technical initiatives.',
      'Designed fraud detection frameworks and standard operating procedures covering Regulation E disputes, pre-arbitration workflows, and case classification.',
      'Write SQL and build operational analysis in Hex and Metabase, translating complex operational and compliance problems into testable technical requirements.',
      'Embedded across engineering and product teams, translating operational pain points into technical requirements and shipping solutions into production.',
    ],
    tags: ['React', 'Python', 'Node.js', 'Hex', 'Metabase', 'SQL', 'Claude AI', 'Team Leadership'],
  },
  {
    company: 'Independent',
    role: 'Software Developer',
    period: '2022 \u2013 Present',
    location: 'Project-based \u00b7 Remote',
    bullets: [
      'Design and ship full-stack applications across React, TypeScript, Node.js, Appwrite/Supabase, SQL, and Python, taking products from requirements through deployment and iteration.',
      'Maintain codebases in Git and GitHub with practical documentation, environment configuration, and production deployment habits.',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Appwrite', 'Supabase', 'SQL', 'Python', 'Git'],
  },
  {
    company: 'easyJet Holidays & TSYS Managed Services',
    role: 'Fraud & Risk / Operations',
    period: '2019 \u2013 2025',
    location: 'EMEA \u00b7 UK',
    bullets: [
      'Built professional experience across regulated financial services, payments, customer risk, operations, and team leadership, providing strong domain context for product and engineering decisions.',
    ],
    tags: ['Fraud Operations', 'Payments', 'Customer Risk', 'Financial Services', 'Team Leadership'],
  },
];

const education = {
  school: 'University of Bedfordshire',
  degree: 'BSc Computer Science, First-Class Honours',
  period: '2021 – 2025',
  note: 'Bronze Award for Innovation from SwitchShop Limited, awarded for AgileFlow.',
};

const Journey: React.FC = () => {
  return (
    <section id="experience" className="experience-section">
      <div className="experience-container">
        <div className="experience-header">
          <span className="section-label">Experience</span>
          <h2 className="section-title">Where I've Worked</h2>
        </div>

        <div className="exp-list">
          {experiences.map((exp, i) => (
            <motion.div
              key={exp.company}
              className="exp-card"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="exp-top">
                <div className="exp-company-info">
                  {exp.companyUrl ? (
                    <a
                      href={exp.companyUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="exp-company-name"
                    >
                      {exp.company}
                    </a>
                  ) : (
                    <span className="exp-company-name">{exp.company}</span>
                  )}
                  <span className="exp-location">{exp.location}</span>
                </div>
                <div className="exp-date-info">
                  <span className="exp-role">{exp.role}</span>
                  <span className="exp-period">{exp.period}</span>
                </div>
              </div>

              <ul className="exp-bullets">
                {exp.bullets.map((bullet, idx) => (
                  <li key={idx} className="exp-bullet">{bullet}</li>
                ))}
              </ul>

              <div className="exp-tags">
                {exp.tags.map(tag => (
                  <span key={tag} className="exp-tag">
                    <TechIcon name={tag} />
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="edu-card"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="edu-top">
            <div className="edu-info">
              <span className="edu-school">{education.school}</span>
              <span className="edu-degree">{education.degree}</span>
            </div>
            <span className="edu-period">{education.period}</span>
          </div>
          {education.note && (
            <p className="edu-note">{education.note}</p>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export default Journey;
