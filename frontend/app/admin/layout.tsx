"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  CarFront,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  PlusCircle,
  Settings
} from "lucide-react";
import { clearSession, getStoredUser, isAdminRole, type StoredUser } from "@/lib/auth";
import { BrandLogo } from "@/components/brand-logo";
import { cn } from "@/lib/utils";

const links = [
  { href: "/admin", label: "لوحة التحكم", icon: LayoutDashboard },
  { href: "/admin/cars", label: "المركبات", icon: CarFront },
  { href: "/admin/cars/new", label: "إضافة", icon: PlusCircle },
  { href: "/admin/requests", label: "الإشعارات", icon: MessageSquareText },
  { href: "/admin/settings", label: "كلمة المرور", icon: Settings }
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);

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

  if (!ready) {
    return <div className="container-premium py-16 text-sm text-zinc-500">جار تحميل لوحة الإدارة...</div>;
  }

  return (
    <div className="min-h-screen overflow-x-hidden bg-[linear-gradient(180deg,#fafafa_0%,#ffffff_45%,#fafafa_100%)]">
      <div className="container-premium grid min-w-0 gap-5 py-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        <motion.aside
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.35 }}
          className="min-w-0 rounded-[24px] border border-zinc-200/70 bg-white p-3 shadow-premium lg:sticky lg:top-24 lg:h-fit"
        >
          <div className="flex items-center gap-3 rounded-[20px] bg-zinc-950 px-4 py-4 text-white lg:flex-col lg:text-center">
            <BrandLogo compact className="h-16 w-16" />
            <div>
              <h2 className="text-lg font-bold">لوحة الإدارة</h2>
              <p className="mt-1 max-w-[180px] truncate text-xs text-white/70">
                {user?.name || user?.email}
              </p>
            </div>
          </div>

          <nav className="mt-3 grid gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "relative inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-brand text-white shadow-lg shadow-brand/20"
                      : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
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
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </motion.aside>

        <main className="min-w-0 max-w-full overflow-hidden">{children}</main>
      </div>
    </div>
  );
}
