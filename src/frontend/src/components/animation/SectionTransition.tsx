import { ReactNode, useEffect, useState } from 'react';

interface SectionTransitionProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

export function SectionTransition({ children, delay = 0, className = '' }: SectionTransitionProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Trigger animation after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => {
      clearTimeout(timer);
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [delay]);

  // If reduced motion is preferred, show immediately without animation
  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      className={`section-transition ${isVisible ? 'section-transition-visible' : ''} ${className}`}
    >
      {children}
    </div>
  );
}
