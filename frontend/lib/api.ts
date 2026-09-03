import axios, { AxiosHeaders } from "axios";
import { clearSession, getAccessToken, getRefreshToken, setSession } from "@/lib/auth";

const baseURL =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  (process.env.NODE_ENV === "development" ? "http://localhost:5000/api" : "/api");

export const api = axios.create({
  baseURL,
  withCredentials: false
});

let refreshPromise: Promise<string> | null = null;

function refreshAccessToken() {
  if (refreshPromise) return refreshPromise;
  const refreshToken = getRefreshToken();
  if (!refreshToken) return Promise.reject(new Error("No refresh token"));

  refreshPromise = axios.post(`${baseURL}/auth/refresh`, { refreshToken })
    .then(({ data }) => {
      setSession(data.accessToken, data.user, data.refreshToken);
      return data.accessToken as string;
    })
    .finally(() => { refreshPromise = null; });

  return refreshPromise;
}

export async function ensureFreshSession() {
  if (!getRefreshToken()) return getAccessToken();
  return refreshAccessToken();
}

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = getAccessToken();

      if (token) {
        const headers = AxiosHeaders.from(config.headers);
        headers.set("Authorization", `Bearer ${token}`);
        config.headers = headers;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const request = error?.config as (typeof error.config & { _sessionRetry?: boolean }) | undefined;
    const requestPath = String(request?.url || "").split("?")[0];
    const isLoginOrRefreshRequest = /\/auth\/(?:login|admin\/login|seller\/login|refresh)$/.test(requestPath);

    if (typeof window !== "undefined" && error?.response?.status === 401 && request && !request._sessionRetry && !isLoginOrRefreshRequest) {
      request._sessionRetry = true;
      try {
        const accessToken = await refreshAccessToken();
        const headers = AxiosHeaders.from(request.headers);
        headers.set("Authorization", `Bearer ${accessToken}`);
        request.headers = headers;
        return api.request(request);
      } catch (_refreshError) {
        clearSession();
      }
    } else if (typeof window !== "undefined" && error?.response?.status === 401) {
      clearSession();
    }

    return Promise.reject(error);
  }
);
