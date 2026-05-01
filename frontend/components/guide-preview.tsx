import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { BrandLogo } from "@/components/brand-logo";
import { Reveal } from "@/components/reveal";
import { GUIDE_PAGES, buildWhatsAppUrl } from "@/lib/company";

export function GuidePreview() {
  return (
    <div className="grid gap-6">
      {GUIDE_PAGES.map((guide, index) => (
        <Reveal key={guide.slug} delay={0.06 * index}>
          <article className="overflow-hidden rounded-[32px] border border-zinc-200/70 bg-white/95 shadow-premium transition-colors dark:border-white/10 dark:bg-zinc-900/95 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)]">
            <div className="relative flex h-52 items-center justify-center overflow-hidden bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-800">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.28),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.18),transparent_36%)]" />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent" />
              <BrandLogo className="relative z-10 h-28 w-28 sm:h-32 sm:w-32" priority />
            </div>

            <div className="p-6 sm:p-8">
              <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em]">
                {guide.eyebrow}
              </p>
              <h3 className="mt-3 text-2xl font-bold tracking-tight text-zinc-950 transition-colors dark:text-white sm:text-3xl">
                {guide.title}
              </h3>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
                {guide.description}
              </p>

              <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-500 transition-colors dark:text-zinc-300">
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  6 خطوات واضحة
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  مناسب للجوال
                </span>
                <span className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 dark:border-white/10 dark:bg-white/5">
                  واتساب مباشر
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href={`/guide/${guide.slug}`}
                  className="button-glow inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-brand"
                >
                  اقرأ الدليل
                  <ArrowRight className="h-4 w-4" />
                </Link>

                <a
                  href={buildWhatsAppUrl(guide.ctaMessage)}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-2xl border border-green-500/20 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-700 transition hover:-translate-y-0.5 hover:border-green-500/40 hover:bg-green-500/15"
                >
                  <MessageCircle className="h-4 w-4" />
                  واتساب
                </a>
              </div>
            </div>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
