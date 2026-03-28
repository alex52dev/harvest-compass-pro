import { create } from "zustand";

export interface AlertItem {
  id: string;
  type: "climate" | "pest" | "info" | "weather";
  message: string;
  time: string;
  read: boolean;
}

interface NotificationStore {
  alerts: AlertItem[];
  unreadCount: number;
  addAlert: (alert: Omit<AlertItem, "id" | "read">) => void;
  markAlertRead: (id: string) => void;
  clearAlerts: () => void;
  setAlerts: (alerts: AlertItem[]) => void;
}

export const useNotificationStore = create<NotificationStore>((set, get) => ({
  alerts: [],
  unreadCount: 0,
  addAlert: (alert) => {
    const newAlert: AlertItem = { ...alert, id: crypto.randomUUID(), read: false };
    set((s) => ({ alerts: [newAlert, ...s.alerts], unreadCount: s.unreadCount + 1 }));
  },
  markAlertRead: (id) =>
    set((s) => {
      const alerts = s.alerts.map((a) => (a.id === id ? { ...a, read: true } : a));
      return { alerts, unreadCount: alerts.filter((a) => !a.read).length };
    }),
  clearAlerts: () => set({ alerts: [], unreadCount: 0 }),
  setAlerts: (alerts) => set({ alerts, unreadCount: alerts.filter((a) => !a.read).length }),
}));
