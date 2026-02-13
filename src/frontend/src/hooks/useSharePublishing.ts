import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

export function useListMemories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['memories'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listMemories();
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return [];
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useTogglePublishMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (memoryId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.togglePublishMemory(memoryId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['memories'] });
      queryClient.invalidateQueries({ queryKey: ['userPhotoMemories'] });
      queryClient.invalidateQueries({ queryKey: ['publishedMemories'] });
    },
  });
}
