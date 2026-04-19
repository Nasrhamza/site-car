import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE } from "@/lib/auth-constants";

export type StoredUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
};

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "harouHedwaniUser";

function setAdminSessionCookie(enabled: boolean) {
  if (typeof document === "undefined") return;

  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = enabled ? ADMIN_SESSION_MAX_AGE : 0;
  const value = enabled ? "1" : "";

  document.cookie = `${ADMIN_SESSION_COOKIE}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setSession(accessToken: string, user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setAdminSessionCookie(isAdminRole(user.role));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setAdminSessionCookie(false);
}

export function getStoredUser(): StoredUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    clearSession();
    return null;
  }
}

export function isAdminRole(role?: string | null) {
  return role === "Admin";
}
