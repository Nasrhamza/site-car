"use client";

import Link from "next/link";
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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/cars", label: "Produits", icon: CarFront },
  { href: "/admin/cars/new", label: "Ajouter", icon: PlusCircle },
  { href: "/admin/requests", label: "Notifications", icon: MessageSquareText },
  { href: "/admin/settings", label: "Mot de passe", icon: Settings }
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
    return <div className="container-premium py-16 text-sm text-zinc-500">Chargement de l&apos;espace admin...</div>;
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950">
      <div className="container-premium grid gap-6 py-6 lg:grid-cols-[280px_1fr]">
        <aside className="rounded-[28px] border border-zinc-200/70 bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900 lg:sticky lg:top-6 lg:h-fit">
          <div className="rounded-3xl bg-zinc-950 px-4 py-5 text-white dark:bg-white dark:text-zinc-950">
            <BrandLogo className="h-[64px] w-[210px]" />
            <h2 className="mt-3 text-xl font-bold">Espace administration</h2>
            <p className="mt-2 text-sm text-white/70 dark:text-zinc-600">Connecte en tant que {user?.name || user?.email}</p>
          </div>

          <nav className="mt-4 grid gap-2">
            {links.map((link) => {
              const Icon = link.icon;
              const active = pathname === link.href || pathname?.startsWith(`${link.href}/`);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "inline-flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition",
                    active
                      ? "bg-brand text-white shadow-lg"
                      : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-200 dark:hover:bg-white/10"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {link.label}
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
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-red-200 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:border-red-500/30 dark:text-red-300 dark:hover:bg-red-500/10"
          >
            <LogOut className="h-4 w-4" />
            Deconnexion
          </button>
        </aside>

        <main>{children}</main>
      </div>
    </div>
  );
}
