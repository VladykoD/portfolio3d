import { useEffect, useState } from 'react';

export const useCalc = () => {
  const [dimensions, setDimensions] = useState({ vw: 1920, vh: 1080 });

  useEffect(() => {
    const doc = document.documentElement;

    const handler = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      setDimensions({ vw, vh });

      setTimeout(() => {
        doc.style.setProperty('--vh', `${vh}px`);
        doc.style.setProperty('--vw', `${vw}px`);
      }, 50);
    };

    handler();
    window.addEventListener('resize', handler);

    return () => {
      window.removeEventListener('resize', handler);
    };
  }, []);

  return dimensions;
};
