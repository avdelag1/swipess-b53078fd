import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { logger } from '@/utils/prodLogger';

export function useBlockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blockedId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be logged in to block');

      const { error } = await supabase
        .from('user_blocks' as any)
        .insert({
          blocker_id: user.id,
          blocked_id: blockedId,
        });

      if (error) {
        if (error.code === '23505') {
            return { alreadyBlocked: true };
        }
        throw error;
      }
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['user_blocks'] });
      toast.success('User blocked', {
        description: 'You will no longer see messages or listings from this entity.',
      });
    },
    onError: (error: Error) => {
      logger.error('Error blocking user:', error);
      toast.error('Failed to block user', {
        description: error.message || 'Please try again later',
      });
    },
  });
}

export function useUnblockUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (blockedId: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User must be logged in to unblock');

      const { error } = await supabase
        .from('user_blocks' as any)
        .delete()
        .eq('blocker_id', user.id)
        .eq('blocked_id', blockedId);

      if (error) throw error;
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] });
      queryClient.invalidateQueries({ queryKey: ['user_blocks'] });
      toast.success('User unblocked');
    },
  });
}
