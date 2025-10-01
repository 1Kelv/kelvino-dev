import React, { useEffect, useState } from 'react';
import './BackToTop.css';

const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 250); // show a bit earlier
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <button
      className={`back-to-top ${visible ? 'show' : ''}`}
      onClick={scrollTop}
      aria-label="Back to top"
      title="Back to top"
      type="button"
    >
      ↑
    </button>
  );
};

export default BackToTop;
