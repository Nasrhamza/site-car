"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  Moon,
  PhoneCall,
  Sun,
  X
} from "lucide-react";
import { clearSession, getStoredUser, isAdminRole, type StoredUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { NAV_LINKS, buildWhatsAppUrl } from "@/lib/company";

function readAdminUser() {
  const user = getStoredUser();
  return user && isAdminRole(user.role) ? user : null;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [adminUser, setAdminUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncSession = () => {
      setAdminUser(readAdminUser());
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [pathname]);

  const whatsappHref = buildWhatsAppUrl(
    "Bonjour, je souhaite des informations sur vos vehicules disponibles."
  );
  const authHref = adminUser ? "/admin" : "/login";
  const authLabel = adminUser ? "Dashboard" : "Se connecter";
  const AuthIcon = adminUser ? LayoutDashboard : LogIn;

  const handleLogout = () => {
    clearSession();
    setAdminUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200/20 bg-white/85 backdrop-blur-xl dark:bg-zinc-950/80">
      <div className="container-premium flex h-20 items-center justify-between gap-3">
        <Link href="/" className="flex min-w-0 items-center gap-3">
          <BrandLogo priority className="h-[58px] w-[190px] sm:h-[72px] sm:w-[240px]" />
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium transition hover:text-brand">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href={authHref}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-5 py-3 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:text-white dark:hover:border-white/20"
          >
            <AuthIcon className="h-4 w-4" />
            {authLabel}
          </Link>

          {adminUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-5 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
            >
              <LogOut className="h-4 w-4" />
              Deconnexion
            </button>
          )}

          <button
            aria-label="Basculer le theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border p-3 transition hover:scale-105"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <PhoneCall className="h-4 w-4" />
            WhatsApp
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            aria-label="Basculer le theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="rounded-full border p-2.5 transition"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button onClick={() => setOpen(!open)} className="rounded-full border p-2.5" aria-label="Ouvrir le menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="container-premium grid gap-3 border-t border-zinc-200/20 py-4 lg:hidden">
          {NAV_LINKS.map((item) => (
            <Link key={item.href} href={item.href} className="rounded-2xl px-2 py-2" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}

          <Link
            href={authHref}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 font-semibold dark:border-white/10"
            onClick={() => setOpen(false)}
          >
            <AuthIcon className="h-4 w-4" />
            {authLabel}
          </Link>

          {adminUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 font-semibold text-red-600 dark:border-red-500/30 dark:text-red-300"
            >
              <LogOut className="h-4 w-4" />
              Deconnexion
            </button>
          )}

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex items-center justify-center gap-2 rounded-2xl bg-brand px-4 py-3 font-semibold text-white"
          >
            <PhoneCall className="h-4 w-4" />
            WhatsApp
          </a>
        </div>
      )}
    </header>
  );
}
