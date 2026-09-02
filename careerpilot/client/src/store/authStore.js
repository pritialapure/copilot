import { useAuthStore } from './authStore';

export const useAuthStore = () => {
  const store = useAuthStore();
  return {
    ...store,
    isAuthenticated: !!store.token,
    isLoading: false
  };
};
