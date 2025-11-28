import { useState, useEffect } from 'react';
import { debounce } from '../utils/helpers';

const useWindowSize = (delay = 250) => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
  });

  useEffect(() => {
    const handleResize = debounce(() => {
      const width = window.innerWidth;
      const height = window.innerHeight;

      setWindowSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
      });
    }, delay);

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [delay]);

  return windowSize;
};

export const useBreakpoint = (breakpoint) => {
  const { width } = useWindowSize();

  const breakpoints = {
    sm: 640,
    md: 768,
    lg: 1024,
    xl: 1280,
    '2xl': 1536,
  };

  return width >= breakpoints[breakpoint];
};

export const useOrientation = () => {
  const [orientation, setOrientation] = useState({
    angle: undefined,
    type: undefined,
  });

  useEffect(() => {
    const handleOrientationChange = () => {
      const angle = window.screen.orientation.angle;
      const type = window.screen.orientation.type;
      setOrientation({ angle, type });
    };

    // Set initial orientation
    handleOrientationChange();

    window.addEventListener('orientationchange', handleOrientationChange);
    return () => window.removeEventListener('orientationchange', handleOrientationChange);
  }, []);

  return orientation;
};

export default useWindowSize; 