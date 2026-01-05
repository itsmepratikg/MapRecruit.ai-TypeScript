import { useState, useEffect } from 'react';

export type ScreenMode = 'MOBILE' | 'TABLET' | 'DESKTOP';

export const useScreenSize = () => {
  const [width, setWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
  const [mode, setMode] = useState<ScreenMode>('DESKTOP');

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      setWidth(w);
      if (w >= 1024) {
        setMode('DESKTOP');
      } else if (w >= 768) {
        setMode('TABLET');
      } else {
        setMode('MOBILE');
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return {
    width,
    mode,
    isMobile: mode === 'MOBILE',
    isTablet: mode === 'TABLET',
    isDesktop: mode === 'DESKTOP',
    isLargeScreen: width >= 1024
  };
};
