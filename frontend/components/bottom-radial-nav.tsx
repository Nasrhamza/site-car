"use client";

import Link from "next/link";
import { BookOpen, CarFront, Home, MessageCircle, Store, UserCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { getStoredUser, isAdminRole, isSellerRole, type StoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

export function BottomRadialNav() {
  const pathname = usePathname();
  const { language } = useLanguage();
  const [user, setUser] = useState<StoredUser | null>(null);

  useEffect(() => {
    const syncSession = () => setUser(getStoredUser());
    syncSession();
    window.addEventListener("storage", syncSession);
    return () => window.removeEventListener("storage", syncSession);
  }, [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/voitures/") || pathname === "/login") return null;

  const accountHref = user && isAdminRole(user.role) ? "/admin" : user && isSellerRole(user.role) ? "/seller" : null;
  const ar = language === "ar";
  const items = [
    { label: ar ? "الرئيسية" : "Home", icon: Home, href: "/" },
    { label: ar ? "السيارات" : "Cars", icon: CarFront, href: "/catalogue" },
    { label: ar ? "الدليل" : "Guide", icon: BookOpen, href: "/guide" },
    { label: accountHref ? (ar ? "حسابي" : "Account") : (ar ? "بيع سيارتك" : "Sell with us"), icon: accountHref ? UserCircle : Store, href: accountHref || "/seller/request-account" },
    { label: ar ? "تواصل" : "Contact", icon: MessageCircle, href: "/contact" }
  ];

  return <nav aria-label={ar ? "التنقل السريع" : "Quick navigation"} className="site-floating-navigation fixed inset-x-4 z-[70] mx-auto grid max-w-[34rem] grid-cols-5 items-center gap-1 rounded-full border border-white/35 px-3 py-2 text-white sm:px-5 sm:py-3">
    {items.map(({ label, icon: Icon, href }) => {
      const active = href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`) || (href === "/catalogue" && pathname.startsWith("/categorie/"));
      return <Link key={href} href={href} aria-label={label} aria-current={active ? "page" : undefined} className={cn("group relative flex h-12 min-w-0 items-center justify-center rounded-full outline-none transition duration-200 hover:-translate-y-0.5 hover:bg-white/10 focus-visible:bg-white/15 focus-visible:ring-2 focus-visible:ring-white/80 motion-reduce:transform-none motion-reduce:transition-none", active ? "bg-white/10 text-white" : "text-white/85 hover:text-white")}>
        <Icon aria-hidden="true" className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.65} />
        {active && <span aria-hidden="true" className="absolute bottom-0.5 h-1 w-1 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,.75)]" />}
        <span aria-hidden="true" className="pointer-events-none absolute bottom-full mb-4 whitespace-nowrap rounded-xl border border-white/15 bg-zinc-950/95 px-3 py-1.5 text-xs font-medium opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">{label}</span>
      </Link>;
    })}
  </nav>;
}
