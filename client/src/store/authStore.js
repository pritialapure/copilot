import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set) => ({
      token: null,
      user: null,
      setSession: ({ token, user }) => {
        // TODO: Store the token and user in the persisted session.
      },
      logout: () => {
        // TODO: Clear the token and user.
      }
    }),
    {
      name: "careerpilot-session",
      storage: createJSONStorage(() => localStorage)
    }
  )
);
