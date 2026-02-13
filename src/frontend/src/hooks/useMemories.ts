import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { MemoryMetadata, Memory } from '../backend';
import { ExternalBlob } from '../backend';

export function useListUserPhotoMemories() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<MemoryMetadata[]>({
    queryKey: ['userPhotoMemories'],
    queryFn: async () => {
      if (!actor) return [];
      try {
        return await actor.listUserPhotoMemories();
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

export function useAddMemory() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      caption,
      dateTaken,
      photo,
    }: {
      caption: string | null;
      dateTaken: bigint | null;
      photo: ExternalBlob;
    }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addMemory(caption, dateTaken, photo);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userPhotoMemories'] });
      queryClient.invalidateQueries({ queryKey: ['memories'] });
    },
  });
}

export function useGetMemory(id: bigint | null) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Memory | null>({
    queryKey: ['memory', id?.toString()],
    queryFn: async () => {
      if (!actor || id === null) return null;
      try {
        return await actor.getMemory(id);
      } catch (error: any) {
        if (error.message?.includes('Unauthorized')) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!actor && !actorFetching && id !== null,
  });
}
