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
    period: 'Apr 2025 \u2013 Present',
    location: 'London / Hybrid \u00b7 Cross-border payments',
    bullets: [
      'Built the fraud operations function from zero to six analysts across Nairobi and Dakar, establishing onboarding, quality assurance, performance management and operating standards.',
      'Helped redesign chargeback evidence and challenge workflows. Process improvements, analysis and team coaching contributed to win rates rising from 41.1% in April to 77.2% in May and above 80% in June.',
      'Built banking-partner due-diligence reporting in Hex using SQL and Snowflake, covering 4M+ transactions across 20 EU and UK markets.',
      'Owned the fraud-reporting analysis for a Central Bank of Nigeria return under Nala\u2019s IMTO licence, covering 745,000 transactions. A reconciliation identified a 45-fold scope discrepancy, corrected before certification.',
      'Found that around 30% of automated suspensions were hitting previously cleared customers, and designed a bypass process and SOP to cut repeat false positives.',
      'Built Reg E Radar and Fraud Ops Pulse to standardise dispute evidence and automate recurring operational reporting.',
      'Established a fraud rule feedback loop, turning frontline findings into evidence-backed tuning recommendations for Product, Engineering and Data.',
    ],
    tags: ['Fraud Operations', 'Detection & Controls', 'Payments Risk', 'SQL', 'Snowflake', 'Hex', 'Metabase', 'Team Leadership'],
  },
  {
    company: 'easyJet Holidays',
    role: 'Fraud & Risk Analyst',
    period: 'Nov 2024 \u2013 Mar 2025',
    location: 'Luton, UK',
    bullets: [
      'Investigated booking and payment anomalies using customer and transaction evidence, communicating proportionate risk decisions while balancing fraud prevention against genuine customer experience.',
    ],
    tags: ['Fraud Operations', 'Payments Risk', 'Customer Risk'],
  },
  {
    company: 'TSYS Managed Services EMEA',
    role: 'Fraud Team Manager \u00b7 Sainsbury\u2019s Bank Credit Cards',
    period: '2022 \u2013 Oct 2024',
    location: 'Milton Keynes \u00b7 UK and Irish banking',
    bullets: [
      'Managed 20+ credit-card fraud analysts, owning day-to-day delivery, workload prioritisation, coaching, quality and performance management.',
      'Acted as escalation point for complex account-takeover, card-present and card-not-present fraud cases, driving consistent investigation decisions and customer outcomes.',
      'Used quality reviews and targeted coaching to identify development needs and balance fraud prevention against service expectations.',
    ],
    tags: ['Team Leadership', 'Fraud Operations', 'Customer Risk'],
  },
  {
    company: 'TSYS Managed Services EMEA',
    role: 'Fraud Analyst \u00b7 Disputes & Chargebacks \u00b7 Collections',
    period: 'Jan 2019 \u2013 2022',
    location: 'Milton Keynes \u00b7 Consumer finance portfolios',
    bullets: [
      'Investigated card, account, counterfeit and application fraud across portfolios including Lloyds, Metro Bank, AIB, KBC Bank Ireland, Tandem Bank and 118 118 Money.',
      'Handled retrievals, chargebacks, representment and liability decisions under Visa and Mastercard frameworks, including disputes through the Thomas Cook liquidation and COVID-19 disruption.',
      'Completed a nine-month collections assignment, gaining direct experience of consumer-credit servicing and high-volume customer operations.',
    ],
    tags: ['Disputes & Chargebacks', 'Fraud Operations', 'Payments Risk'],
  },
  {
    company: 'Independent',
    role: 'Software Developer',
    period: '2022 \u2013 Present',
    location: 'Project-based \u00b7 Alongside full-time roles',
    bullets: [
      'Design and ship full-stack applications across React, TypeScript, Node.js, Appwrite/Supabase, SQL and Python, taking products from requirements through deployment and iteration.',
      'Maintain codebases in Git and GitHub with practical documentation, environment configuration and production deployment habits.',
    ],
    tags: ['React', 'TypeScript', 'Node.js', 'Appwrite', 'Supabase', 'Python', 'Git'],
  },
];

const education = {
  school: 'University of Bedfordshire',
  degree: 'BSc Computer Science, First-Class Honours',
  period: '2021 – 2025',
  note: 'Bronze Award for Innovation from SwitchShop Limited, awarded for AgileFlow. Google Data Analytics Professional Certificate in progress.',
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
