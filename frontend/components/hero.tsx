import Link from "next/link";
import { ArrowUpLeft, CheckCircle2, MessageCircle, Sparkles, Zap } from "lucide-react";
import { HomeAutoShowcase } from "@/components/home-auto-showcase";
import { Reveal } from "@/components/reveal";
import { buildWhatsAppUrl } from "@/lib/company";

type HeroCar = {
  _id?: string;
  slug?: string;
  name?: string;
  brand?: string;
  category?: string;
  price?: number;
  images?: Array<{ url?: string; alt?: string }>;
};

const trustItems = [
  "معاينة موثقة قبل القرار",
  "تواصل مباشر وسريع",
  "متابعة الشحن حتى الاستلام"
];

const quickStats = [
  { value: "+100", label: "عميل وثق بنا" },
  { value: "12+", label: "وجهة شحن" },
  { value: "48h", label: "متوسط الرد" },
  { value: "24/7", label: "متابعة واتساب" }
];

const marqueeItems = [
  "سيارات مختارة",
  "شاحنات وآليات",
  "ملف واضح",
  "معاينة موثقة",
  "شحن آمن",
  "دعم مباشر"
];

export function Hero({ cars = [] }: { cars?: HeroCar[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-[#fbfaf8] pt-6 transition-colors dark:bg-zinc-950 sm:pt-8 lg:pt-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_8%,rgba(193,18,31,0.16),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(212,175,55,0.16),transparent_22%),linear-gradient(180deg,#ffffff_0%,#fff8f3_42%,#ffffff_100%)] dark:bg-[radial-gradient(circle_at_12%_8%,rgba(193,18,31,0.22),transparent_24%),radial-gradient(circle_at_88%_18%,rgba(212,175,55,0.12),transparent_22%),linear-gradient(180deg,#09090b_0%,#18181b_48%,#09090b_100%)]" />
      <div className="pointer-events-none absolute right-[-8rem] top-16 -z-10 h-80 w-80 rounded-full bg-brand/10 blur-3xl" />
      <div className="pointer-events-none absolute left-[-7rem] bottom-10 -z-10 h-72 w-72 rounded-full bg-brand-gold/10 blur-3xl" />

      <div className="container-premium">
        <div className="animated-border-glow premium-grid relative overflow-hidden rounded-[34px] bg-zinc-950 text-white">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.42),transparent_32%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.24),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.08),transparent_44%)]" />
          <div className="absolute -right-24 top-0 h-56 w-56 rounded-full border border-white/10" />
          <div className="absolute -left-16 bottom-0 h-44 w-44 rounded-full border border-brand-gold/20" />

          <div
            dir="ltr"
            className="relative grid min-h-[680px] items-center gap-8 p-5 sm:p-7 lg:grid-cols-[minmax(0,1.02fr)_minmax(420px,0.98fr)] lg:p-10 xl:min-h-[720px]"
          >
            <div dir="rtl" className="min-w-0">
              <Reveal className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur">
                <Sparkles className="h-4 w-4 text-brand-gold" />
                تجربة شراء راقية، واضحة، وسريعة التنفيذ
              </Reveal>

              <Reveal delay={0.05} className="mt-7">
                <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl xl:text-[4.7rem]">
                  اختر مركبتك بثقة، ودع التفاصيل علينا.
                </h1>

                <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">
                  ALHADUNI CARS تعرض المركبات بشكل احترافي: صور واضحة، تفاصيل دقيقة،
                  تواصل مباشر، ومتابعة منظمة من أول اختيار حتى الشحن والاستلام.
                </p>
              </Reveal>

              <Reveal delay={0.12} className="mt-7 flex flex-wrap gap-2">
                {trustItems.map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80 backdrop-blur"
                  >
                    <CheckCircle2 className="h-3.5 w-3.5 text-brand-gold" />
                    {item}
                  </span>
                ))}
              </Reveal>

              <Reveal delay={0.18} className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <Link
                  href="/catalogue"
                  className="premium-shine button-glow inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-bold text-zinc-950 transition hover:-translate-y-1 hover:bg-brand hover:text-white"
                >
                  تصفح المركبات المتاحة
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>

                <a
                  href={buildWhatsAppUrl("مرحبا، أريد مساعدة لاختيار مركبة مناسبة من ALHADUNI CARS.")}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-green-400/25 bg-green-400/10 px-6 py-4 text-sm font-bold text-green-100 backdrop-blur transition hover:-translate-y-1 hover:bg-green-400/20"
                >
                  <MessageCircle className="h-4 w-4" />
                  تحدث معنا الآن
                </a>
              </Reveal>

              <Reveal delay={0.24} className="mt-8 grid max-w-3xl grid-cols-2 gap-3 sm:grid-cols-4">
                {quickStats.map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-4 backdrop-blur transition hover:-translate-y-1 hover:bg-white/15"
                  >
                    <p className="text-2xl font-black text-white sm:text-3xl">{stat.value}</p>
                    <p className="mt-1 text-xs font-semibold text-zinc-300">{stat.label}</p>
                  </div>
                ))}
              </Reveal>
            </div>

            <Reveal delay={0.12} className="min-w-0">
              <HomeAutoShowcase cars={cars} />
            </Reveal>
          </div>

          <div className="relative border-t border-white/10 bg-black/20 py-4">
            <div className="animate-marquee-rtl flex w-max gap-4 whitespace-nowrap px-4 text-sm font-semibold text-white/70">
              {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex items-center gap-3">
                  <Zap className="h-4 w-4 text-brand-gold" />
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
