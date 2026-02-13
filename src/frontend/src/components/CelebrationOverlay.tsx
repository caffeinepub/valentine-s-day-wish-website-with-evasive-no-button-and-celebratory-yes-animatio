import { useEffect, useState } from 'react';
import { X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { valentineConfig } from '@/config/valentineConfig';

interface CelebrationOverlayProps {
  onClose: () => void;
  autoCloseDelay?: number;
}

export function CelebrationOverlay({ onClose, autoCloseDelay = 8000 }: CelebrationOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      handleClose();
    }, autoCloseDelay);

    return () => clearTimeout(timer);
  }, [autoCloseDelay]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  return (
    <div 
      className={`celebration-overlay ${isVisible ? 'celebration-overlay-visible' : ''} ${prefersReducedMotion ? 'celebration-reduced-motion' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="celebration-title"
    >
      <div className="celebration-backdrop" onClick={handleClose} />
      
      <div className="celebration-sparkles-bg">
        <img 
          src={valentineConfig.assets.bokehSparklesOverlay} 
          alt="" 
          className="celebration-sparkles-image"
        />
      </div>

      <div className="celebration-confetti-container">
        {!prefersReducedMotion && Array.from({ length: 50 }).map((_, i) => (
          <div
            key={i}
            className="celebration-confetti"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 0.5}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
              backgroundColor: [
                'oklch(0.65 0.20 350)',
                'oklch(0.70 0.18 10)',
                'oklch(0.75 0.15 350)',
                'oklch(0.60 0.25 0)',
                'oklch(0.80 0.12 340)',
              ][Math.floor(Math.random() * 5)],
            }}
          />
        ))}
      </div>

      <div className="celebration-content">
        <Button
          variant="ghost"
          size="icon"
          className="celebration-close-button"
          onClick={handleClose}
          aria-label="Close celebration"
        >
          <X className="w-6 h-6" />
        </Button>

        <div className="celebration-message">
          <Sparkles className="celebration-sparkle-icon" />
          <h2 id="celebration-title" className="celebration-title">
            {valentineConfig.wish.acceptanceMessage}
          </h2>
          <p className="celebration-subtitle">
            {valentineConfig.wish.acceptanceSubtext}
          </p>
        </div>

        <div className="celebration-hearts-float">
          {!prefersReducedMotion && Array.from({ length: 15 }).map((_, i) => (
            <span
              key={i}
              className="celebration-heart"
              style={{
                left: `${10 + Math.random() * 80}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${3 + Math.random() * 2}s`,
                fontSize: `${1 + Math.random() * 1.5}rem`,
              }}
            >
              {['💕', '💖', '💗', '💝', '💞', '❤️', '💓'][Math.floor(Math.random() * 7)]}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
