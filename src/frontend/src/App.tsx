import { useRef, useState } from 'react';
import { valentineConfig } from './config/valentineConfig';
import { useEvasiveButton } from './hooks/useEvasiveButton';
import { CelebrationOverlay } from './components/CelebrationOverlay';
import { Heart } from 'lucide-react';

export default function App() {
  const [celebrated, setCelebrated] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const { position, moveButton } = useEvasiveButton(containerRef, noButtonRef);

  const handleYesClick = () => {
    setCelebrated(true);
  };

  const handleNoHover = () => {
    moveButton();
  };

  const handleNoTouch = (e: React.TouchEvent) => {
    e.preventDefault();
    moveButton();
  };

  if (celebrated) {
    return (
      <div className="app-container celebrated">
        <CelebrationOverlay />
        <div className="celebration-content">
          <div className="celebration-message">
            <h1 className="celebration-title">{valentineConfig.celebrationMessage}</h1>
            <p className="celebration-subtext">{valentineConfig.celebrationSubtext}</p>
            <div className="heart-icon-large">
              <Heart className="w-24 h-24" fill="currentColor" />
            </div>
          </div>
        </div>
        <footer className="app-footer">
          <p>
            Built with <Heart className="inline w-4 h-4 mx-1" fill="currentColor" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'valentine-wish'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              caffeine.ai
            </a>
          </p>
          <p className="footer-year">© {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="background-image" />
      
      <main className="main-content" ref={containerRef}>
        <div className="prompt-card">
          <h1 className="prompt-title">{valentineConfig.question}</h1>
          
          <div className="buttons-container">
            <button
              onClick={handleYesClick}
              className="yes-button"
              aria-label={valentineConfig.yesButtonText}
            >
              {valentineConfig.yesButtonText}
            </button>

            <button
              ref={noButtonRef}
              onMouseEnter={handleNoHover}
              onTouchStart={handleNoTouch}
              className="no-button"
              style={{
                transform: `translate(${position.x}px, ${position.y}px)`
              }}
              aria-label={valentineConfig.noButtonText}
            >
              {valentineConfig.noButtonText}
            </button>
          </div>
        </div>
      </main>

      <footer className="app-footer">
        <p>
          Built with <Heart className="inline w-4 h-4 mx-1" fill="currentColor" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'valentine-wish'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-link"
          >
            caffeine.ai
          </a>
        </p>
        <p className="footer-year">© {new Date().getFullYear()}</p>
      </footer>
    </div>
  );
}
