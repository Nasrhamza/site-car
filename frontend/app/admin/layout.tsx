"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  BarChart3,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  Bell,
  PlusCircle,
  Settings,
  UsersRound
} from "lucide-react";
import { clearSession, getStoredUser, isAdminRole, type StoredUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";
import { api } from "@/lib/api";

const links = [
  { href: "/admin", en: "Dashboard", ar: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/analytics", en: "Analytics", ar: "التحليلات", icon: BarChart3 },
  { href: "/admin/cars", en: "Vehicles", ar: "المركبات", icon: CarFront },
  { href: "/admin/cars/new", en: "Add vehicle", ar: "إضافة", icon: PlusCircle },
  { href: "/admin/sellers", en: "Seller accounts", ar: "حسابات البائعين", icon: UsersRound },
  { href: "/admin/notifications", en: "Notifications", ar: "التنبيهات", icon: Bell },
  { href: "/admin/requests", en: "Messages", ar: "الإشعارات", icon: MessageSquareText },
  { href: "/admin/settings", en: "Password", ar: "كلمة المرور", icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const copy = language === "en"
    ? { loading: "Loading admin dashboard...", title: "Admin dashboard", logout: "Log out" }
    : { loading: "جار تحميل لوحة الإدارة...", title: "لوحة الإدارة", logout: "تسجيل الخروج" };

  useEffect(() => {
    const storedUser = getStoredUser();

    if (!storedUser || !isAdminRole(storedUser.role)) {
      clearSession();
      router.replace(`/login?redirect=${encodeURIComponent(pathname || "/admin")}`);
      return;
    }

    setUser(storedUser);
    setReady(true);
  }, [pathname, router]);

  useEffect(() => {
    if (!ready) return;
    api.get("/admin/notifications", { params: { limit: 1 } })
      .then(({ data }) => setUnreadNotifications(Number(data?.unread) || 0))
      .catch(() => undefined);
  }, [pathname, ready]);

  if (!ready) {
    return <div className="container-premium py-16 text-sm text-zinc-500 dark:text-zinc-400">{copy.loading}</div>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_45%,#fafafa_100%)] dark:bg-none dark:bg-zinc-950">
      <div className="container-premium grid min-w-0 gap-5 py-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="min-w-0 rounded-[24px] border border-zinc-200/70 bg-white p-3 shadow-premium dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="flex items-center gap-3 rounded-[20px] bg-zinc-950 px-4 py-4 text-white lg:flex-col lg:text-center">
            <BrandLogo compact className="h-16 w-16" />
            <div>
              <h2 className="text-lg font-bold">{copy.title}</h2>
              <p className="mt-1 max-w-[180px] truncate text-xs text-white/70">
                {user?.name || user?.email}
              </p>
            </div>
          </div>

          <nav className="mt-3 grid gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = link.href === "/admin"
                ? pathname === "/admin"
                : pathname === link.href || pathname?.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link[language]}
                  {link.href === "/admin/notifications" && unreadNotifications > 0 ? (
                    <span className="ms-auto inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-brand">
                      {unreadNotifications > 99 ? "99+" : unreadNotifications}
                    </span>
                  ) : null}
                  {active && (
                    <motion.span
                      layoutId="admin-active-link"
                      className="absolute left-3 h-2 w-2 rounded-full bg-white"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          <button
            type="button"
            onClick={() => {
              clearSession();
              router.replace("/login");
            }}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            {copy.logout}
          </button>
        </motion.aside>

        <main className="min-w-0 max-w-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
