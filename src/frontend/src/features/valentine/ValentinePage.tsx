import { useState, useRef } from 'react';
import { Heart, Sparkles, Infinity } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { InitialFloatingHearts } from '@/components/InitialFloatingHearts';
import { InitialBackgroundAnimation } from '@/components/InitialBackgroundAnimation';
import { SectionTransition } from '@/components/animation/SectionTransition';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { useEvasiveButton } from '@/hooks/useEvasiveButton';
import { valentineConfig } from '@/config/valentineConfig';

const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  infinity: Infinity,
};

export function ValentinePage() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  const { position, hasEscaped, prefersReducedMotion, handlers } = useEvasiveButton({
    containerRef,
    yesButtonRef,
    enabled: !hasAccepted,
  });

  const handleYesClick = () => {
    setHasAccepted(true);
    setShowCelebration(true);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
  };

  return (
    <div className="valentine-page-container">
      <InitialBackgroundAnimation />
      <InitialFloatingHearts />
      
      {showCelebration && <CelebrationOverlay onClose={handleCloseCelebration} />}

      <div className="valentine-content-wrapper">
        <SectionTransition delay={200}>
          <div className="valentine-hero">
            <div className="valentine-hero-content">
              <div className="valentine-cupid-icon">
                <img 
                  src={valentineConfig.assets.cupidIcon} 
                  alt="Cupid" 
                  className="valentine-cupid-img"
                />
              </div>
              
              {!hasAccepted ? (
                <>
                  <h1 className="valentine-title valentine-wish-title">
                    {valentineConfig.wish.question}
                  </h1>
                  
                  <p className="valentine-subtitle">
                    {valentineConfig.wish.helperText}
                  </p>
                  
                  <div className="valentine-wish-actions" ref={containerRef}>
                    <Button 
                      ref={yesButtonRef}
                      size="lg" 
                      className="valentine-yes-button"
                      onClick={handleYesClick}
                    >
                      {valentineConfig.wish.yesLabel}
                    </Button>
                    
                    <Button
                      size="lg"
                      variant="outline"
                      className="valentine-no-button"
                      style={
                        hasEscaped && !prefersReducedMotion
                          ? {
                              position: 'absolute',
                              left: `${position.x}px`,
                              top: `${position.y}px`,
                              transition: 'all 0.3s ease',
                            }
                          : undefined
                      }
                      {...handlers}
                    >
                      {valentineConfig.wish.noLabel}
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="valentine-title">
                    {valentineConfig.hero.title}
                  </h1>
                  
                  <p className="valentine-subtitle valentine-acceptance-message">
                    {valentineConfig.wish.acceptanceMessage}
                  </p>
                  
                  <p className="valentine-description">
                    {valentineConfig.wish.acceptanceSubtext}
                  </p>
                </>
              )}
            </div>
          </div>
        </SectionTransition>

        {hasAccepted && (
          <>
            <SectionTransition delay={400} className="valentine-photos-section">
              <h2 className="valentine-photos-title">Our Special Moments</h2>
              <div className="valentine-photos-grid">
                {valentineConfig.photos.map((photo, index) => (
                  <div key={index} className="valentine-photo-card">
                    <div className="valentine-photo-frame">
                      <img 
                        src={photo.src} 
                        alt={photo.alt}
                        className="valentine-photo-image"
                        loading="lazy"
                      />
                    </div>
                    <p className="valentine-photo-caption">{photo.caption}</p>
                  </div>
                ))}
              </div>
            </SectionTransition>

            <SectionTransition delay={600} className="valentine-features-section">
              <div className="valentine-features-grid">
                {valentineConfig.features.map((feature, index) => {
                  const Icon = iconMap[feature.icon as keyof typeof iconMap];
                  return (
                    <Card key={index} className="valentine-feature-card">
                      <CardHeader>
                        <div className="valentine-feature-icon">
                          <Icon className="w-8 h-8" />
                        </div>
                        <CardTitle className="valentine-feature-title">
                          {feature.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="valentine-feature-description">
                          {feature.description}
                        </CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </SectionTransition>
          </>
        )}

        <div className="valentine-decorative-hearts">
          <img 
            src={valentineConfig.assets.heartStickers} 
            alt="Decorative hearts" 
            className="valentine-hearts-img"
          />
        </div>
      </div>

      <footer className="valentine-footer">
        <p className="valentine-footer-message">
          {valentineConfig.footer.message}
        </p>
        <p>
          Built with <Heart className="inline w-4 h-4 text-valentine-accent" /> using{' '}
          <a
            href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
              typeof window !== 'undefined' ? window.location.hostname : 'valentine-app'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="valentine-footer-link"
          >
            caffeine.ai
          </a>
        </p>
        <p className="valentine-footer-year">© {valentineConfig.footer.year}</p>
      </footer>
    </div>
  );
}
