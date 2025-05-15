import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user_info: null,
      class_info: null,
      setUser: (user_info) => set({ user_info }),
      setClass: (class_info) => set({ class_info }),
      logout: () => set({ user_info: null }, {class_info: null}), 
    }),
    {
      name: "auth-storage", 
      storage: createJSONStorage(() => sessionStorage), 
    }
  )
);

export { useAuthStore };
