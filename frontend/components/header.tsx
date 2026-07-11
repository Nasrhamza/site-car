"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowUpLeft,
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
import { buildWhatsAppUrl } from "@/lib/company";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

function readAdminUser() {
  const user = getStoredUser();
  return user && isAdminRole(user.role) ? user : null;
}

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [adminUser, setAdminUser] = useState<StoredUser | null>(null);
  const { language, setLanguage, t } = useLanguage();
  const isAdminRoute = pathname.startsWith("/admin");
  const navLinks = [
    { href: "/", label: t.nav[0] },
    { href: "/catalogue", label: t.nav[1] },
    { href: "/contact", label: t.nav[2] }
  ];

  useEffect(() => {
    const syncSession = () => {
      setAdminUser(readAdminUser());
    };

    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [pathname]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const whatsappHref = buildWhatsAppUrl(language === "ar" ? "مرحباً، أريد مزيداً من المعلومات عن السيارات المتوفرة." : "Hello, I would like more information about the available cars.");
  const authHref = adminUser ? "/admin" : "/login";
  const authLabel = adminUser ? "Dashboard" : "Sign in";
  const AuthIcon = adminUser ? LayoutDashboard : LogIn;
  const isDarkTheme = mounted && resolvedTheme === "dark";

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark");
  };

  const handleLogout = () => {
    clearSession();
    setAdminUser(null);
    setOpen(false);
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur">
      <div className="container-premium flex h-16 items-center justify-between gap-3 lg:h-18">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo priority compact className="h-11 w-11 sm:h-12 sm:w-12" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-zinc-950">ALHADUNI CARS</p>
              <p className="text-xs text-zinc-500">Dubai car marketplace</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium text-zinc-600 transition hover:text-zinc-950",
                  active && "text-zinc-950"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          {isAdminRoute && <Link
              href={authHref}
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-brand hover:text-brand"
            >
              <AuthIcon className="h-4 w-4" />
              {authLabel}
            </Link>}

          {isAdminRoute && adminUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}

          {!isAdminRoute && <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-brand hover:text-brand"
              aria-label="Change language"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>}

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-dark"
          >
            <PhoneCall className="h-4 w-4" />
            {t.whatsapp}
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white"
          >
            <PhoneCall className="h-4 w-4" />
            {t.whatsapp}
          </a>

          {!isAdminRoute && <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700"
              aria-label="Change language"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>}

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-900"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-zinc-200 bg-white lg:hidden"
          >
            <div className="container-premium py-4">
              <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-4">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-50",
                      pathname === item.href && "bg-zinc-950 text-white hover:bg-zinc-950"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAdminRoute && <div className="grid gap-2 pt-2">
                    <Link
                      href={authHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900"
                    >
                      <AuthIcon className="h-4 w-4" />
                      {authLabel}
                    </Link>
                  </div>}

                {isAdminRoute && adminUser && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-600"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
