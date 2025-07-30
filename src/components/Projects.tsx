

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
            <a href="https://1drv.ms/v/c/23bbc21923c0c329/ESnDwCMZwrsggCPzZAYAAAABormTGWiQE89270qR8-PWbA?e=VB1r2Z" target="_blank" rel="noreferrer">🎥 Watch Demo Video</a>
          </motion.div>
        </div>
        <div className="project-bottom">
          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>📊 NextGen AI Resumer analyser</h3>
            <p>
              AI-powered résumé analyser using SHAP, LIME, and fairness audit techniques. Focus on ethical AI.
            </p>
            <a href="https://1drv.ms/v/c/23bbc21923c0c329/ESnDwCMZwrsggCNoZQYAAAABAwmA4MsO4ocCNMYB49AQYQ?e=fiAesq" target="_blank" rel="noreferrer">🎥 Watch Demo Video</a>
          </motion.div>

          <motion.div className="project-card" whileHover={{ scale: 1.05 }}>
            <h3>🍌 Banana Game</h3>
            <p>
              An interactive browser-based puzzle game that fetches banana-themed challenges via an external API. It includes user registration & login features, with real-time gameplay & score logic. Built using HTML, CSS, JavaScrip, Express.js & MongoDB.
            </p>
            <a href="https://1drv.ms/v/c/23bbc21923c0c329/ESnDwCMZwrsggCMy0wAAAAABWCmkm56ZOiFTw7FYaMyHAg?e=u03y4q" target="_blank" rel="noreferrer">🎥 Watch Demo Video</a>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
