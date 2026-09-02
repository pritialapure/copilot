import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,

      setSession: (token, user) => {
        localStorage.setItem('auth_token', token);
        localStorage.setItem('auth_user', JSON.stringify(user));
        set({ token, user });
      },

      logout: () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        set({ token: null, user: null });
      },

      isAuthenticated: () => {
        const state = get();
        return !!state.token && !!state.user;
      }
    }),
    {
      name: 'auth-store',
      partialize: (state) => ({ user: state.user, token: state.token })
    }
  )
);

export default useAuthStore;
