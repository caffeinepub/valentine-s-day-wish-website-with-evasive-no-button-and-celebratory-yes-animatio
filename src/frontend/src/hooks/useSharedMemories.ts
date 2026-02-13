import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MemoryPublic } from '../backend';

export function useListPublishedMemories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MemoryPublic[]>({
    queryKey: ['publishedMemories'],
    queryFn: async () => {
      if (!actor) return [];
      return await actor.listPublishedMemories();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetPublishedMemory(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MemoryPublic | null>({
    queryKey: ['publishedMemory', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getPublishedMemory(id);
      } catch (error: any) {
        console.error('Error fetching published memory:', error);
        return null;
      }
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}
