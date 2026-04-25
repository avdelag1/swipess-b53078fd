import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useFilterStore, useFilterActions } from '@/state/filterStore';
import { triggerHaptic } from '@/utils/haptics';
import useAppTheme from '@/hooks/useAppTheme';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SwipeExhaustedStateProps {
  isRefreshing: boolean;
  onRefresh: () => void;
  error?: any;
  isInitialLoad?: boolean;
  role?: 'client' | 'owner';
  radiusKm?: number;
}

const CATEGORY_LABELS: Record<string, string> = {
  all:        'All',
  property:   'Properties',
  motorcycle: 'Motorcycles',
  bicycle:    'Bicycles',
  services:   'Services',
  buyers:     'Buyers',
  renters:    'Renters',
  hire:       'Workers',
  worker:     'Workers',
};

export const SwipeExhaustedState = ({
  isRefreshing,
  onRefresh,
  error,
  isInitialLoad = false,
  role = 'client',
  radiusKm = 50
}: SwipeExhaustedStateProps) => {
  const { isLight } = useAppTheme();
  const { setCategories } = useFilterActions();
  const activeCategory = useFilterStore(s => s.activeCategory);
  const setActiveCategory = useFilterStore(s => s.setActiveCategory);
  const [pulseVisible, setPulseVisible] = useState(true);

  useEffect(() => {
    setPulseVisible(true);
    const timer = setTimeout(() => setPulseVisible(false), 5000);
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const categoryLabel = CATEGORY_LABELS[activeCategory as keyof typeof CATEGORY_LABELS] || 'All';

  if (error && isInitialLoad) {
    return (
      <div className="relative w-full z-50 flex flex-col items-center justify-center px-4 bg-background" style={{ minHeight: 'calc(100dvh - 120px)' }}>
        <div className="text-center bg-destructive/5 border-destructive/20 p-10 rounded-[3rem] border">
          <div className="text-7xl mb-6">📡</div>
          <h3 className="text-2xl font-black mb-3 text-destructive">Connection Error</h3>
          <p className="text-muted-foreground/80 mb-8 max-w-[280px] mx-auto text-sm leading-relaxed">
            Could not load listings. Please try again.
          </p>
          <Button onClick={onRefresh} variant="outline" className="gap-3 h-12 px-6 rounded-full text-sm">
            <RotateCcw className="w-4 h-4" />
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative z-50 h-full w-full flex flex-col items-center justify-center bg-transparent px-6">
      <div className="flex flex-col items-center text-center max-w-md w-full gap-6">
        {/* Logo */}
        <img
          src="/icons/Swipess-wordmark-white.svg"
          alt="Swipess"
          className={cn("h-10 object-contain", isLight && "invert")}
        />

        {/* Searching Text */}
        <h2 className={cn("text-3xl font-black tracking-tight leading-tight", isLight ? "text-black" : "text-white")}>
          Searching for {categoryLabel}
        </h2>

        {/* Fixed-height pulse container — prevents layout shift */}
        <div className="h-24 flex items-center justify-center">
          {pulseVisible && (
            <motion.div
              animate={{ scale: [1, 1.2], opacity: [0.5, 0.9] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className={cn("w-16 h-16 rounded-full", isLight ? "bg-black/20" : "bg-white/20")}
            />
          )}
        </div>

        {/* Distance */}
        <div className={cn(
          "px-5 py-2 rounded-full font-bold uppercase text-sm border",
          isLight ? "bg-black/10 text-black border-black/20" : "bg-white/10 text-white border-white/20"
        )}>
          {radiusKm} km radius
        </div>

        {/* Change Sector Button */}
        <button
          onClick={() => {
            triggerHaptic('heavy');
            const cycle = role === 'owner'
              ? ['buyers', 'renters', 'hire']
              : ['property', 'motorcycle', 'bicycle', 'services'];
            const currentIdx = cycle.indexOf(activeCategory as any);
            const nextIdx = (currentIdx + 1) % cycle.length;
            setActiveCategory(cycle[nextIdx] as any);
            setCategories([cycle[nextIdx]] as any);
          }}
          className={cn(
            "px-8 py-3 rounded-full font-black uppercase text-sm transition-all active:scale-95 border",
            isLight
              ? "bg-black text-white border-black/20 hover:bg-black/80"
              : "bg-white text-black border-white/20 hover:bg-white/80"
          )}
        >
          Change Sector
        </button>
      </div>
    </div>
  );
};
