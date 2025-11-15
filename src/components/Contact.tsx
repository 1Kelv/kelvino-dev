import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Contact.css';
import githubIcon from '../assets/GitHub-Mark.png';
import linkedinIcon from '../assets/LinkedIn.png';
import mediumIcon from '../assets/Medium.jpg';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [status, setStatus] = useState<'success' | 'error' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    if (status) setStatus('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          'form-name': 'contact',
          name: formData.name,
          email: formData.email,
          message: formData.message,
        }).toString(),
      });

      if (response.ok) {
        setStatus('success');
        setFormData({ name: '', email: '', message: '' });
        setTimeout(() => setStatus(''), 5000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error('Form submission error:', err);
      setStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.section
      id="contact"
      className="contact-section"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
    >
      <motion.h2
        className="contact-heading"
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        Get in Touch
      </motion.h2>

      <motion.div
        className="contact-links"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <a 
          href="https://github.com/1Kelv" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <img src={githubIcon} alt="GitHub" className="contact-icon" /> 
          GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/kelvin-o-72a874226/"
          target="_blank"
          rel="noopener noreferrer"
          className="contact-link"
        >
          <img src={linkedinIcon} alt="LinkedIn" className="contact-icon" /> 
          LinkedIn
        </a>
        <a 
          href="https://medium.com/@1kelv" 
          target="_blank" 
          rel="noopener noreferrer"
          className="contact-link"
        >
          <img src={mediumIcon} alt="Medium" className="contact-icon" /> 
          Medium
        </a>
      </motion.div>

      <motion.form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        className="contact-form"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Hidden field Netlify uses to identify the form */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot field for spam protection */}
        <div style={{ display: 'none' }}>
          <label>
            Don't fill this out if you're human:{' '}
            <input name="bot-field" onChange={() => {}} />
          </label>
        </div>

        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            required
            value={formData.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Your Email"
            required
            value={formData.email}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <textarea
            name="message"
            rows={5}
            placeholder="Your Message"
            required
            value={formData.message}
            onChange={handleChange}
            className="form-textarea"
          />
        </div>

        <button type="submit" disabled={isSubmitting} className="form-button">
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="success-message">
            ✓ Message sent successfully! I'll get back to you soon.
          </p>
        )}
        {status === 'error' && (
          <p className="error-message">
            ✗ Something went wrong. Please try again or reach out via social media.
          </p>
        )}
      </motion.form>
    </motion.section>
  );
};

export default Contact;