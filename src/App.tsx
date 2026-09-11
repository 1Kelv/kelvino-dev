import './App.css';
import BootScreen from './components/BootScreen';
import ScrollProgress from './components/ScrollProgress';
import NetworkCanvas from './components/NetworkCanvas';
import CustomCursor from './components/CustomCursor';
import Header from './components/Header';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import About from './components/About';
import Projects from './components/Projects';
import Achievements from './components/Achievements';
import Journey from './components/Journey';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Terminal from './components/Terminal';
import MusicPlayer from './components/MusicPlayer';
import Toasts from './components/Toasts';
import EasterEggs from './components/EasterEggs';
import BackToTop from './components/BackToTop';

function App() {
  return (
    <div className="App">
      <div id="home" aria-hidden="true" />
      <BootScreen />
      <ScrollProgress />
      <NetworkCanvas />
      <CustomCursor />
      <Header />
      <main className="site-main">
        <Hero />
        <Marquee />
        <Projects />
        <About />
        <Achievements />
        <Journey />
        <Contact />
      </main>
      <Footer />
      <Terminal />
      <MusicPlayer />
      <Toasts />
      <EasterEggs />
      <BackToTop />
    </div>
  );
}

export default App;
