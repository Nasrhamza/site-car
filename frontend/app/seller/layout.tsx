"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Bell, CarFront, LayoutDashboard, LogOut, PlusCircle, RotateCcw, Settings } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { clearSession, getStoredUser, hasAdminReturnSession, isSellerRole, returnToAdminSession, type StoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";
import { api } from "@/lib/api";

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [user, setUser] = useState<StoredUser | null>(null);
  const [ready, setReady] = useState(false);
  const [canReturn, setCanReturn] = useState(false);
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const publicRoute = pathname === "/seller/login" || pathname === "/seller/request-account";
  const ar = language === "ar";
  const links = [
    { href: "/seller", label: ar ? "لوحة التحكم" : "Dashboard", icon: LayoutDashboard },
    { href: "/seller/cars", label: ar ? "مركباتي" : "My vehicles", icon: CarFront },
    { href: "/seller/cars/new", label: ar ? "إضافة مركبة" : "Add vehicle", icon: PlusCircle },
    { href: "/seller/notifications", label: ar ? "الإشعارات" : "Notifications", icon: Bell },
    { href: "/seller/settings", label: ar ? "كلمة المرور" : "Password", icon: Settings }
  ];

  useEffect(() => {
    if (publicRoute) {
      setReady(true);
      return;
    }
    const storedUser = getStoredUser();
    if (!storedUser || !isSellerRole(storedUser.role)) {
      clearSession();
      router.replace(`/seller/login?redirect=${encodeURIComponent(pathname || "/seller")}`);
      return;
    }
    setUser(storedUser);
    setCanReturn(hasAdminReturnSession());
    setReady(true);
  }, [pathname, publicRoute, router]);

  useEffect(() => {
    if (!ready || publicRoute) return;
    api.get("/seller/notifications", { params: { limit: 1 } })
      .then(({ data }) => setUnreadNotifications(Number(data?.unread) || 0))
      .catch(() => undefined);
  }, [pathname, publicRoute, ready]);

  useEffect(() => {
    const syncCount = (event: Event) => {
      const unread = Number((event as CustomEvent<{ unread?: number }>).detail?.unread);
      if (Number.isFinite(unread)) setUnreadNotifications(Math.max(0, unread));
    };
    window.addEventListener("seller-notifications-changed", syncCount);
    return () => window.removeEventListener("seller-notifications-changed", syncCount);
  }, []);

  if (publicRoute) return children;
  if (!ready) return <div className="container-premium py-16 text-sm text-zinc-500">{ar ? "جار تحميل لوحة البائع..." : "Loading seller dashboard..."}</div>;

  return <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
    <div className="mx-auto grid w-full min-w-0 max-w-[1800px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[250px_minmax(0,1fr)] lg:px-8">
      <aside className="min-w-0 rounded-[24px] border border-zinc-200 bg-white p-3 shadow-premium dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-24 lg:h-fit">
        <div className="flex items-center gap-3 rounded-[20px] bg-zinc-950 px-4 py-4 text-white lg:flex-col lg:text-center">
          <BrandLogo compact className="h-14 w-14" />
          <div className="min-w-0"><h2 className="truncate text-base font-black">{user?.showroomName || user?.name || "Seller"}</h2><p className="mt-1 truncate text-xs text-white/65">{user?.email}</p></div>
        </div>
        <nav className="mt-3 grid gap-2">{links.map((link) => {
          const Icon = link.icon;
          const active = link.href === "/seller" ? pathname === "/seller" : pathname === link.href || pathname.startsWith(`${link.href}/`);
          return <Link key={link.href} href={link.href} className={cn("inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-bold transition", active ? "bg-brand text-white" : "bg-zinc-50 text-zinc-700 hover:bg-zinc-100 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10")}><Icon className="h-4 w-4" />{link.label}{link.href === "/seller/notifications" && unreadNotifications > 0 ? <span className="ms-auto inline-flex min-w-5 items-center justify-center rounded-full bg-white px-1.5 py-0.5 text-[10px] font-black text-brand">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span> : null}</Link>;
        })}</nav>
        {canReturn ? <button type="button" onClick={() => { if (returnToAdminSession()) { router.replace("/admin/sellers"); router.refresh(); } }} className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-black text-zinc-950"><RotateCcw className="h-4 w-4" />{ar ? "العودة للإدارة" : "Return to admin"}</button> : null}
        <button type="button" onClick={() => { clearSession(); router.replace("/seller/login"); }} className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-bold text-red-600"><LogOut className="h-4 w-4" />{ar ? "تسجيل الخروج" : "Log out"}</button>
      </aside>
      <main className="min-w-0 max-w-full overflow-visible">{children}</main>
    </div>
  </div>;
}
