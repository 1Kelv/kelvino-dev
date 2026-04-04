import React from 'react';
import { motion } from 'framer-motion';
import './Journey.css';

const journeyData = [
  {
    year: '2021',
    text: '📘 Started Foundation Year in Computer Science at the University of Bedfordshire.',
  },
  {
    year: '2022',
    text: '💻 Developed PenCraft, a collaborative author portal built with HTML, CSS, and JavaScript — sparking a passion for software engineering and UI/UX fundamentals.',
  },
  {
    year: '2023',
    text: '🧠 Expanded into Python and back-end development: built a Taxi Booking System and Hotel Booking System (Java + SQLite), and designed a normalised ERD in Oracle APEX. Gained strong grounding in database management and system design.',
  },
  {
    year: '2024',
    text: '🎮 Created the Banana Game — a full-stack API-driven browser game using HTML, CSS, JavaScript, Express.js, and MySQL. Sharpened API integration and end-to-end development skills.',
  },
  {
    year: '2025',
    text: '🎓 Graduated with First-Class Honours in Computer Science. Led SHAP & LIME integration in the NextGen AI Résumé Analyser. Developed AgileFlow, earning the Bronze Award for Innovation. Joined Nala as Fraud Operations Lead — building internal SOPs, fraud detection frameworks, and data dashboards. Launched Thrive Finance (getmythrive.io). Preparing for an MSc in AI & Machine Learning.',
  },
];

const Journey: React.FC = () => {
  return (
    <section id="journey" className="journey-section">
      <div className="journey-container">
        <div className="journey-header">
          <span className="section-label">Journey</span>
          <h2 className="section-title">Journey Till Date 🚀</h2>
        </div>

        <div className="timeline">
          {journeyData.map((item, index) => (
            <motion.div
              key={index}
              className="timeline-item"
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
              viewport={{ once: true, amount: 0.3 }}
            >
              <div className="timeline-marker" />
              <div className="timeline-content">
                <h3 className="timeline-year">{item.year}</h3>
                <p className="timeline-text">{item.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
