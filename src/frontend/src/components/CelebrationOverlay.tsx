import { useEffect, useState } from 'react';

export function CelebrationOverlay() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after mount
    const timer = setTimeout(() => setIsVisible(true), 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="celebration-overlay">
      {/* Fireworks burst */}
      <div className={`fireworks ${isVisible ? 'animate' : ''}`}>
        <img
          src="/assets/generated/fireworks-burst.dim_1024x1024.png"
          alt=""
          className="fireworks-image"
        />
      </div>

      {/* Sparkles overlay */}
      <div className={`sparkles ${isVisible ? 'animate' : ''}`}>
        <img
          src="/assets/generated/sparkles-overlay.dim_1024x1024.png"
          alt=""
          className="sparkles-image"
        />
      </div>

      {/* Additional animated hearts */}
      <div className="floating-hearts">
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="heart"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${3 + Math.random() * 2}s`
            }}
          >
            ❤️
          </div>
        ))}
      </div>
    </div>
  );
}
