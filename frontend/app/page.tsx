import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Hero } from "@/components/hero";
import { FeaturedCars } from "@/components/featured-cars";
import { CounterSection } from "@/components/counter-section";
import { Testimonials } from "@/components/testimonials";
import { GuidePreview } from "@/components/guide-preview";
import { HomeCategories } from "@/components/home-categories";
import { HomeImpact } from "@/components/home-impact";
import { HomeProcess } from "@/components/home-process";
import { HomeTrust } from "@/components/home-trust";
import { HomeFinalCta } from "@/components/home-final-cta";
import { api } from "@/lib/api";

export const dynamic = "force-dynamic";

async function getHomeCars() {
  try {
    const { data } = await api.get("/cars/featured");
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error("Erreur chargement home cars:", error);
    return [];
  }
}

export default async function HomePage() {
  const cars = await getHomeCars();

  return (
    <>
      <Hero cars={cars} />
      <HomeImpact />
      <HomeCategories />
      <FeaturedCars cars={cars} />
      <CounterSection />
      <HomeProcess />
      <HomeTrust />

      <section className="section-spacing bg-zinc-50 py-10 transition-colors dark:bg-zinc-950 sm:py-14">
        <div className="container-premium">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <div>
              <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm">
                تجارب العملاء
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight transition-colors dark:text-white sm:text-4xl lg:text-5xl">
                آراء تعكس الثقة في التجربة كاملة
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
                من أول رسالة إلى آخر خطوة في الاستلام، هدفنا أن تكون التجربة واضحة ومطمئنة وسهلة.
              </p>
            </div>

            <Link
              href="/contact"
              className="hidden items-center gap-2 text-sm font-semibold text-brand transition hover:gap-3 sm:inline-flex"
            >
              تحدث مع الفريق
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Testimonials compact />
        </div>
      </section>

      <section className="section-spacing pt-10 transition-colors dark:bg-zinc-950 sm:pt-14">
        <div className="container-premium">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <div>
              <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm">
                دليل عملي
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight transition-colors dark:text-white sm:text-4xl lg:text-5xl">
                افهم المسار قبل أن تبدأ
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-600 transition-colors dark:text-zinc-300 sm:text-base">
                محتوى مختصر وعملي يشرح لك كيف تتم المعاينة، التأكيد، والشحن بخطوات واضحة.
              </p>
            </div>

            <Link
              href="/guide"
              className="hidden items-center gap-2 text-sm font-semibold text-brand transition hover:gap-3 sm:inline-flex"
            >
              افتح الدليل
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <GuidePreview />
        </div>
      </section>

      <HomeFinalCta />
    </>
  );
}
