// authStore.ts
import { User } from "@/lib/types";
import {
  getWithAuth,
  postWithoutAuth,
  putWithAuth,
} from "@/service/httpService";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hydrated: boolean;

  setUser: (user: User, token: string) => void;
  clearError: () => void;
  logout: () => void;

  loginDoctor: (email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  registerpatient: (data: any) => Promise<void>;
  fetchProfile: (data: any) => Promise<User | null>;
  updateProfile: (data: any) => Promise<void>;

  setHydrated: () => void;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      hydrated: false,

      setHydrated: () => set({ hydrated: true }),

      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
        localStorage.setItem("token", token);
      },

      clearError: () => set({ error: null }),

      logout: () => {
        localStorage.removeItem("token");
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        });
      },

      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/doctor/login", {
            email,
            password,
          });

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/patient/login", {
            email,
            password,
          });

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/doctor/register", data);

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      registerpatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/patient/register", data);

          get().setUser(response.data.user, response.data.token);
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async (): Promise<User | null> => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("No user found");

          const endpoint = user.type === "doctor" ? "doctor/me" : "patient/me";

          const response = await getWithAuth(endpoint);

          set({ user: { ...user, ...response.data } });
          return response.data;
        } catch (error: any) {
          set({ error: error.message });
          return null;
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (data) => {
        set({ loading: true, error: null });
        try {
          const { user } = get();
          if (!user) throw new Error("No user found");

          const endpoint =
            user.type === "doctor"
              ? "doctor/onboarding/update"
              : "patient/onboarding/update";

          const response = await putWithAuth(endpoint, data);
          set({ user: { ...user, ...response.data } });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      skipHydration: true,

      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);
