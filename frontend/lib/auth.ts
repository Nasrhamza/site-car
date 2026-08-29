import { ADMIN_SESSION_COOKIE, ADMIN_SESSION_MAX_AGE, SELLER_SESSION_COOKIE } from "@/lib/auth-constants";

export type StoredUser = {
  id: string;
  email: string;
  role: string;
  name?: string;
  accountStatus?: string;
  showroomName?: string;
};

const ACCESS_TOKEN_KEY = "accessToken";
const USER_KEY = "harouHedwaniUser";
const IMPERSONATION_TOKEN_KEY = "alhaduniAdminReturnToken";
const IMPERSONATION_USER_KEY = "alhaduniAdminReturnUser";

function setRoleSessionCookie(cookieName: string, enabled: boolean) {
  if (typeof document === "undefined") return;

  const secure = typeof window !== "undefined" && window.location.protocol === "https:" ? "; Secure" : "";
  const maxAge = enabled ? ADMIN_SESSION_MAX_AGE : 0;
  const value = enabled ? "1" : "";

  document.cookie = `${cookieName}=${value}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
}

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setSession(accessToken: string, user: StoredUser) {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  setRoleSessionCookie(ADMIN_SESSION_COOKIE, isAdminRole(user.role));
  setRoleSessionCookie(SELLER_SESSION_COOKIE, isSellerRole(user.role));
}

export function clearSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  setRoleSessionCookie(ADMIN_SESSION_COOKIE, false);
  setRoleSessionCookie(SELLER_SESSION_COOKIE, false);
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

export function isSellerRole(role?: string | null) {
  return role === "Vendeur";
}

export function startSellerImpersonation(accessToken: string, user: StoredUser) {
  if (typeof window === "undefined") return;
  const currentToken = getAccessToken();
  const currentUser = getStoredUser();
  if (currentToken && currentUser && isAdminRole(currentUser.role)) {
    sessionStorage.setItem(IMPERSONATION_TOKEN_KEY, currentToken);
    sessionStorage.setItem(IMPERSONATION_USER_KEY, JSON.stringify(currentUser));
  }
  setSession(accessToken, user);
}

export function hasAdminReturnSession() {
  if (typeof window === "undefined") return false;
  return Boolean(sessionStorage.getItem(IMPERSONATION_TOKEN_KEY) && sessionStorage.getItem(IMPERSONATION_USER_KEY));
}

export function returnToAdminSession() {
  if (typeof window === "undefined") return false;
  const token = sessionStorage.getItem(IMPERSONATION_TOKEN_KEY);
  const rawUser = sessionStorage.getItem(IMPERSONATION_USER_KEY);
  if (!token || !rawUser) return false;
  try {
    setSession(token, JSON.parse(rawUser));
    sessionStorage.removeItem(IMPERSONATION_TOKEN_KEY);
    sessionStorage.removeItem(IMPERSONATION_USER_KEY);
    return true;
  } catch {
    return false;
  }
}
