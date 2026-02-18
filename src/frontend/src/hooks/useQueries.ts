import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Currency } from '../backend';

export function useInitiateDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ currency, amount }: { currency: Currency; amount: bigint }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.initiateDeposit(currency, amount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
    },
  });
}

export function useConfirmDeposit() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (transactionId: bigint) => {
      if (!actor) throw new Error('Actor not available');
      return actor.confirmDeposit(transactionId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deposits'] });
    },
  });
}

// Admin Fund Release Hooks
export function useGetPendingWinners() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['pendingWinners'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Mock data - in real implementation, backend would provide this
      return [
        {
          user: 'user1-principal-id',
          username: 'john_doe',
          amount: BigInt(15000),
          winDate: '2026-02-17',
          isPaid: false,
        },
        {
          user: 'user2-principal-id',
          username: 'jane_smith',
          amount: BigInt(8500),
          winDate: '2026-02-16',
          isPaid: false,
        },
        {
          user: 'user3-principal-id',
          username: 'mike_wilson',
          amount: BigInt(22000),
          winDate: '2026-02-15',
          isPaid: false,
        },
      ];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useReleaseWinningsToUser() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userPrincipal: string) => {
      if (!actor) throw new Error('Actor not available');
      
      // Mock implementation - backend would handle actual fund release
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pendingWinners'] });
      queryClient.invalidateQueries({ queryKey: ['releaseHistory'] });
    },
  });
}

export function useGetReleaseHistory() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery({
    queryKey: ['releaseHistory'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      
      // Mock data - backend would provide actual release history
      return [
        {
          id: '1',
          user: 'user4-principal-id',
          username: 'sarah_jones',
          amount: BigInt(12000),
          releaseDate: '2026-02-18 10:30',
          status: 'Released',
        },
        {
          id: '2',
          user: 'user5-principal-id',
          username: 'tom_brown',
          amount: BigInt(9500),
          releaseDate: '2026-02-17 14:15',
          status: 'Released',
        },
      ];
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useIsCallerAdmin() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<boolean>({
    queryKey: ['isCallerAdmin'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.isCallerAdmin();
    },
    enabled: !!actor && !actorFetching,
  });
}
