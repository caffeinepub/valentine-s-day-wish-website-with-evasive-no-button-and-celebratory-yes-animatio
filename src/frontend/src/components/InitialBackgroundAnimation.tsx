import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  left: number;
  delay: number;
  duration: number;
  size: number;
  hue: number;
}

export function InitialBackgroundAnimation() {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    // Generate 20 particles with random properties
    const generatedParticles: Particle[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100, // Random horizontal position (0-100%)
      delay: Math.random() * 6, // Random delay (0-6s)
      duration: 8 + Math.random() * 6, // Random duration (8-14s)
      size: 20 + Math.random() * 60, // Random size (20-80px)
      hue: 345 + Math.random() * 30, // Random hue in pink/red range (345-375)
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="initial-background-animation">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="floating-particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `radial-gradient(circle, oklch(0.85 0.15 ${particle.hue} / 0.3) 0%, oklch(0.75 0.20 ${particle.hue} / 0.1) 50%, transparent 100%)`,
          }}
        />
      ))}
    </div>
  );
}
