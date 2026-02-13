import { useEffect, useState } from 'react';

interface Heart {
  id: number;
  left: number;
  delay: number;
  duration: number;
  emoji: string;
}

export function InitialFloatingHearts() {
  const [hearts, setHearts] = useState<Heart[]>([]);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Check for reduced motion preference
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);

    // Generate random hearts
    const heartEmojis = ['❤️', '💕', '💖', '💗', '💝', '💞'];
    const generatedHearts: Heart[] = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 5,
      duration: 8 + Math.random() * 4,
      emoji: heartEmojis[Math.floor(Math.random() * heartEmojis.length)],
    }));

    setHearts(generatedHearts);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  if (prefersReducedMotion) {
    return null;
  }

  return (
    <div className="valentine-floating-hearts">
      {hearts.map((heart) => (
        <div
          key={heart.id}
          className="valentine-heart"
          style={{
            left: `${heart.left}%`,
            animationDelay: `${heart.delay}s`,
            animationDuration: `${heart.duration}s`,
          }}
        >
          {heart.emoji}
        </div>
      ))}
    </div>
  );
}
