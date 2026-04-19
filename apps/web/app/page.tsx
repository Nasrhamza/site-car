import Link from "next/link";
import { Hero } from "@/components/hero";
import { FeaturedCars } from "@/components/featured-cars";
import { CounterSection } from "@/components/counter-section";
import { Testimonials } from "@/components/testimonials";
import { GuidePreview } from "@/components/guide-preview";
import { categories } from "@/lib/data";
import { CarFront, ArrowRight } from "lucide-react";
import { getCategorySlug } from "@/lib/company";

export const dynamic = "force-dynamic";

export default function HomePage() {
  return (
    <>
      <Hero />

      <section className="relative z-10 mt-6 pb-2 sm:mt-8 sm:pb-4">
        <div className="container-premium">
          <div className="overflow-x-auto pb-2">
            <div className="flex min-w-max gap-3">
              {categories.map((category) => (
                <Link
                  key={category.name}
                  href={`/categorie/${getCategorySlug(category.name)}`}
                  className="inline-flex items-center gap-2 rounded-full border border-zinc-200/70 bg-white px-4 py-3 text-sm font-semibold shadow-premium transition hover:-translate-y-0.5 dark:border-white/10 dark:bg-zinc-900"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-brand">
                    <CarFront className="h-4 w-4" />
                  </span>
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <FeaturedCars />
      <CounterSection />

      <section className="section-spacing bg-zinc-50 py-10 dark:bg-zinc-900/40 sm:py-14">
        <div className="container-premium">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <div>
              <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm">
                Avis clients
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Ce que disent nos clients
              </h2>
            </div>

            <Link
              href="/contact"
              className="hidden items-center gap-2 text-sm font-semibold text-brand sm:inline-flex"
            >
              Nous contacter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <Testimonials compact />
        </div>
      </section>

      <section className="section-spacing pt-10 sm:pt-14">
        <div className="container-premium">
          <div className="mb-6 flex items-center justify-between gap-4 sm:mb-8">
            <div>
              <p className="gradient-text text-xs font-semibold uppercase tracking-[0.3em] sm:text-sm">
                Conseils metier
              </p>
              <h2 className="mt-2 font-serif text-3xl font-bold sm:text-4xl">
                Guide
              </h2>
            </div>

            <Link
              href="/guide"
              className="hidden items-center gap-2 text-sm font-semibold text-brand sm:inline-flex"
            >
              Voir les guides
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <GuidePreview />
        </div>
      </section>
    </>
  );
}
