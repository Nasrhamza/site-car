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
import { NAV_LINKS, buildWhatsAppUrl } from "@/lib/company";
import { cn } from "@/lib/utils";

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

  const whatsappHref = buildWhatsAppUrl(
    "مرحبًا، أريد معلومات حول المركبات المتوفرة لدى ALHADUNI CARS."
  );
  const authHref = adminUser ? "/admin" : "/login";
  const authLabel = adminUser ? "لوحة التحكم" : "تسجيل الدخول";
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
    <header className="sticky top-0 z-50 border-b border-zinc-200/70 bg-white/90 shadow-[0_10px_30px_rgba(15,23,42,0.05)] backdrop-blur-xl transition-colors dark:border-white/10 dark:bg-zinc-950/90 dark:shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
      <div className="container-premium flex h-16 items-center justify-between gap-3 lg:h-[72px]">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex min-w-0 items-center">
            <BrandLogo priority compact className="h-12 w-12 sm:h-14 sm:w-14" />
          </Link>

          <div className="hidden min-w-0 lg:block">
            <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-zinc-500 dark:text-zinc-400">
              Premium Marketplace
            </p>
            <p className="mt-1 truncate text-sm font-semibold text-zinc-950 dark:text-white">
              ALHADUNI CARS
            </p>
          </div>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((item) => {
            const active = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative text-sm font-semibold text-zinc-600 transition hover:text-zinc-950 dark:text-zinc-300 dark:hover:text-white",
                  "after:absolute after:-bottom-2 after:right-0 after:h-[2px] after:w-0 after:rounded-full after:bg-gradient-to-l after:from-brand after:to-brand-gold after:transition-all after:duration-300 hover:after:w-full",
                  active && "text-zinc-950 after:w-full dark:text-white"
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 lg:flex">
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 dark:border-white/10 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
          >
            المعرض
            <ArrowUpLeft className="h-4 w-4" />
          </Link>

          <Link
            href={authHref}
            className="inline-flex items-center gap-2 rounded-full border border-zinc-200 px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:-translate-y-0.5 hover:border-zinc-300 dark:border-white/10 dark:text-white dark:hover:bg-white/10"
          >
            <AuthIcon className="h-4 w-4" />
            {authLabel}
          </Link>

          {adminUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          )}

          <button
            aria-label="تبديل المظهر"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition hover:scale-105 hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10 dark:hover:text-white"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="button-glow inline-flex items-center gap-2 rounded-full bg-brand px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand-dark"
          >
            <PhoneCall className="h-4 w-4" />
            واتساب
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-brand/20"
          >
            <PhoneCall className="h-4 w-4" />
            واتساب
          </a>

          <button
            aria-label="تبديل المظهر"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition dark:border-white/10 dark:bg-white/5 dark:text-zinc-200"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-900 dark:border-white/10 dark:bg-white/5 dark:text-white"
            aria-label="فتح القائمة"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="border-t border-zinc-200/70 bg-white/96 lg:hidden dark:border-white/10 dark:bg-zinc-950/96"
          >
            <div className="container-premium py-4">
              <div className="grid gap-3 rounded-[28px] border border-zinc-200/70 bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900">
                {NAV_LINKS.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-2xl px-4 py-3 text-sm font-semibold transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/10",
                      pathname === item.href && "bg-zinc-950 text-white hover:bg-zinc-950 dark:bg-brand dark:text-white"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="grid gap-2 pt-2 sm:grid-cols-2">
                  <Link
                    href="/catalogue"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900 dark:border-white/10 dark:text-white"
                  >
                    المعرض
                    <ArrowUpLeft className="h-4 w-4" />
                  </Link>

                  <Link
                    href={authHref}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900 dark:border-white/10 dark:text-white"
                  >
                    <AuthIcon className="h-4 w-4" />
                    {authLabel}
                  </Link>
                </div>

                {adminUser && (
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                    تسجيل الخروج
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
