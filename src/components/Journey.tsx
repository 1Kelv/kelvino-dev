import React from 'react';
import './Journey.css';

const journeyData = [
  {
    year: '2021',
    text: '📘 Started Foundation Year in Computer Science at the University of Bedfordshire.',
  },
  {
    year: '2022',
    text: '💻 Developed PenCraft, a collaborative author portal built with HTML, CSS, and JavaScript. This project helped strengthen my understanding of front-end development and UI/UX basics, sparking my passion for software engineering.',
  },
  {
    year: '2023',
    text: '🧠 Learned Python and completed several university projects, including: Taxi Booking System (Java + SQLite Studio) and Hotel Booking System (Java + SQLite Studio). Designed and implemented a normalised ERD in Oracle APEX. These experiences gave me a strong grounding in back-end logic, database management, and system design.',
  },
  {
    year: '2024',
    text: '🎮 Created the Banana Game, a full-stack API-fetching banana-themed game using HTML, CSS, JavaScript, Express.js, and MySQL. This project sharpened my ability to integrate APIs and build interactive front-to-back solutions.',
  },
  {
    year: '2025',
    text: '🎓 Graduated with First-Class Honours in Computer Science. Served as Risk Manager in a group Agile project, leading SHAP and LIME integration for AI fairness in the NextGen AI Resumer (AI-powered CV analyser). Developed AgileFlow, my final-year project, which earned the Bronze Award for Innovation from SwitchShop Limited. Joined Nala as Fraud Operations Lead, building internal SOPs, fraud detection frameworks, and data dashboards. Currently preparing for a master’s degree in Artificial Intelligence & Machine Learning.',
  },
];

const Journey: React.FC = () => {
  return (
    <section id="journey" className="journey-section">
      <div className="journey-container">
        <h2 className="journey-title">Journey Till Date 🚀</h2>

        <div className="timeline">
          {journeyData.map((item, index) => (
            <div key={index} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <h3 className="timeline-year">{item.year}</h3>
                <p className="timeline-text">{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Journey;
