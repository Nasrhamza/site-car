"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";

const VISITOR_KEY = "alhaduni-visitor-id";
const SESSION_KEY = "alhaduni-session-id";
const REFERRER_KEY = "alhaduni-session-referrer";
let lastTrackedPath = "";
let lastTrackedAt = 0;

function createId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}-${Math.random().toString(36).slice(2)}`;
}

function getOrCreate(storage: Storage, key: string) {
  const existing = storage.getItem(key);
  if (existing) return existing;
  const value = createId();
  storage.setItem(key, value);
  return value;
}

export function AnalyticsTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/login")) return;
    if (navigator.doNotTrack === "1") return;

    const now = Date.now();
    if (lastTrackedPath === pathname && now - lastTrackedAt < 1500) return;
    lastTrackedPath = pathname;
    lastTrackedAt = now;

    const timer = window.setTimeout(() => {
      try {
        const visitorId = getOrCreate(window.localStorage, VISITOR_KEY);
        const sessionId = getOrCreate(window.sessionStorage, SESSION_KEY);
        let referrer = window.sessionStorage.getItem(REFERRER_KEY);
        if (referrer === null) {
          referrer = document.referrer || "";
          window.sessionStorage.setItem(REFERRER_KEY, referrer);
        }

        void api.post("/analytics/visit", {
          visitorId,
          sessionId,
          path: pathname,
          referrer,
          language: navigator.language,
          screenWidth: window.screen.width,
          screenHeight: window.screen.height
        }, { timeout: 4500 }).catch(() => undefined);
      } catch {
        // Analytics must never interrupt navigation or the shopping experience.
      }
    }, 350);

    return () => window.clearTimeout(timer);
  }, [pathname]);

  return null;
}
