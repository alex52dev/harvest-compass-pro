import { create } from "zustand";

interface NetworkStore {
  isOffline: boolean;
  lastSyncAt: string | null;
  setOfflineState: (offline: boolean) => void;
  setLastSyncAt: (at: string) => void;
}

export const useNetworkStore = create<NetworkStore>((set) => ({
  isOffline: !navigator.onLine,
  lastSyncAt: null,
  setOfflineState: (offline) => set({ isOffline: offline }),
  setLastSyncAt: (at) => set({ lastSyncAt: at }),
}));

// Auto-detect online/offline
if (typeof window !== "undefined") {
  window.addEventListener("online", () => useNetworkStore.getState().setOfflineState(false));
  window.addEventListener("offline", () => useNetworkStore.getState().setOfflineState(true));
}
