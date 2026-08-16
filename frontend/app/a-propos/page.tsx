import type { Metadata } from "next";
import { MessageCircle, ShieldCheck, Truck } from "lucide-react";
import { COMPANY_NAME, COMPANY_SUBTITLE, buildWhatsAppUrl } from "@/lib/company";

export const metadata: Metadata = {
  title: `من نحن | ${COMPANY_NAME}`,
  description:
    "تعرف على ALHADUNICARS وخدمات المعاينة، التوثيق والشحن للسيارات والمركبات التجارية."
};

export default function AboutPage() {
  return (
    <div className="container-premium section-spacing">
      <div className="mx-auto max-w-4xl">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">من نحن</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">{COMPANY_NAME}، {COMPANY_SUBTITLE}</h1>
        <p className="mt-6 text-lg text-zinc-500">
          نساعد المشترين والمهنيين على اختيار المركبة المناسبة، التثبت من حالتها، واستكمال العملية من دبي إلى حين الاستلام.
        </p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <Truck className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">عرض موجّه</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            نركز على السيارات والمركبات المطلوبة فعليًا مع اهتمام حقيقي بحاجيات السوق والعميل.
          </p>
        </article>
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <ShieldCheck className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">منهجية واضحة</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            معاينة، وثائق، فاتورة رسمية ومتابعة تقلّل المخاطر وتخلي القرار أوضح.
          </p>
        </article>
        <article className="rounded-[28px] border bg-white p-6 shadow-premium dark:bg-zinc-900">
          <MessageCircle className="h-8 w-8 text-brand" />
          <h2 className="mt-4 text-2xl font-bold">تواصل مباشر</h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 dark:text-zinc-300">
            واتساب هو القناة الأسرع لتأكيد التفاصيل، تبادل الصور، ومتابعة الملف خطوة بخطوة.
          </p>
        </article>
      </div>

      <a
        href={buildWhatsAppUrl(
          "مرحبًا، أريد مناقشة احتياجي بخصوص سيارة أو مركبة."
        )}
        target="_blank"
        rel="noreferrer"
        className="mt-10 inline-flex items-center gap-2 rounded-2xl bg-green-500 px-5 py-4 font-semibold text-white transition hover:-translate-y-0.5"
      >
        <MessageCircle className="h-4 w-4" />
        تواصل مع فريقنا
      </a>
    </div>
  );
}
