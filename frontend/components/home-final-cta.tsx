"use client";

import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/lib/company";
import { useLanguage } from "@/lib/site-language";

export function HomeFinalCta() {
  const { language, t } = useLanguage();

  return (
    <section className="section-spacing bg-white">
      <div className="container-premium">
        <div className="rounded-2xl border border-zinc-200 bg-zinc-950 px-6 py-10 text-white shadow-sm sm:px-8 lg:flex lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              {t.finalTitle}
            </h2>
            <p className="mt-4 text-sm leading-7 text-zinc-300 sm:text-base">
              {t.finalText}
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row lg:mt-0">
            <Link
              href="/catalogue"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-100"
            >
              {t.inventory}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <a
              href={buildWhatsAppUrl(language === "ar" ? "مرحباً، أود التحدث عن إحدى السيارات المتوفرة." : "Hello, I would like to talk about one of the available cars.")}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
            >
              <MessageCircle className="h-4 w-4" />
              {t.whatsapp}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
