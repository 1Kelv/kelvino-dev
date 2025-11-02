import React from 'react';
import './App.css';
import BackToTop from './components/BackToTop';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
      {/* True page-top anchor so clicking the brand always goes to the very top */}
      <div id="home" aria-hidden="true" />

      <Header />

      {/* Hero Section (kept as-is; the real #home is now above the header) */}
      <section id="hero">
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
      
      {/* Achievements Section */}
      <section id="achievements">
        <Achievements />
      </section>

      {/* Journey Section */}
      <section id="journey">
        <Journey />
      </section>

      <BackToTop />

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
// git add .
// git commit -m "Add top-of-page #home anchor and smooth scroll"
// git push origin main
