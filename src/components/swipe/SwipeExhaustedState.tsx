import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, MapPin, ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFilterStore } from '@/state/filterStore';
import useAppTheme from '@/hooks/useAppTheme';

interface SwipeExhaustedStateProps {
  onRefresh: () => void;
  isRefreshing?: boolean;
  activeCategory: string | null;
  role: 'owner' | 'client';
}

export const SwipeExhaustedState: React.FC<SwipeExhaustedStateProps> = ({
  onRefresh,
  isRefreshing = false,
  activeCategory,
  role
}) => {
  const { isLight } = useAppTheme();
  const radiusKm = useFilterStore(s => s.radiusKm);
  const setActiveCategory = useFilterStore(s => s.setActiveCategory);
  const setCategories = useFilterStore(s => s.setCategories);

  const categoryLabel = useMemo(() => {
    switch (activeCategory) {
      case 'buyers': return 'Buyers';
      case 'renters': return 'Renters';
      case 'hire': return 'Opportunities';
      case 'property': return 'Properties';
      case 'motorcycle': return 'Motorcycles';
      case 'bicycle': return 'Bicycles';
      case 'services': return 'Services';
      default: return 'Opportunities';
    }
  }, [activeCategory]);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md mx-auto p-8 text-center space-y-8 animate-in fade-in zoom-in duration-500">
      {/* Visual Indicator */}
      <div className="relative">
        <div className={cn(
          "w-32 h-32 rounded-full flex items-center justify-center relative z-10",
          isLight ? "bg-black/5" : "bg-white/5"
        )}>
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
          <div className="absolute inset-4 rounded-full border-2 border-primary/40 animate-pulse" />
          <MapPin className={cn(
            "w-12 h-12",
            isLight ? "text-black" : "text-white"
          )} />
        </div>
        
        {/* Radar Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 border border-primary/10 rounded-full animate-pulse" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 border border-primary/5 rounded-full animate-pulse delay-75" />
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <h2 className={cn(
            "text-3xl font-black uppercase tracking-tighter italic leading-none",
            isLight ? "text-black" : "text-white"
          )}>
            Searching <br />
            <span className="text-primary">{categoryLabel}</span>
          </h2>
          
          <p className="text-muted-foreground text-xs font-medium uppercase tracking-widest opacity-60">
            Expanding sector depth to {radiusKm} KM
          </p>
        </div>

        {/* 🚀 ACTION NEXUS */}
        <div className="flex flex-col gap-4 w-full max-w-sm pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onRefresh}
            className={cn(
              "w-full h-16 rounded-[2rem] font-black uppercase italic tracking-[0.2em] shadow-2xl flex items-center justify-center gap-3 transition-all",
              isLight ? "bg-black text-white" : "bg-white text-black"
            )}
          >
            {isRefreshing ? (
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
            ) : (
              <RefreshCw className="w-5 h-5" />
            )}
            <span>Recalibrate Radar</span>
          </motion.button>

          {/* 🛸 BACK TO SECTORS - ADDED FOR PERSISTENCE */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              // Trigger sector reset via state
              setActiveCategory(null);
            }}
            className={cn(
              "w-full h-14 rounded-[2rem] font-black uppercase italic tracking-[0.2em] border transition-all flex items-center justify-center gap-3",
              isLight ? "bg-white/50 border-black/10 text-black" : "bg-white/5 border-white/10 text-white"
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Switch Sector</span>
          </motion.button>
        </div>
      </div>
    </div>
  );
};
