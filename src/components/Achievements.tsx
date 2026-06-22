import React from 'react';
import './Achievements.css';
import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] },
  }),
};

const Achievements: React.FC = () => {
  return (
    <motion.section
      id="achievements"
      className="achievements-section"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="achievements-container">
        <div className="achievements-header">
          <span className="section-label">Recognition</span>
          <h2 className="section-title">Achievements & Certifications</h2>
        </div>

        <div className="achievements-grid">
          {/* Final Year Project Award */}
          <motion.article
            className="ach-card"
            custom={0}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <h3 className="ach-card-title">🥉 Final Year Project Award</h3>
            <p className="ach-card-text">
              Awarded the <strong>Bronze Award for Innovation</strong> from{' '}
              <strong>SwitchShop Limited</strong> for <strong>AgileFlow</strong>: a
              React &amp; TypeScript Agile project management dashboard integrating
              AI sprint prediction via TensorFlow and fairness auditing tools.
            </p>
            <div className="cert-actions">
              <a
                className="btn btn-primary"
                href="/AgileFlow-Award.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Certificate (PDF)
              </a>
            </div>
          </motion.article>

          {/* Certifications */}
          <motion.article
            className="ach-card"
            custom={1}
            initial="hidden"
            whileInView="visible"
            variants={cardVariants}
            viewport={{ once: true }}
          >
            <h3 className="ach-card-title">📜 Selected Certifications</h3>

            <ul className="cert-list" aria-label="Certifications">
              <li className="cert-row">
                <span className="cert-name">Cisco: Cybersecurity Essentials</span>
                <div className="cert-actions">
                  <a
                    className="btn btn-outline"
                    href="https://www.credly.com/badges/63ea10ae-fffa-40cb-9849-c46324a20abd"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Verify Cisco Cybersecurity Essentials badge on Credly"
                  >
                    Verify Badge
                  </a>
                </div>
              </li>

              <li className="cert-row">
                <span className="cert-name">Cisco: Introduction to Networks</span>
                <div className="cert-actions">
                  <a
                    className="btn btn-outline"
                    href="https://www.credly.com/badges/aab7dd0f-5416-4018-886d-78b20377551d"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Verify Cisco Introduction to Networks badge on Credly"
                  >
                    Verify Badge
                  </a>
                </div>
              </li>

              <li className="cert-row">
                <span className="cert-name">Bright Network: Couch to Coder</span>
                <div className="cert-actions">
                  <a
                    className="btn btn-secondary"
                    href="/CouchToCoder.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </div>
              </li>

              <li className="cert-row">
                <span className="cert-name">Code Institute: 5-Day Coding Challenge</span>
                <div className="cert-actions">
                  <a
                    className="btn btn-secondary"
                    href="/CodeInstitute-Cert.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View PDF
                  </a>
                </div>
              </li>
            </ul>
          </motion.article>
        </div>
      </div>
    </motion.section>
  );
};

export default Achievements;
