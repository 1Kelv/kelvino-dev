import React from 'react';
import './Journey.css';

const Journey = () => {
  return (
    <section id="journey" className="journey">
      <h2 className="journey-title">My Journey 🚀 </h2>

      <div className="journey-timeline">

        <div className="journey-card">
          <h3>2021 📅</h3>
          <p>📚 Started Foundation Year in Computer Science at University of Bedfordshire.</p>
        </div>

        <div className="journey-card">
          <h3>2022 📅</h3>
          <p>💻 Built early front-end projects using HTML, CSS, and JavaScript. Fell in love with tech.</p>
        </div>

        <div className="journey-card">
          <h3>2023 📅</h3>
          <p>🧠 Learned Python deeply and completed university projects like the Taxi Booking System as well as Hotel Booking System using Java + SQLite studio; Designed normalised ERD in Oracle APEX</p>
        </div>

        <div className="journey-card">
          <h3>2024 📅</h3>
          <p>👨🏾‍💻 Created Banana Game project using JavaScript & React.</p>
        </div>

        <div className="journey-card">
          <h3>2025 📅</h3>
          <p>🎓 Graduated with <strong>First-Class</strong> in Computer Science. Worked on SHAP and LIME for AI fairness. Created AgileFlow, my final-year project, which won the <strong>Bronze Award </strong> for Innovation from SwitchShop Limited. Joined <strong>Nala</strong> as Fraud Ops Lead. Built internal SOPs and dashboards. Preparing for political ambitions and future master's studies in Artificial Intelligence & Machine Learning</p>
        </div>

      </div>
    </section>
  );
};

export default Journey;
