import Link from "next/link";
import { ArrowRight, CarFront, CreditCard, Search, ShieldCheck } from "lucide-react";

const quickActions = [
  {
    title: "Browse inventory",
    description: "Open the full catalogue and start from the standard list view.",
    href: "/catalogue",
    icon: Search
  },
  {
    title: "Latest arrivals",
    description: "Jump straight to the newest cars added to the site.",
    href: "/catalogue?sort=-createdAt",
    icon: CarFront
  },
  {
    title: "Financing",
    description: "Check the financing page before you contact the team.",
    href: "/financement",
    icon: CreditCard
  },
  {
    title: "Trusted support",
    description: "Get direct help with availability, documents, and delivery.",
    href: "/contact",
    icon: ShieldCheck
  }
];

export function HomeCategories() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-premium">
        <div className="mb-6 max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Quick access
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            A simple set of shortcuts to move faster
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-600 sm:text-base">
            Standard websites keep the homepage focused. These links get people to the inventory,
            financing, or support pages without extra visual noise.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {quickActions.map((item) => {
            const Icon = item.icon;

            return (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-zinc-200 bg-zinc-50 p-5 transition hover:-translate-y-1 hover:border-brand hover:bg-white hover:shadow-md"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand">
                  Open
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
