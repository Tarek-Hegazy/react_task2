import axios from "axios";
import { refreshTokeAPI } from "./auth";
import { jwtDecode } from "jwt-decode";
import { useAuthStore } from "../store/auth"; // Import useAuthStore

export const APIClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function removeTokenHandler() {
  // This function might become redundant or less used.
  useAuthStore.getState().clear();
  window.location.replace("/login");
}

export function isTokenExpire(token) {
  if (!token) return true; // Consider token missing as expired
  try {
    // Try to decode token to check if it's a valid JWT and get expiration
    const { exp, expiresIn } = jwtDecode(token); // Changed from jwt_decode to jwtDecode
    const now = Date.now() / 1000; // Current time in seconds
    // Check if 'exp' (absolute time) or 'expiresIn' (relative time from issue) is past
    if (exp) {
      return exp < now;
    }
    if (expiresIn) {
      // This case might need more context if 'expiresIn' is relative to 'iat' (issued at)
      // For simplicity, assuming 'expiresIn' is a direct measure or 'exp' is always present
      // If 'expiresIn' is seconds from issue, and 'iat' is known, logic would be: (iat + expiresIn) < now
      // However, standard JWT 'exp' is generally preferred.
      // If your tokens only have 'expiresIn' as a duration from now, this check is problematic.
      // Sticking to 'exp' as the primary check for simplicity as per typical JWT usage.
      // Fallback or alternative logic might be needed if 'expiresIn' is the only field.
      return true; // Defaulting to true if only expiresIn is present and not 'exp', to be safe. Or adjust as per token structure.
    }
    return true; // If no exp or expiresIn, consider it expired or invalid.
  } catch (e) {
    // If decoding fails, token is invalid or not a JWT
    return true;
  }
}

export const publicRoutes = ["/signup", "/refresh-token", "/login"];

APIClient.interceptors.request.use(
  async (config) => {
    if (config.url && !publicRoutes.includes(config.url)) { // Added null check for config.url
      const { token, refreshToken, clear, setTokens } = useAuthStore.getState();

      if (isTokenExpire(token)) {
        if (refreshToken && !isTokenExpire(refreshToken)) {
          try {
            const res = await refreshTokeAPI({ refreshToken });
            const newlyRefreshedToken = res.data.token;
            const newRefreshToken = res.data.refreshToken || refreshToken;

            config.headers.Authorization = `Bearer ${newlyRefreshedToken}`;
            setTokens({ token: newlyRefreshedToken, refreshToken: newRefreshToken });
            return config;
          } catch (error) {
            clear();
            window.location.replace("/login");
            return Promise.reject(error);
          }
        } else {
          clear();
          window.location.replace("/login");
          return Promise.reject(new Error("Session expired. Please log in again."));
        }
      } else if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);
