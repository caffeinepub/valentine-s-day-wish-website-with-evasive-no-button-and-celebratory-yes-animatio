import { useState, useRef } from 'react';
import { Heart, Sparkles, Infinity, Edit2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { InitialFloatingHearts } from '@/components/InitialFloatingHearts';
import { InitialBackgroundAnimation } from '@/components/InitialBackgroundAnimation';
import { SectionTransition } from '@/components/animation/SectionTransition';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { AccessRequiredCard } from '@/components/feedback/AccessRequiredCard';
import { MemoryUploadCard } from '../memories/MemoryUploadCard';
import { MemoriesGallery } from '../memories/MemoriesGallery';
import { PublishShareCard } from '../memories/PublishShareCard';
import { useEvasiveButton } from '@/hooks/useEvasiveButton';
import { useInternetIdentity } from '@/hooks/useInternetIdentity';
import { useGetPersonalizedGreeting, useSetPersonalizedGreeting } from '@/hooks/useUserProfile';
import { useListUserPhotoMemories } from '@/hooks/useMemories';
import { valentineConfig } from '@/config/valentineConfig';
import { toast } from 'sonner';

const iconMap = {
  heart: Heart,
  sparkles: Sparkles,
  infinity: Infinity,
};

export function ValentinePage() {
  const [hasAccepted, setHasAccepted] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [isEditingGreeting, setIsEditingGreeting] = useState(false);
  const [editRecipient, setEditRecipient] = useState('');
  const [editMessage, setEditMessage] = useState('');
  
  const containerRef = useRef<HTMLDivElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);

  const { identity } = useInternetIdentity();
  const { data: greeting, isLoading: greetingLoading } = useGetPersonalizedGreeting();
  const setGreeting = useSetPersonalizedGreeting();
  const { data: memories = [], isLoading: memoriesLoading } = useListUserPhotoMemories();

  const isAuthenticated = !!identity;

  const { position, hasEscaped, prefersReducedMotion, handlers } = useEvasiveButton({
    containerRef,
    yesButtonRef,
    enabled: !hasAccepted,
  });

  const displayGreeting = greeting || {
    recipient: 'Puks',
    message: "Happy Valentine's Day, Puks",
  };

  const handleYesClick = () => {
    setHasAccepted(true);
    setShowCelebration(true);
  };

  const handleCloseCelebration = () => {
    setShowCelebration(false);
  };

  const handleEditGreeting = () => {
    setEditRecipient(displayGreeting.recipient);
    setEditMessage(displayGreeting.message);
    setIsEditingGreeting(true);
  };

  const handleSaveGreeting = async () => {
    if (!editRecipient.trim() || !editMessage.trim()) {
      toast.error('Please fill in both fields');
      return;
    }

    try {
      await setGreeting.mutateAsync({
        recipient: editRecipient.trim(),
        message: editMessage.trim(),
      });
      setIsEditingGreeting(false);
      toast.success('Greeting updated!');
    } catch (error: any) {
      console.error('Failed to save greeting:', error);
      toast.error(error.message || 'Failed to save greeting');
    }
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
                    {displayGreeting.message}
                  </h1>
                  
                  <p className="valentine-subtitle valentine-acceptance-message">
                    {valentineConfig.wish.acceptanceMessage}
                  </p>
                  
                  <p className="valentine-description">
                    {valentineConfig.wish.acceptanceSubtext}
                  </p>

                  {/* Personalization Section */}
                  <SectionTransition delay={300} className="mt-8 w-full max-w-2xl">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-valentine-accent" />
                            Personalize Your Message
                          </CardTitle>
                          {!isEditingGreeting && isAuthenticated && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleEditGreeting}
                            >
                              <Edit2 className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        <CardDescription>
                          Customize the Valentine's message for your special someone
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        {!isAuthenticated ? (
                          <AccessRequiredCard
                            title="Sign In to Personalize"
                            description="Sign in to save your personalized Valentine's message."
                          />
                        ) : isEditingGreeting ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="recipient">Recipient Name</Label>
                              <Input
                                id="recipient"
                                value={editRecipient}
                                onChange={(e) => setEditRecipient(e.target.value)}
                                placeholder="e.g., Puks"
                                disabled={setGreeting.isPending}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="message">Message</Label>
                              <Input
                                id="message"
                                value={editMessage}
                                onChange={(e) => setEditMessage(e.target.value)}
                                placeholder="e.g., Happy Valentine's Day, Puks"
                                disabled={setGreeting.isPending}
                              />
                            </div>
                            <div className="flex gap-2">
                              <Button
                                onClick={handleSaveGreeting}
                                disabled={setGreeting.isPending}
                                className="flex-1"
                              >
                                {setGreeting.isPending ? 'Saving...' : 'Save'}
                              </Button>
                              <Button
                                variant="outline"
                                onClick={() => setIsEditingGreeting(false)}
                                disabled={setGreeting.isPending}
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-2">
                            <div className="p-4 bg-muted rounded-lg">
                              <p className="text-sm text-muted-foreground">To:</p>
                              <p className="font-semibold text-lg">{displayGreeting.recipient}</p>
                              <p className="text-sm text-muted-foreground mt-2">Message:</p>
                              <p className="font-medium">{displayGreeting.message}</p>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </SectionTransition>
                </>
              )}
            </div>
          </div>
        </SectionTransition>

        {hasAccepted && (
          <>
            <SectionTransition delay={400} className="valentine-photos-section">
              <h2 className="valentine-photos-title">Our Special Moments</h2>
              
              {/* Upload Section */}
              {isAuthenticated && (
                <div className="mb-8 max-w-2xl mx-auto">
                  <MemoryUploadCard />
                </div>
              )}

              {/* Publish/Share Controls */}
              {isAuthenticated && memories.length > 0 && (
                <div className="mb-8 max-w-2xl mx-auto">
                  <PublishShareCard />
                </div>
              )}

              {/* User's Uploaded Memories */}
              {isAuthenticated && memories.length > 0 && (
                <div className="mb-12">
                  <h3 className="text-2xl font-serif font-semibold text-center mb-6">
                    Your Uploaded Memories
                  </h3>
                  <MemoriesGallery memories={memories} />
                </div>
              )}

              {/* Static Photos */}
              <div>
                <h3 className="text-2xl font-serif font-semibold text-center mb-6">
                  Featured Moments
                </h3>
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
              </div>

              {!isAuthenticated && (
                <div className="mt-8 max-w-2xl mx-auto">
                  <AccessRequiredCard
                    title="Sign In to Upload Memories"
                    description="Sign in to upload and view your private photo memories."
                  />
                </div>
              )}
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
