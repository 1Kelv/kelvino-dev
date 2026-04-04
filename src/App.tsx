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
      <div id="home" aria-hidden="true" />
      <Header />
      <Hero />
      <About />
      <Projects />
      <Achievements />
      <Journey />
      <Contact />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default App;
