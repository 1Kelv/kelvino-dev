import React from 'react';
import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      <Header />

      {/* Hero Section */}
      <section id="home">
        <Hero />
      </section>

      {/* About Section */}
      <section id="about">
        <About />
      </section>

      {/* Projects Section */}
      <section id="projects">
        <Projects />
      </section>

      {/* Journey Section */}
      <section id="journey">
        <Journey />
      </section>

      {/* Contact Section */}
      <section id="contact">
        <Contact />
      </section>

      <Footer />
    </div>
  );
}

export default App;

/* to update any github commits */
// Note: This file is the main entry point for the React application. 
// git add .
// git commit -m "updated hero role text or relevant changes made"

// git push origin main

