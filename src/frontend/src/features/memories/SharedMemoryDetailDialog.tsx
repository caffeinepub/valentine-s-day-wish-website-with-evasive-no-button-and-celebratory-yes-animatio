import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useGetPublishedMemory } from '../../hooks/useSharedMemories';
import { formatTime } from '../../lib/time';
import { Loader2, Calendar, Clock } from 'lucide-react';

interface SharedMemoryDetailDialogProps {
  memoryId: bigint | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SharedMemoryDetailDialog({
  memoryId,
  open,
  onOpenChange,
}: SharedMemoryDetailDialogProps) {
  const { data: memory, isLoading } = useGetPublishedMemory(memoryId);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        ) : memory ? (
          <>
            <DialogHeader>
              <DialogTitle>{memory.caption || 'Memory'}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <img
                src={memory.photo.getDirectURL()}
                alt={memory.caption || 'Memory'}
                className="w-full rounded-lg"
              />
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {memory.dateTaken && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    <span>{formatTime(memory.dateTaken)}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>Uploaded {formatTime(memory.timestamp)}</span>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Memory not found</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
