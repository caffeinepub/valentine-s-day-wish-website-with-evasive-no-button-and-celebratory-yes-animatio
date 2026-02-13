import { useState } from 'react';
import type { MemoryPublic } from '../../backend';
import { formatTime } from '../../lib/time';
import { SharedMemoryDetailDialog } from './SharedMemoryDetailDialog';

interface SharedMemoriesGalleryProps {
  memories: MemoryPublic[];
}

export function SharedMemoriesGallery({ memories }: SharedMemoriesGalleryProps) {
  const [selectedMemoryId, setSelectedMemoryId] = useState<bigint | null>(null);

  if (memories.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No published memories yet</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {memories.map((memory) => (
          <div
            key={memory.id.toString()}
            className="valentine-photo-card cursor-pointer hover:scale-105 transition-transform"
            onClick={() => setSelectedMemoryId(memory.id)}
          >
            <div className="valentine-photo-frame">
              <img
                src={memory.photo.getDirectURL()}
                alt={memory.caption || 'Memory'}
                className="valentine-photo-image"
                loading="lazy"
              />
            </div>
            {memory.caption && (
              <p className="valentine-photo-caption">{memory.caption}</p>
            )}
            {memory.dateTaken && (
              <p className="text-xs text-muted-foreground text-center mt-1">
                {formatTime(memory.dateTaken)}
              </p>
            )}
          </div>
        ))}
      </div>

      <SharedMemoryDetailDialog
        memoryId={selectedMemoryId}
        open={selectedMemoryId !== null}
        onOpenChange={(open) => !open && setSelectedMemoryId(null)}
      />
    </>
  );
}
