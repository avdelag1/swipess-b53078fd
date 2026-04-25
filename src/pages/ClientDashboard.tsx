import { useCallback, useMemo } from 'react';
import { useShallow } from 'zustand/react/shallow';
import { SwipessSwipeContainer } from '@/components/SwipessSwipeContainer';
import { useFilterStore, useFilterActions } from '@/state/filterStore';
import { QuickFilterBar } from '@/components/QuickFilterBar';
import type { QuickFilterCategory } from '@/types/filters';
import { cn } from '@/lib/utils';
import useAppTheme from '@/hooks/useAppTheme';
import { useSmartListingMatching } from '@/hooks/smartMatching/useSmartListingMatching';
import { useAuth } from '@/hooks/useAuth';

interface ClientDashboardProps {
  onMessageClick?: () => void;
}

export default function ClientDashboard({ onMessageClick }: ClientDashboardProps) {
  const { isLight } = useAppTheme();
  const { user } = useAuth();
  const { setActiveCategory, setCategories } = useFilterActions();

  // Stable filter version trigger (primitive number, no reference instability)
  const filterVersion = useFilterStore(s => s.filterVersion);

  // Computed filters - re-derived only when filterVersion changes (prevents infinite re-renders)
  const filters = useMemo(
    () => useFilterStore.getState().getListingFilters(),
    [filterVersion]
  );

  // QuickFilters with shallow comparison so the object reference stays stable
  const quickFilters = useFilterStore(
    useShallow(s => ({
      categories: s.categories,
      listingType: s.listingType,
    }))
  );

  // Pre-fetch listing data so the swipe deck is ready instantly
  useSmartListingMatching(user?.id, [], filters, 0, 20, false);

  const handleCategorySelect = useCallback((category: QuickFilterCategory) => {
    setActiveCategory(category);
  }, [setActiveCategory]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setCategories(newFilters.categories || []);
  }, [setCategories]);

  return (
    <div
      className={cn(
        "flex-1 flex flex-col overflow-hidden relative w-full h-full",
        isLight ? "bg-white" : "bg-[#020202]"
      )}
      style={{
        paddingTop: 'calc(var(--top-bar-height, 60px) + var(--safe-top, 0px))',
        paddingBottom: 'calc(var(--bottom-nav-height, 72px) + var(--safe-bottom, 0px))',
      }}
    >
      {/* Quick Filter Bar */}
      <QuickFilterBar
        filters={quickFilters}
        onChange={handleFilterChange}
        onSelect={handleCategorySelect}
        userRole="client"
      />

      {/* Swipe Deck */}
      <div className="flex-1 relative overflow-hidden w-full">
        <SwipessSwipeContainer
          onListingTap={() => {}}
          onInsights={() => {}}
          onMessageClick={onMessageClick}
        />
      </div>
    </div>
  );
}
