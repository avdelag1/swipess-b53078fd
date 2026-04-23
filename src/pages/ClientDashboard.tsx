import { useCallback, useMemo, useState, useEffect, lazy, Suspense } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SwipessSwipeContainer } from '@/components/SwipessSwipeContainer';
import { useFilterStore, useFilterActions } from '@/state/filterStore';
import { SwipeAllDashboard } from '@/components/swipe/SwipeAllDashboard';
import { QuickFilterBar } from '@/components/QuickFilterBar';
import { motion, AnimatePresence } from 'framer-motion';
import type { QuickFilterCategory } from '@/types/filters';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import ClientFilters from './ClientFilters';
import { cn } from '@/lib/utils';
import useAppTheme from '@/hooks/useAppTheme';
import { useSmartListingMatching } from '@/hooks/smartMatching/useSmartListingMatching';
import { useAuth } from '@/hooks/useAuth';
import { AtmosphericLayer } from '@/components/AtmosphericLayer';

interface ClientDashboardProps {
  onMessageClick?: () => void;
}

// Client Dashboard (v1.0.96-rc5) — 2-phase UX flow:
// 1. Poker Cards (Dash Fan)
// 2. Swipe Deck (Container)
export default function ClientDashboard({ onMessageClick }: ClientDashboardProps) {
  const { isLight } = useAppTheme();
  const activeCategory = useFilterStore(s => s.activeCategory);
  const { user } = useAuth();
  const { setActiveCategory } = useFilterActions();

  // Phase state: 'cards' | 'swipe'
  const [phase, setPhase] = useState<'cards' | 'swipe'>(activeCategory ? 'swipe' : 'cards');
  const [showFilters, setShowFilters] = useState(false);

  // 🚀 PERFORMANCE HYDRATION: Pre-fetch listing data while user is on map phase
  // so the swipe deck is ready instantly when they tap "Start Swiping".
  const filterVersion = useFilterStore(s => s.filterVersion);
  const dashboardFilters = useMemo(() => useFilterStore.getState().getListingFilters(), [filterVersion]);
  
  useSmartListingMatching(
    user?.id,
    [],
    dashboardFilters,
    0,
    20, // pageSize
    false // isRefreshMode
  );

  // ─── Actions ─────────────────────────────────────────────────────────────
  
  useEffect(() => {
    const handleOpenFilters = () => setShowFilters(true);
    window.addEventListener('open-client-filters', handleOpenFilters);
    return () => window.removeEventListener('open-client-filters', handleOpenFilters);
  }, []);

  // 🛰️ DISCOVERY SYNC: Bidirectional sync between activeCategory and phase
  useEffect(() => {
    if (!activeCategory && phase === 'swipe') {
      setPhase('cards');
    } else if (activeCategory && phase === 'cards') {
      setPhase('swipe');
    }
  }, [activeCategory, phase]);

  const handleLaunch = useCallback((category: QuickFilterCategory) => {
    setActiveCategory(category);
    // Phase will transition automatically via the useEffect above
  }, [setActiveCategory]);

  const handleListingTap = useCallback(() => {
    // Already in swipe phase if we can tap a listing
  }, []);

  // Determine what to show based on phase + store state. 
  const showCards = phase === 'cards' && !activeCategory;
  const showSwipe = phase === 'swipe' && !!activeCategory;

  return (
    <div className={cn(
      "flex-1 flex flex-col items-center justify-center p-0 overflow-hidden relative",
      isLight ? "bg-white" : "bg-[#020202]"
    )}>
      {/* 🛸 Swipess ATMOSPHERIC LAYER (Unified Discovery Phase) */}
      <AtmosphericLayer variant="rose" />

      <AnimatePresence mode="wait">
        {showCards && (
          <motion.div
            key="dash-fan"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center w-full h-full overflow-hidden z-10"
            style={{ 
              paddingTop: 'calc(var(--top-bar-height) + var(--safe-top) + 20px)',
              paddingBottom: 'calc(var(--bottom-nav-height) + var(--safe-bottom))',
              willChange: 'transform, opacity' 
            }}
          >
            <div className="flex-1 flex items-center justify-center w-full min-h-0">
              <SwipeAllDashboard setCategories={handleLaunch} />
            </div>
          </motion.div>
        )}

        {showSwipe && (
          <motion.div
            key="dash-swipe"
            initial={{ opacity: 0, y: 30, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full flex flex-col z-10"
            style={{ willChange: 'transform, opacity' }}
          >
            <SwipessSwipeContainer
              onListingTap={handleListingTap}
              onInsights={handleListingTap}
              onMessageClick={onMessageClick}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <Sheet open={showFilters} onOpenChange={setShowFilters}>
          <SheetContent side="bottom" className="h-[92vh] p-0 border-none bg-transparent overflow-hidden">
            <div className={cn(
              "w-full h-full transition-all duration-500 rounded-t-[3.5rem] border-t overflow-y-auto shadow-2xl",
              isLight ? "bg-white/95 border-black/5" : "bg-black/95 border-white/10"
            )}>
               <div className="sticky top-0 z-[60] flex items-center justify-center pt-4 pb-2">
                  <div className={cn("w-12 h-1.5 rounded-full", isLight ? "bg-black/10" : "bg-white/20")} />
               </div>
               <div className="px-1 pb-20">
                  <ClientFilters isEmbedded={true} onClose={() => setShowFilters(false)} />
               </div>
            </div>
          </SheetContent>
      </Sheet>
    </div>
  );
}
