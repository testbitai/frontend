import { create } from "zustand";

interface AuthState {
  user: any;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  login: (user: any, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshAccessToken: (token: string, refreshToken: string) => void;
  setLoading: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => {
  let refreshToken: string | null = null;

  if (typeof window !== "undefined") {
    refreshToken = localStorage.getItem("refreshToken");
  }

  return {
    user: null,
    accessToken: null,
    refreshToken,
    loading: true,
    setLoading: (value) => set({ loading: value }),
    login: (user, accessToken, refreshToken) => {
      localStorage.setItem("refreshToken", refreshToken);
      set({ user, accessToken, refreshToken });
    },
    logout: () => {
      localStorage.removeItem("refreshToken");
      set({ user: null, accessToken: null, refreshToken: null });
    },
    refreshAccessToken: (token, refreshToken) => {
      localStorage.setItem("refreshToken", refreshToken);
      set({ accessToken: token, refreshToken });
    },
  };
});
