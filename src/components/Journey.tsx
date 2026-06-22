import React from 'react';
import { motion } from 'framer-motion';
import './Journey.css';

const experiences = [
  {
    company: 'Nala',
    companyUrl: 'https://www.nala.com/',
    role: 'Fraud Operations Lead',
    period: 'April 2025 – Present',
    location: 'Remote · London, UK',
    bullets: [
      'Shipped 5+ internal tools used daily by the fraud operations team, including Riposte (chargeback automation), NALA Fraud Academy (analyst onboarding), and EXCO Reporter (automated weekly reporting via Claude AI).',
      'Designed fraud detection frameworks and standard operating procedures covering Regulation E disputes, pre-arbitration workflows, and case classification.',
      'Built Hex dashboards and Python tooling for real-time risk monitoring and operational decision support.',
      'Embedded across engineering and data teams, translating operational pain points into technical requirements and shipping solutions into production.',
    ],
    tags: ['React', 'Python', 'Node.js', 'Hex', 'SQL', 'Claude AI'],
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
                  <a
                    href={exp.companyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="exp-company-name"
                  >
                    {exp.company}
                  </a>
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
                  <span key={tag} className="exp-tag">{tag}</span>
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
