import { create } from 'zustand';
import { ProtectionDomain } from '@/types';

export type UserRole = 
  | 'DISTRICT_COLLECTOR' 
  | 'WCD_SECRETARY' 
  | 'OSC_ADMIN' 
  | 'PROTECTION_OFFICER' 
  | 'DLSA_LAWYER' 
  | 'AUDITOR';

interface AppState {
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  selectedState: string;
  selectedDistrict: string;
  setSelectedDistrict: (state: string, district: string) => void;
  activeDomain: ProtectionDomain;
  setActiveDomain: (domain: ProtectionDomain) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentRole: 'DISTRICT_COLLECTOR',
  setCurrentRole: (role) => set({ currentRole: role }),
  selectedState: 'Bihar',
  selectedDistrict: 'Patna',
  setSelectedDistrict: (state, district) => set({ selectedState: state, selectedDistrict: district }),
  activeDomain: 'WOMEN',
  setActiveDomain: (domain) => set({ activeDomain: domain }),
  sidebarCollapsed: false,
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
}));
