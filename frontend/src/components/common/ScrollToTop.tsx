import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';

export const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // Do not render floating scroll button on checkout pages to avoid overlapping payment cards
  if (!isVisible || pathname.startsWith('/checkout')) return null;

  return (
    <button
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-30 p-3 rounded-2xl bg-brand-500 text-black shadow-neon hover:scale-110 active:scale-95 transition-all duration-200"
      aria-label="Scroll to top"
    >
      <ArrowUp className="w-5 h-5 font-bold" />
    </button>
  );
};
