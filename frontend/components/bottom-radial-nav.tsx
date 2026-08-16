"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CarFront, Home, Menu, MessageCircle, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/site-language";

const positions = [
  { x: -88, y: -38 },
  { x: -56, y: -80 },
  { x: 0, y: -100 },
  { x: 56, y: -80 },
  { x: 88, y: -38 }
];

export function BottomRadialNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { language } = useLanguage();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  if (pathname.startsWith("/admin") || pathname.startsWith("/voitures/") || pathname === "/login") return null;

  const items = [
    {
      label: language === "ar" ? "رجوع" : "Back",
      icon: ArrowLeft,
      action: () => {
        setOpen(false);
        router.back();
      }
    },
    { label: language === "ar" ? "الرئيسية" : "Home", icon: Home, href: "/" },
    { label: language === "ar" ? "السيارات" : "Cars", icon: CarFront, href: "/catalogue" },
    { label: language === "ar" ? "الدليل" : "Guide", icon: BookOpen, href: "/guide" },
    { label: language === "ar" ? "تواصل" : "Contact", icon: MessageCircle, href: "/contact" }
  ];

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-3 z-[70] flex justify-center sm:bottom-4">
      <div className="relative h-[66px] w-[240px]">
        <motion.div
          aria-hidden="true"
          className="absolute bottom-[-7px] left-1/2 z-[5] h-[132px] w-[226px] border border-white/90 bg-white/85 shadow-[0_18px_55px_rgba(15,23,42,.16)] backdrop-blur-xl"
          style={{ marginLeft: -113, borderRadius: "120px 120px 28px 28px" }}
          initial={false}
          animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0.72, y: open ? 0 : 20 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
        >
          <span className="absolute inset-x-10 top-2 h-px bg-gradient-to-r from-transparent via-brand/60 to-transparent" />
        </motion.div>

        {items.map((item, index) => {
          const Icon = item.icon;
          const position = positions[index];
          const active = Boolean(item.href) && (pathname === item.href || (item.href === "/catalogue" && pathname.startsWith("/voitures/")));
          const commonClass = cn(
            open ? "pointer-events-auto" : "pointer-events-none",
            "group relative flex h-full w-full items-center justify-center rounded-full border shadow-[0_8px_24px_rgba(15,23,42,.14)] outline-none transition-all hover:-translate-y-0.5 focus-visible:ring-4 focus-visible:ring-brand/30",
            active
              ? "border-brand bg-brand text-white shadow-[0_10px_28px_rgba(202,17,38,.3)]"
              : "border-zinc-200/80 bg-white text-zinc-700 hover:border-brand/40 hover:text-brand dark:border-white/10 dark:bg-zinc-900 dark:text-white"
          );
          const content = (
            <>
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute top-[52px] whitespace-nowrap rounded-full bg-zinc-950/90 px-2 py-1 text-[10px] font-semibold text-white opacity-0 shadow-lg transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                {item.label}
              </span>
            </>
          );

          return (
            <motion.div
              key={item.label}
              className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-12 w-12"
              style={{ marginLeft: -24 }}
              initial={false}
              animate={{
                x: open ? position.x : 0,
                y: open ? position.y : 0,
                opacity: open ? 1 : 0,
                scale: open ? 1 : 0.55
              }}
              transition={{
                type: "spring",
                stiffness: 340,
                damping: 24,
                delay: open ? index * 0.035 : (items.length - index - 1) * 0.015
              }}
            >
              {item.href ? (
                <Link href={item.href} onClick={() => setOpen(false)} className={commonClass} aria-label={item.label} tabIndex={open ? 0 : -1}>
                  {content}
                </Link>
              ) : (
                <button type="button" onClick={item.action} className={commonClass} aria-label={item.label} tabIndex={open ? 0 : -1}>
                  {content}
                </button>
              )}
            </motion.div>
          );
        })}

        <motion.button
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-label={
            open
              ? language === "ar" ? "إغلاق التنقل السريع" : "Close quick navigation"
              : language === "ar" ? "فتح التنقل السريع" : "Open quick navigation"
          }
          className="pointer-events-auto absolute bottom-0 left-1/2 z-20 flex h-[60px] w-[60px] items-center justify-center rounded-full border-4 border-white bg-zinc-950 text-white shadow-[0_14px_38px_rgba(0,0,0,.26)]"
          style={{ marginLeft: -30 }}
          animate={{ rotate: open ? 90 : 0, scale: open ? 0.96 : 1 }}
          whileTap={{ scale: 0.9 }}
          transition={{ type: "spring", stiffness: 360, damping: 22 }}
        >
          <span className="absolute inset-1 rounded-full border border-white/10" />
          <span className="absolute top-1.5 h-1.5 w-1.5 rounded-full bg-brand shadow-[0_0_12px_rgba(204,18,36,.9)]" />
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </motion.button>
      </div>
    </div>
  );
}
