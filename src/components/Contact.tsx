import { motion } from 'framer-motion';
import React, { useState } from 'react';
import './Contact.css';
import githubIcon from '../assets/GitHub-Mark.png';
import linkedinIcon from '../assets/LinkedIn.png';
import mediumIcon from '../assets/Medium.jpg';

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'success' | 'error' | ''>('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate message sending
    setTimeout(() => {
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    }, 1000);
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
        <a href="https://www.linkedin.com/in/kelvin-o-72a874226/" target="_blank" rel="noopener noreferrer">
          <img src={linkedinIcon} alt="LinkedIn" /> LinkedIn
        </a>
        <a href="https://medium.com/@1kelv" target="_blank" rel="noopener noreferrer">
          <img src={mediumIcon} alt="Medium" /> Medium
        </a>
      </motion.div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
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
          placeholder="Your Message"
          required
          value={formData.message}
          onChange={handleChange}
        />
        <button type="submit">Send Message</button>
        {status === 'success' && <p className="success-message">Message sent. Thank you!</p>}
        {status === 'error' && <p className="error-message">Something went wrong. Try again.</p>}
      </motion.form>
    </motion.section>
  );
};

export default Contact;
