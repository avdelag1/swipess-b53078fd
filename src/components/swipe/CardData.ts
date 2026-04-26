import { 
  RealEstateIcon 
} from '@/components/icons/RealEstateIcon';
import { 
  VespaIcon 
} from '@/components/icons/VespaIcon';
import { 
  BeachBicycleIcon 
} from '@/components/icons/BeachBicycleIcon';
import { 
  WorkersIcon 
} from '@/components/icons/WorkersIcon';
import { 
  Sparkles, 
  Radio, 
  ShieldCheck, 
  Users, 
  ShoppingBag, 
  Key, 
  Scale, 
  Megaphone 
} from 'lucide-react';

export interface PokerCardData {
  id: string;
  label: string;
  description: string;
  accent: string;
  accentRgb: string;
  icon: any;
}

export interface OwnerIntentCard extends PokerCardData {
  clientType?: string;
  category?: string;
  listingType?: string;
}

export const POKER_CARDS: PokerCardData[] = [
  { id: 'property', label: 'Properties',  description: 'Houses & apts',       accent: '#3b82f6', accentRgb: '59,130,246', icon: RealEstateIcon  },
  { id: 'motorcycle', label: 'Motorcycles', description: 'Bikes & scooters',     accent: '#f97316', accentRgb: '249,115,22', icon: VespaIcon  },
  { id: 'bicycle',    label: 'Bicycles',    description: 'City & mountain',      accent: '#f43f5e', accentRgb: '244,63,94', icon: BeachBicycleIcon   },
  { id: 'services',   label: 'Workers',     description: 'Skilled freelancers',  accent: '#a855f7', accentRgb: '168,85,247', icon: WorkersIcon  },
  { id: 'radio',      label: 'Radio',       description: 'Sentient Beats',       accent: '#f43f5e', accentRgb: '244,63,94',  icon: Radio },
  { id: 'all',        label: 'All',         description: 'Browse everything',    accent: '#06b6d4', accentRgb: '6,182,212', icon: Sparkles   },
  { id: 'vap',        label: 'Resident Card', description: 'Local Discounts',    accent: '#10b981', accentRgb: '168,85,247', icon: ShieldCheck },
];

export const OWNER_INTENT_CARDS: OwnerIntentCard[] = [
  {
    id: 'all-clients',
    label: 'All Clients',
    description: 'Everyone Seeking',
    accent: '#06b6d4',
    accentRgb: '6,182,212',
    clientType: 'all',
    icon: Users,
  },
  {
    id: 'buyers',
    label: 'Buyers',
    description: 'Purchase Ready',
    accent: '#3b82f6',
    accentRgb: '59,130,246',
    clientType: 'buy',
    icon: ShoppingBag,
  },
  {
    id: 'renters',
    label: 'Renters',
    description: 'Looking to Move',
    accent: '#10b981',
    accentRgb: '16,185,129',
    clientType: 'rent',
    icon: Key,
  },
  {
    id: 'hire',
    label: 'Services',
    description: 'Worker Seeking',
    accent: '#a855f7',
    accentRgb: '168,85,247',
    clientType: 'hire',
    icon: WorkersIcon,
  },
  {
    id: 'lawyer',
    label: 'Legal Hub',
    description: 'Contracts & Docs',
    accent: '#6366f1',
    accentRgb: '99,102,241',
    icon: Scale,
  },
  {
    id: 'ai-listing',
    label: 'AI Wizard',
    description: 'Auto-Generate Listing',
    accent: '#818cf8',
    accentRgb: '129,140,248',
    icon: Sparkles,
  },
  {
    id: 'promote',
    label: 'Promote',
    description: 'Advertise Events',
    accent: '#ec4899',
    accentRgb: '236,72,153',
    icon: Megaphone,
  },
  {
    id: 'radio',
    label: 'Radio',
    description: 'Sentient Beats',
    accent: '#f43f5e',
    accentRgb: '244,63,94',
    icon: Radio,
  },
];
