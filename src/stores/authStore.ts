import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "../types/auth.types";

type AuthState = {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setToken: (token: string) => void;
  setUser: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  logout: () => void;
};

type AuthPersistedState = Pick<AuthState, "user">;

const initialState: Pick<
  AuthState,
  "accessToken" | "user" | "isAuthenticated" | "isLoading"
> = {
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...initialState,
      setToken: (token) =>
        set({
          accessToken: token,
          isAuthenticated: token !== null,
        }),
      setUser: (user) =>
        set({
          user,
          isLoading: false,
        }),
      setLoading: (isLoading) =>
        set({
          isLoading,
        }),
      logout: () =>
        set({
          ...initialState,
          isLoading: false,
        }),
    }),
    {
      name: "auth-session",
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({
        user: state.user,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as AuthPersistedState | undefined;

        return {
          ...currentState,
          user: persisted?.user ?? null,
          accessToken: null,
          isAuthenticated: false,
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setLoading(false);
      },
    }
  )
);
