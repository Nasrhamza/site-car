import Link from "next/link";
import { ArrowUpLeft, MessageCircle } from "lucide-react";
import { Reveal } from "@/components/reveal";
import { buildWhatsAppUrl } from "@/lib/company";

export function HomeFinalCta() {
  return (
    <section className="section-spacing pt-6">
      <div className="container-premium">
        <Reveal className="overflow-hidden rounded-[36px] bg-zinc-950 px-6 py-10 text-white shadow-[0_28px_90px_rgba(9,9,11,0.42)] sm:px-8 lg:px-12 lg:py-14">
          <div className="relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(193,18,31,0.26),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(212,175,55,0.22),transparent_30%)]" />

            <div className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
              <div className="max-w-3xl">
                <p className="text-xs font-semibold uppercase tracking-[0.34em] text-brand-gold">
                  جاهز للخطوة التالية؟
                </p>
                <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                  ابدأ الآن مع فريق يفهم السوق، يوضح التفاصيل، ويتابع معك حتى النهاية
                </h2>
                <p className="mt-5 text-sm leading-7 text-zinc-300 sm:text-base">
                  سواء كنت تبحث عن سيارة، شاحنة، أو آلية عمل، سنساعدك تختار بسرعة وثقة وبأقل تعقيد ممكن.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <Link
                  href="/catalogue"
                  className="button-glow inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-6 py-4 text-sm font-semibold text-zinc-950 transition hover:-translate-y-0.5"
                >
                  ابدأ الآن
                  <ArrowUpLeft className="h-4 w-4" />
                </Link>

                <a
                  href={buildWhatsAppUrl(
                    "مرحبًا، أريد التحدث مع فريق ALHADUNI CARS لاختيار المركبة المناسبة."
                  )}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-6 py-4 text-sm font-semibold text-white backdrop-blur transition hover:-translate-y-0.5 hover:bg-white/14"
                >
                  <MessageCircle className="h-4 w-4" />
                  تواصل معنا
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
