

import React from 'react';
import './Projects.css';
import { motion } from 'framer-motion';

const Projects = () => {
  return (
    <section className="projects-container" id="projects">
      <h2>Projects</h2>
      <div className="project-triangle">
        <div className="project-top">
          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>

            <h3>⚙️ AgileFlow</h3>
            <p>
              An Agile project management tool with AI-driven sprint predictions using TensorFlow. Built using React, TypeScript, Supabase.
            </p>
            <a href="https://github.com/1Kelv/AgileFlow" target="_blank" rel="noreferrer"> 🐙 GitHub</a>
          </motion.div>
        </div>
        <div className="project-bottom">
          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>📊 NextGen AI Resumer analyser</h3>
            <p>
              AI-powered résumé analyser using SHAP, LIME, and fairness audit techniques. Focus on ethical AI.
            </p>
            <a href="https://g3tsfvzt8zlfbxsttxk5bh.streamlit.app/" target="_blank" rel="noreferrer"> 📊 View Analysis</a>
          </motion.div>

          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>🍌 Banana Game</h3>
            <p>
              An interactive browser-based puzzle game that fetches banana-themed challenges via an external API. It includes user registration & login features, with real-time gameplay & score logic. Built using HTML, CSS, JavaScrip, Express.js & MongoDB.
            </p>
            <a href="https://api-banana-game.netlify.app/" target="_blank" rel="noreferrer">🎮 Play Game</a>
          </motion.div>

          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>🌦 Weather Forecast App</h3>
            <p>
              Stay ahead of the weather with this responsive web app that delivers real-time forecasts in a clean, intuitive interface. Built with HTML, CSS, and vanilla JavaScript, it integrates the OpenWeatherMap API to let users quickly check conditions in any city worldwide.
            </p>
            <a href="https://weather-app-kelvin.netlify.app/" target="_blank" rel="noreferrer">
👉 Check your weather</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
