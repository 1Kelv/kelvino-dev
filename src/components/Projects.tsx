import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';

const Projects = () => {
  return (
    <section className="projects-container" id="projects">
      <h2 className="section-title">Projects</h2>

      <div className="project-triangle">
        {/* Top (single) */}
        <div className="project-top">
          <motion.div className="project-card" whileHover={{ scale: 1.02 }}>
            <h3>⚙️ AgileFlow</h3>
            <p>
              An Agile project management tool with AI-driven sprint predictions using TensorFlow.
              Built with React, TypeScript + JavaScript &amp; Supabase.
            </p>

            <div className="project-actions">
              <a
                className="btn btn-primary"
                href="https://github.com/1Kelv/AgileFlow"
                target="_blank"
                rel="noreferrer"
              >
                View on GitHub
              </a>
            </div>
          </motion.div>
        </div>

        {/* Bottom row (three) */}
        <div className="project-bottom">
          {/* NextGen AI */}
          <motion.div className="project-card" whileHover={{ scale: 1.02 }}>
            <h3>📊 NextGen AI Resumer analyser</h3>
            <p>
              AI-powered résumé analyser using SHAP (SHapley Additive exPlanations), LIME (Local Interpretable Model-Agnostic Explanations), and Fairness Audit techniques, with a focus on ethical AI and explainable predictions.
            </p>
            <div className="project-actions">
              <a
                className="btn btn-primary"
                href="https://g3tsfvzt8zlfbxsttxk5bh.streamlit.app/"
                target="_blank"
                rel="noreferrer"
              >
                View Analysis
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/1Kelv/nextgen-ai-resume-analyser"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repo
              </a>
            </div>
          </motion.div>

          {/* Banana Game */}
          <motion.div className="project-card" whileHover={{ scale: 1.02 }}>
            <h3>🍌 Banana Game</h3>
            <p>
              Interactive browser puzzle fetching banana-themed challenges via an external API.
              Features authentication, live gameplay and score tracking. Built with HTML, CSS,
              JavaScript, Express.js &amp; MySQL.
            </p>
            <div className="project-actions">
              <a
                className="btn btn-primary"
                href="https://api-banana-game.netlify.app/"
                target="_blank"
                rel="noreferrer"
              >
                Play Game
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/1Kelv/banana-game"
                target="_blank"
                rel="noreferrer"
              >
                GitHub Repo
              </a>
            </div>
          </motion.div>

          {/* Weather Forecast App */}
          <motion.div className="project-card" whileHover={{ scale: 1.02 }}>
            <h3>🌦 Weather Forecast App</h3>
            <p>
              Responsive weather app that delivers real-time forecasts via OpenWeatherMap API in
              a clean, intuitive interface. Built with HTML, CSS &amp; vanilla JavaScript.
            </p>
            <div className="project-actions">
              <a
                className="btn btn-primary"
                href="https://weather-app-kelvin.netlify.app/"
                target="_blank"
                rel="noreferrer"
              >
                Check Weather
              </a>
              <a
                className="btn btn-secondary"
                href="https://github.com/1Kelv/weather-app"
                target="_blank"
                rel="noreferrer"
              >
              GitHub Repo
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
