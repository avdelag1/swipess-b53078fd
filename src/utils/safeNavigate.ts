import { NavigateFunction } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { appToast } from '@/utils/appNotification';
import { logger } from '@/utils/prodLogger';

interface SafeNavigateOptions {
  requiresAuth?: boolean;
  replace?: boolean;
  state?: any;
}

/**
 * SAFE NAVIGATION UTILITY
 *
 * Creates a navigation function that performs safety checks before navigating.
 *
 * PURPOSE:
 * - Prevents silent navigation failures when user is logged out
 * - Provides visible error messages when navigation fails
 * - Ensures consistent auth checking across all navigation
 */
export function createSafeNavigate(
  navigate: NavigateFunction,
  user: User | null
) {
  return (path: string, options?: SafeNavigateOptions): boolean => {
    const { requiresAuth = true, replace = false, state } = options || {};

    // Auth check
    if (requiresAuth && !user) {
      appToast.error('Authentication Required', 'Please log in to continue.');
      navigate('/', { replace: true });
      return false;
    }

    // Perform navigation
    try {
      navigate(path, { replace, state });
      return true;
    } catch (error) {
      logger.error('[SafeNavigate] Navigation error:', error);
      appToast.error('Navigation Failed', 'Unable to navigate. Please try again.');
      return false;
    }
  };
}



