import React from 'react';
import githubLogo from '../assets/GitHub-Mark.png';
import linkedinLogo from '../assets/LinkedIn.png';
import mediumLogo from '../assets/Medium.jpg';
import './Contact.css';

const Contact = () => {
  return (
    <section id="contact" className="contact-section" style={{ padding: '2rem 1rem', textAlign: 'center' }}>
      <h2>📮 Contact: Please fill form below.</h2>

      <form 
        name="contact" 
        method="POST" 
        data-netlify="true" 
        style={{ maxWidth: '500px', margin: '2rem auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}
      >
        <input type="hidden" name="form-name" value="contact" />
        <input type="text" name="name" placeholder="Your name" required style={{ padding: '0.7rem', fontSize: '1rem' }} />
        <input type="email" name="email" placeholder="Your email" required style={{ padding: '0.7rem', fontSize: '1rem' }} />
        <textarea name="message" placeholder="Your message" rows={4} required style={{ padding: '0.7rem', fontSize: '1rem' }} />
        <button type="submit" style={{ padding: '0.8rem', fontSize: '1rem', cursor: 'pointer' }}>Send Message</button>
      </form>

      <p style={{ marginTop: '2rem' }}>🌍 Connect with me:</p>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <a href="https://github.com/1Kelv" target="_blank" rel="noopener noreferrer">
          <img src={githubLogo} alt="GitHub" style={{ height: '32px' }} />
        </a>
        <a href="https://www.linkedin.com/in/kelvin-o-72a874226/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinLogo} alt="LinkedIn" style={{ height: '32px' }} />
        </a>
        <a href="https://medium.com/@Only1Kelvin" target="_blank" rel="noopener noreferrer">
          <img src={mediumLogo} alt="Medium" style={{ height: '32px' }} />
        </a>
      </div>
    </section>
  );
};

export default Contact;
