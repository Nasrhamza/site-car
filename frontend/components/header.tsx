"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  ArrowUpLeft,
  ChevronDown,
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
import { ENGINE_CAPACITY_OPTIONS, REGIONAL_SPECS_OPTIONS, VEHICLE_BRANDS, VEHICLE_CATEGORIES, getCategoryDisplayLabel } from "@/lib/company";

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
  const [carsMenuOpen, setCarsMenuOpen] = useState(false);
  const { language, setLanguage, t } = useLanguage();
  const isAdminRoute = pathname.startsWith("/admin");
  const navLinks = [
    { href: "/", label: t.nav[0] },
    { href: "/catalogue", label: t.nav[1] },
    { href: "/guide", label: language === "en" ? "Guide" : "الدليل" },
    { href: "/seller/request-account", label: language === "en" ? "Sell with us" : "اعرض سيارتك معنا" },
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
    setCarsMenuOpen(false);
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
    <header onMouseLeave={() => setCarsMenuOpen(false)} className="sticky top-0 z-50 border-b border-zinc-200 bg-white/95 backdrop-blur dark:border-white/10 dark:bg-zinc-950/95">
      <div className="container-premium flex h-16 items-center justify-between gap-3 lg:h-18">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="flex min-w-0 items-center gap-3">
            <BrandLogo priority compact className="h-11 w-11 sm:h-12 sm:w-12" />
            <div className="hidden min-w-0 sm:block">
              <p className="truncate text-sm font-semibold text-zinc-950 dark:text-white">ALHADUNICARS</p>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">{language === "ar" ? "سوق سيارات وتصدير من دبي" : "Dubai car marketplace"}</p>
            </div>
          </Link>
        </div>

        <nav className="hidden items-center gap-6 lg:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;

            if (item.href === "/catalogue") {
              return <div key={item.href} className="flex h-16 items-center lg:h-18" onMouseEnter={() => setCarsMenuOpen(true)}>
                <Link href={item.href} className={cn("nav-animated-link inline-flex items-center gap-1 rounded-full px-3 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300", active && "nav-animated-link-active text-zinc-950 dark:text-white")}>
                  {item.label}<ChevronDown className={`h-4 w-4 transition ${carsMenuOpen ? "rotate-180" : ""}`} />
                </Link>
              </div>;
            }

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "nav-animated-link rounded-full px-3 py-2 text-sm font-bold text-zinc-600 dark:text-zinc-300",
                  active && "nav-animated-link-active text-zinc-950 dark:text-white"
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
              className="inline-flex items-center gap-2 rounded-full border border-zinc-200 bg-white px-4 py-2.5 text-sm font-semibold text-zinc-900 transition hover:border-brand hover:text-brand dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            >
              <AuthIcon className="h-4 w-4" />
              {authLabel}
            </Link>}

          {isAdminRoute && adminUser && (
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 rounded-full border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-600 transition hover:bg-rose-50 dark:border-rose-500/30 dark:bg-zinc-900 dark:hover:bg-rose-500/10"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          )}

          <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700 transition hover:border-brand hover:text-brand dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
              aria-label="Change language"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition hover:border-zinc-300 hover:text-zinc-950 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:text-white"
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

          <button
              type="button"
              onClick={() => setLanguage(language === "en" ? "ar" : "en")}
              className="rounded-full border border-zinc-200 bg-white px-3 py-2.5 text-xs font-bold text-zinc-700 dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
              aria-label="Change language"
            >
              {language === "en" ? "العربية" : "EN"}
            </button>

          <button
            aria-label="Toggle theme"
            onClick={toggleTheme}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-700 transition dark:border-white/10 dark:bg-zinc-900 dark:text-zinc-200"
          >
            {isDarkTheme ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>

          <button
            onClick={() => setOpen((value) => !value)}
            className="rounded-full border border-zinc-200 bg-white p-2.5 text-zinc-900 dark:border-white/10 dark:bg-zinc-900 dark:text-white"
            aria-label="Open menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {carsMenuOpen ? <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .18 }} onMouseEnter={() => setCarsMenuOpen(true)} onMouseLeave={() => setCarsMenuOpen(false)} className="absolute inset-x-0 top-full hidden border-b border-zinc-200 bg-white shadow-2xl lg:block dark:border-white/10 dark:bg-zinc-950">
          <div className="container-premium grid grid-cols-4 gap-0 py-6">
            <MegaColumn title={language === "ar" ? "حسب الماركة" : "Browse by make"} links={VEHICLE_BRANDS.slice(0, 9).map((brand) => ({ label: brand, href: `/catalogue?brand=${encodeURIComponent(brand)}` }))} />
            <MegaColumn title={language === "ar" ? "موديلات مطلوبة" : "Popular models"} links={["Land Cruiser", "Patrol", "Prado", "Camry", "Hilux", "Range Rover", "Cayenne", "X5", "G-Class"].map((model) => ({ label: model, href: `/catalogue?model=${encodeURIComponent(model)}` }))} />
            <MegaColumn title={language === "ar" ? "نوع المركبة" : "Vehicle type"} links={VEHICLE_CATEGORIES.map((category) => ({ label: getCategoryDisplayLabel(category, language), href: `/catalogue?category=${encodeURIComponent(category)}` }))} />
            <div className="border-l border-zinc-200 px-6 dark:border-white/10 rtl:border-l-0 rtl:border-r">
              <p className="text-xs font-black uppercase tracking-[.18em] text-brand">{language === "ar" ? "بحث دقيق" : "Find the right car"}</p>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {ENGINE_CAPACITY_OPTIONS.filter((_item, index) => index % 10 === 0).map((capacity) => <Link key={capacity} href={`/catalogue?engineCapacity=${capacity}`} className="rounded-xl bg-zinc-100 px-3 py-2 text-xs font-bold hover:bg-brand hover:text-white dark:bg-white/5">{capacity.toFixed(1)} L</Link>)}
              </div>
              <div className="mt-4 flex flex-wrap gap-2">{REGIONAL_SPECS_OPTIONS.slice(0, 5).map((spec) => <Link key={spec} href={`/catalogue?regionalSpecs=${encodeURIComponent(spec)}`} className="rounded-full border border-zinc-200 px-3 py-1.5 text-xs font-bold hover:border-brand hover:text-brand dark:border-white/10">{spec}</Link>)}</div>
              <Link href="/catalogue" className="mt-5 inline-flex w-full items-center justify-center rounded-xl bg-brand px-4 py-3 text-sm font-extrabold text-white">{language === "ar" ? "عرض كل المركبات" : "View all vehicles"}</Link>
            </div>
          </div>
        </motion.div> : null}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="border-t border-zinc-200 bg-white lg:hidden dark:border-white/10 dark:bg-zinc-950"
          >
            <div className="container-premium py-4">
              <div className="grid gap-2 rounded-2xl border border-zinc-200 bg-white p-4 dark:border-white/10 dark:bg-zinc-900">
                {navLinks.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "rounded-xl px-4 py-3 text-sm font-medium transition hover:bg-zinc-50 dark:text-zinc-200 dark:hover:bg-white/5",
                      pathname === item.href && "bg-zinc-950 text-white hover:bg-zinc-950"
                    )}
                  >
                    {item.label}
                  </Link>
                ))}

                {isAdminRoute && <div className="grid gap-2 pt-2">
                    <Link
                      href={authHref}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 px-4 py-3 text-sm font-semibold text-zinc-900 dark:border-white/10 dark:text-white"
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

function MegaColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return <div className="border-r border-zinc-200 px-6 dark:border-white/10 rtl:border-l rtl:border-r-0"><p className="text-xs font-black uppercase tracking-[.16em] text-zinc-950 dark:text-white">{title}</p><div className="mt-4 grid gap-1">{links.map((link) => <Link key={`${link.href}-${link.label}`} href={link.href} className="rounded-lg px-2 py-1.5 text-sm text-zinc-600 transition hover:bg-zinc-100 hover:text-brand dark:text-zinc-300 dark:hover:bg-white/5">{link.label}</Link>)}</div></div>;
}
