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

  setUser: (user: User, token: string) => void;
  clearError: () => void;
  logout: () => void;

  loginDoctor: (email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  registerpatient: (data: any) => Promise<void>;
  fetchProfile: () => Promise<void>;
  updateProfile: (data: any) => Promise<void>;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,

      // Save login data
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

      // Doctor Login
      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("auth/doctor/login", {
            email,
            password,
          });
          get().setUser(res.data.user, res.data.token);
        } catch (err: any) {
          set({ error: err.message || "Login failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Patient Login
      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("auth/patient/login", {
            email,
            password,
          });
          get().setUser(res.data.user, res.data.token);
        } catch (err: any) {
          set({ error: err.message || "Login failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Register Doctor
      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("auth/doctor/register", data);
          get().setUser(res.data.user, res.data.token);
        } catch (err: any) {
          set({ error: err.message || "Registration failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Register Patient
      registerpatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const res = await postWithoutAuth("auth/patient/register", data);
          get().setUser(res.data.user, res.data.token);
        } catch (err: any) {
          set({ error: err.message || "Registration failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },

      // Fetch user after refresh
      fetchProfile: async () => {
        const token = localStorage.getItem("token");
        if (!token) {
          set({ user: null, isAuthenticated: false });
          return;
        }

        set({ loading: true });
        try {
          const storedUser = get().user;
          const endpoint =
            storedUser?.type === "doctor" ? "doctor/me" : "patient/me";
          const res = await getWithAuth(endpoint);
          set({ user: { ...storedUser, ...res.data }, isAuthenticated: true });
        } catch (err) {
          console.error("Fetch profile failed:", err);
          set({ user: null, isAuthenticated: false });
        } finally {
          set({ loading: false });
        }
      },

      // Update onboarding/profile fields
      updateProfile: async (data) => {
        set({ loading: true });
        try {
          const user = get().user;
          if (!user) throw new Error("No user found");
          const endpoint =
            user.type === "doctor"
              ? "doctor/onboarding/update"
              : "patient/onboarding/update";
          const res = await putWithAuth(endpoint, data);
          set({ user: { ...user, ...res.data } });
        } catch (err: any) {
          set({ error: err.message || "Update failed" });
          throw err;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
