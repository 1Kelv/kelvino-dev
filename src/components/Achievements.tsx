import React from 'react';
import './Achievements.css';
import { motion } from 'framer-motion';

const Achievements: React.FC = () => {
  return (
    <motion.section
      id="achievements"
      className="achievements-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
      viewport={{ once: true }}
    >
      <div className="achievements-container">
        <h2 className="achievements-title">🏆 Achievements & Certifications</h2>

        <div className="achievements-grid">
          {/* Final Year Project Award */}
          <motion.article
            className="ach-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h3 className="ach-card-title">Final Year Project Award</h3>
            <p className="ach-card-text">
              🥉 Awarded the <strong>Bronze Award for Innovation</strong> from{' '}
              <strong>SwitchShop Limited</strong> for my final-year project{' '}
              <strong>AgileFlow</strong>, a React and TypeScript-based Agile project management
              dashboard integrating AI prediction via TensorFlow and fairness auditing tools.
            </p>

            {/* PDF button */}
            <div className="cert-actions">
              <a
                className="btn"
                href="/AgileFlow-Award.pdf"
                target="_blank"
                rel="noopener noreferrer"
              >
                View certificate (PDF)
              </a>
            </div>
          </motion.article>

          {/* Certifications */}
          <motion.article
            className="ach-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <h3 className="ach-card-title">Selected Certifications</h3>

            <ul className="cert-list" aria-label="Certifications">
              {/* Cisco Cybersecurity Essentials */}
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
                    Verify badge
                  </a>
                </div>
              </li>

              {/* Cisco Introduction to Networks */}
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
                    Verify badge
                  </a>
                </div>
              </li>

              {/* Bright Network: Couch to Coder */}
              <li className="cert-row">
                <span className="cert-name">Bright Network: Couch to Coder</span>
                <div className="cert-actions">
                  <a
                    className="btn"
                    href="/CouchToCoder.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate (PDF)
                  </a>
                </div>
              </li>

              {/* Code Institute: 5-Day Coding Challenge */}
              <li className="cert-row">
                <span className="cert-name">Code Institute: 5-Day Coding Challenge</span>
                <div className="cert-actions">
                  <a
                    className="btn"
                    href="/CodeInstitute-Cert.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View certificate (PDF)
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
