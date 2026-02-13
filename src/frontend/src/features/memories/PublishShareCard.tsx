import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Share2, Copy, CheckCircle2, Globe, Lock } from 'lucide-react';
import { useListMemories, useTogglePublishMemory } from '../../hooks/useSharePublishing';
import { toast } from 'sonner';

export function PublishShareCard() {
  const { data: memories = [], isLoading } = useListMemories();
  const togglePublish = useTogglePublishMemory();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const publishedMemories = memories.filter((m) => m.isPublished);
  const hasPublishedMemories = publishedMemories.length > 0;

  const shareUrl = hasPublishedMemories
    ? `${window.location.origin}?share=true`
    : '';

  const handleCopyLink = async () => {
    if (!shareUrl) return;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success('Share link copied to clipboard!');
      setCopiedId('main');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleTogglePublish = async (memoryId: bigint) => {
    try {
      await togglePublish.mutateAsync(memoryId);
      const memory = memories.find((m) => m.id === memoryId);
      if (memory?.isPublished) {
        toast.success('Memory unpublished');
      } else {
        toast.success('Memory published!');
      }
    } catch (error: any) {
      console.error('Failed to toggle publish:', error);
      toast.error(error.message || 'Failed to update memory');
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Memories
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </CardContent>
      </Card>
    );
  }

  if (memories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Share Your Memories
          </CardTitle>
          <CardDescription>
            Upload memories first to share them with others
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Share Your Memories
            </CardTitle>
            <CardDescription>
              Publish memories and share them via a public link
            </CardDescription>
          </div>
          <Badge variant={hasPublishedMemories ? 'default' : 'secondary'}>
            {hasPublishedMemories ? (
              <>
                <Globe className="w-3 h-3 mr-1" />
                Published
              </>
            ) : (
              <>
                <Lock className="w-3 h-3 mr-1" />
                Private
              </>
            )}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {hasPublishedMemories && (
          <div className="space-y-2">
            <label className="text-sm font-medium">Share Link</label>
            <div className="flex gap-2">
              <Input
                value={shareUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                onClick={handleCopyLink}
                variant="outline"
                size="icon"
                disabled={!shareUrl}
              >
                {copiedId === 'main' ? (
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Anyone with this link can view your published memories
            </p>
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">
            Your Memories ({publishedMemories.length} of {memories.length} published)
          </label>
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {memories.map((memory) => (
              <div
                key={memory.id.toString()}
                className="flex items-center justify-between p-3 border rounded-lg"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <img
                    src={memory.photo.getDirectURL()}
                    alt={memory.caption || 'Memory'}
                    className="w-12 h-12 object-cover rounded"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {memory.caption || 'Untitled Memory'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {memory.isPublished ? 'Published' : 'Private'}
                    </p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant={memory.isPublished ? 'outline' : 'default'}
                  onClick={() => handleTogglePublish(memory.id)}
                  disabled={togglePublish.isPending}
                >
                  {memory.isPublished ? (
                    <>
                      <Lock className="w-3 h-3 mr-1" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Globe className="w-3 h-3 mr-1" />
                      Publish
                    </>
                  )}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
