import { Heart, AlertCircle } from 'lucide-react';
import { useListPublishedMemories } from '../../hooks/useSharedMemories';
import { SharedMemoriesGallery } from './SharedMemoriesGallery';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export function SharedMemoriesPage() {
  const { data: memories = [], isLoading, isError } = useListPublishedMemories();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-valentine-accent/10 mb-4">
              <Heart className="w-8 h-8 text-valentine-accent" />
            </div>
            <h1 className="text-4xl font-serif font-bold mb-2">
              Shared Memories
            </h1>
            <p className="text-muted-foreground">
              A collection of special moments shared with you
            </p>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="w-full aspect-[4/3] rounded-lg" />
                    <Skeleton className="h-4 w-3/4 mx-auto" />
                  </div>
                ))}
              </div>
            </div>
          ) : isError ? (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Failed to load shared memories. Please try again later.
              </AlertDescription>
            </Alert>
          ) : memories.length === 0 ? (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-muted mb-6">
                <Heart className="w-10 h-10 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                This shared page is unavailable
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                The memories you're looking for haven't been published yet or are no longer available.
              </p>
            </div>
          ) : (
            <SharedMemoriesGallery memories={memories} />
          )}
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t text-center text-sm text-muted-foreground">
          <p>
            Built with <Heart className="inline w-4 h-4 text-valentine-accent" /> using{' '}
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(
                typeof window !== 'undefined' ? window.location.hostname : 'valentine-app'
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline"
            >
              caffeine.ai
            </a>
          </p>
          <p className="mt-2">© {new Date().getFullYear()}</p>
        </footer>
      </div>
    </div>
  );
}
