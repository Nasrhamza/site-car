import Image from "next/image";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";
import { GUIDE_PAGES, buildWhatsAppUrl } from "@/lib/company";

export function GuidePreview() {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {GUIDE_PAGES.map((guide) => (
        <article
          key={guide.slug}
          className="overflow-hidden rounded-[30px] border border-zinc-200/70 bg-white shadow-premium dark:border-white/10 dark:bg-zinc-900"
        >
          <div className="relative h-56 bg-zinc-950">
            <Image
              src="/alhaduni-logo.jpg"
              alt={guide.title}
              fill
              className="object-contain p-5"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="p-6 sm:p-7">
            <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em]">
              {guide.eyebrow}
            </p>
            <h3 className="mt-3 text-2xl font-bold">{guide.title}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {guide.description}
            </p>

            <div className="mt-5 flex flex-wrap gap-2 text-xs text-zinc-500 dark:text-zinc-400">
              <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                6 etapes claires
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                WhatsApp direct
              </span>
              <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">
                Mobile friendly
              </span>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/guide/${guide.slug}`}
                className="inline-flex items-center gap-2 rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 dark:bg-white dark:text-zinc-950"
              >
                Lire le guide
                <ArrowRight className="h-4 w-4" />
              </Link>

              <a
                href={buildWhatsAppUrl(guide.ctaMessage)}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-2xl border border-green-500/30 bg-green-500/10 px-5 py-3 text-sm font-semibold text-green-700 transition hover:-translate-y-0.5 dark:text-green-300"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
