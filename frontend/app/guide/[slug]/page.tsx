import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  FileText,
  Handshake,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  ShipWheel
} from "lucide-react";
import { COMPANY_NAME, GUIDE_PAGES, getGuideBySlug, buildWhatsAppUrl } from "@/lib/company";

const icons = {
  BadgeCheck,
  FileText,
  Handshake,
  MessageCircle,
  SearchCheck,
  ShieldCheck,
  ShipWheel
};

export async function generateMetadata({
  params
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    return {
      title: `الدليل | ${COMPANY_NAME}`
    };
  }

  return {
    title: `${guide.title} | ${COMPANY_NAME}`,
    description: guide.description
  };
}

export function generateStaticParams() {
  return GUIDE_PAGES.map((guide) => ({ slug: guide.slug }));
}

export default function GuideDetailsPage({
  params
}: {
  params: { slug: string };
}) {
  const guide = getGuideBySlug(params.slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="container-premium section-spacing">
      <section className="rounded-[34px] border border-zinc-200/70 bg-white p-8 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-10">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">
          {guide.eyebrow}
        </p>
        <h1 className="mt-3 max-w-4xl font-serif text-4xl font-bold sm:text-5xl">
          {guide.title}
        </h1>
        <p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-600 dark:text-zinc-300 sm:text-base">
          {guide.description}
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href={buildWhatsAppUrl(guide.ctaMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            تحدث معنا على واتساب
          </a>
          <Link
            href="/catalogue"
            className="inline-flex items-center gap-2 rounded-2xl border border-zinc-200 px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 hover:bg-zinc-50 dark:border-white/10 dark:hover:bg-white/5"
          >
            افتح المعرض
          </Link>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-3">
        {guide.highlights.map((item) => (
          <article
            key={item.title}
            className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900"
          >
            <h2 className="text-xl font-bold">{item.title}</h2>
            <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
              {item.description}
            </p>
          </article>
        ))}
      </section>

      <section className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {guide.steps.map((step, index) => {
          const Icon = icons[step.icon as keyof typeof icons] || ShieldCheck;

          return (
            <article
              key={step.title}
              className="rounded-[28px] border border-zinc-200/70 bg-white p-6 shadow-premium dark:border-white/10 dark:bg-zinc-900"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10 text-brand">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                    الخطوة {index + 1}
                  </p>
                  <h2 className="mt-1 text-xl font-bold">{step.title}</h2>
                </div>
              </div>

              <p className="mt-4 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
                {step.description}
              </p>

              <a
                href={buildWhatsAppUrl(
                  `${guide.ctaMessage}\n\nعندي سؤال على الخطوة ${index + 1}: ${step.title}`
                )}
                target="_blank"
                rel="noreferrer"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400"
              >
                <MessageCircle className="h-4 w-4" />
                اسألنا على واتساب
              </a>
            </article>
          );
        })}
      </section>

      <section className="mt-10 rounded-[30px] border border-zinc-200/70 bg-zinc-950 p-8 text-white shadow-premium sm:p-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/60">
              مرافقة مباشرة
            </p>
            <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
              إذا تحتاج معاينة، فاتورة رسمية أو توضيح في الشحن والوثائق، فريقنا جاهز.
            </h2>
          </div>

          <a
            href={buildWhatsAppUrl(guide.ctaMessage)}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-green-500 px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" />
            تواصل مع ALHADUNI CARS
          </a>
        </div>
      </section>
    </div>
  );
}
