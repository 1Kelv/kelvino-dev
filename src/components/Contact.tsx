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
    if (status) setStatus(''); // clear old status when user edits
  };

  const encode = (data: Record<string, string>) =>
    Object.keys(data)
      .map(
        key =>
          encodeURIComponent(key) + '=' + encodeURIComponent(data[key] ?? '')
      )
      .join('&');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus('');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          ...formData,
        }),
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Netlify form submission error:', err);
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
        initial={{ opacity: 0, y: -10 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
      >
        Get in Touch
      </motion.h2>

      <motion.div
        className="contact-links"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
      >
        <a href="https://github.com/1Kelv" target="_blank" rel="noopener noreferrer">
          <img src={githubIcon} alt="GitHub" /> GitHub
        </a>
        <a
          href="https://www.linkedin.com/in/kelvin-o-72a874226/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={linkedinIcon} alt="LinkedIn" /> LinkedIn
        </a>
        <a href="https://medium.com/@1kelv" target="_blank" rel="noopener noreferrer">
          <img src={mediumIcon} alt="Medium" /> Medium
        </a>
      </motion.div>

      {/* Netlify form */}
      <motion.form
        name="contact"
        method="POST"
        data-netlify="true"
        data-netlify-honeypot="bot-field"
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        {/* Hidden field Netlify uses to identify the form */}
        <input type="hidden" name="form-name" value="contact" />

        {/* Honeypot field for spam protection */}
        <div style={{ display: 'none' }}>
          <label>
            Don’t fill this out if you’re human:{' '}
            <input name="bot-field" onChange={() => {}} />
          </label>
        </div>

        <input
          type="text"
          name="name"
          placeholder="Your Name"
          required
          value={formData.name}
          onChange={handleChange}
        />
        <input
          type="email"
          name="email"
          placeholder="Your Email"
          required
          value={formData.email}
          onChange={handleChange}
        />
        <textarea
          name="message"
          rows={5}
          placeholder="Your Message (or CV request)"
          required
          value={formData.message}
          onChange={handleChange}
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Sending…' : 'Send Message'}
        </button>

        {status === 'success' && (
          <p className="success-message">Message sent. Thank you!</p>
        )}
        {status === 'error' && (
          <p className="error-message">
            Something went wrong while sending your message. Please try again.
          </p>
        )}
      </motion.form>
    </motion.section>
  );
};

export default Contact;