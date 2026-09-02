import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,

      setSession: (token, user) => {
        set({ token, user });
      },

      logout: () => {
        set({ token: null, user: null });
      },
    }),
    {
      name: 'auth-store',
    }
  )
);