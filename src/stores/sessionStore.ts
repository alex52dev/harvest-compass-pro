import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SessionStore {
  currentFarmerId: number | null;
  selectedFarmId: number | null;
  setCurrentFarmer: (id: number | null) => void;
  setSelectedFarm: (id: number | null) => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionStore>()(
  persist(
    (set) => ({
      currentFarmerId: 1,
      selectedFarmId: 1,
      setCurrentFarmer: (id) => set({ currentFarmerId: id }),
      setSelectedFarm: (id) => set({ selectedFarmId: id }),
      clearSession: () => set({ currentFarmerId: null, selectedFarmId: null }),
    }),
    { name: "harvester-session" }
  )
);
