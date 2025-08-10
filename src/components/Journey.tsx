import React from 'react';
import './Journey.css';

const Journey = () => {
  return (
    <section id="journey" className="journey">
      <h2 className="journey-title">Journey Till Date 🚀 </h2>

      <div className="journey-timeline">

        <div className="journey-card">
          <h3>2021 📅</h3>
          <p>📚 Started Foundation Year in Computer Science at University of Bedfordshire.</p>
        </div>

        <div className="journey-card">
          <h3>2022 📅</h3>
          <p>💻 Built early front-end projects using HTML, CSS, and JavaScript. Fell in love with Software development.</p>
        </div>

        <div className="journey-card">
          <h3>2023 📅</h3>
          <p>🧠 Learned Python and completed university projects like the Taxi Booking System as well as Hotel Booking System using Java + SQLite studio; Designed normalised ERD in Oracle APEX</p>
        </div>

        <div className="journey-card">
          <h3>2024 📅</h3>
          <p>👨🏾‍💻 Created Banana Game project using HTML, CSS, JavaScript, Express.js & MongoDB..</p>
        </div>

        <div className="journey-card">
          <h3>2025 📅</h3>
          <p>🎓 Graduated with <strong> First-Class </strong> Honours in Computer Science. Served as Risk Manager in a group Agile project, leading SHAP and LIME integration for AI fairness in the NextGen AI Resumer - an AI-powered CV analyser. Developed AgileFlow, my final-year project, which earned the <b> Bronze Award </b> for Innovation from SwitchShop Limited. Joined Nala as Fraud Operations Lead, building internal SOPs, fraud detection frameworks, and data dashboards. Currently preparing for a master’s degree in Artificial Intelligence & Machine Learning.</p>
          
        </div>

      </div>
    </section>
  );
};

export default Journey;


