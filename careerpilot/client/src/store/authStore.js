import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const authStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,

      setSession: (token, user) => set({ token, user }),
      logout: () => set({ token: null, user: null }),
      isAuthenticated: () => {
        const state = authStore.getState();
        return !!state.token && !!state.user;
      },
    }),
    {
      name: 'careerpilot-session',
      storage: typeof window !== 'undefined' ? localStorage : undefined,
    }
  )
);

export default authStore;
