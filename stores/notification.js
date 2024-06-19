import { create } from 'zustand';

export const useNotificationStore = create((set) => ({
  openNotification: false,
  setOpenNotification: (openNotification) => set({ openNotification }),
  message: '',
  setMessage: (message) => set({ message })
}));
