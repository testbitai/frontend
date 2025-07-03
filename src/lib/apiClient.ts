import { useAuthStore } from "@/stores/authStore";
import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const apiClient = axios.create({
  baseURL: baseURL + "/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔐 Request Interceptor - Attach Access Token
apiClient.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔄 Response Interceptor - Refresh Token on 401
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const store = useAuthStore.getState();

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      store.refreshToken
    ) {
      originalRequest._retry = true;
      try {
        store.setLoading(true);
        const refreshResponse = await axios.post(
          baseURL + "/api/v1/auth/refresh-tokens",
          { refreshToken: store.refreshToken }
        );

        const { accessToken, refreshToken } = refreshResponse.data.data.tokens;

        // Update Zustand store with new token
        store.refreshAccessToken(accessToken, refreshToken);

        // Retry original request with new access token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error("🔁 Token refresh failed", refreshError);
        store.logout();

        store.setLoading(false);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
