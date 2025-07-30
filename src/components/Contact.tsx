// src/components/Contact.tsx
import React from 'react';
import githubLogo from '../assets/GitHub-Mark.png';
import linkedinLogo from '../assets/LinkedIn.png';
import mediumLogo from '../assets/Medium.jpg';

const Contact = () => {
  return (
    <section style={{ padding: '2rem 1rem' }}>
      <h2>📮Contact</h2>
      <p>📧 Email: kelvinolasupo@yahoo.com</p>
      <p>🌍 Connect with me:</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
        <div id="contact" className="contact-section">
  {/* rest of your contact content */}
</div>

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
