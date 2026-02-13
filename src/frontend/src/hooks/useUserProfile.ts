import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, PersonalizedValentineGreeting } from '../backend';

export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      return actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
    },
  });
}

export function useGetPersonalizedGreeting() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<PersonalizedValentineGreeting | null>({
    queryKey: ['personalizedGreeting'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getPersonalizedGreeting();
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useSetPersonalizedGreeting() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ recipient, message }: { recipient: string; message: string }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.setPersonalizedGreeting(recipient, message);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalizedGreeting'] });
    },
  });
}

export function useAcceptValentine() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.acceptValentine();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['personalizedGreeting'] });
    },
  });
}
