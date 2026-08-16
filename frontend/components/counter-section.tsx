import { Clock3, Globe2, ShieldCheck, Sparkles } from "lucide-react";

const stats = [
  {
    value: "100+",
    label: "Listings organized and ready to scan",
    icon: Sparkles
  },
  {
    value: "24/7",
    label: "Website access for browsing anytime",
    icon: Globe2
  },
  {
    value: "< 1h",
    label: "Typical first reply for direct inquiries",
    icon: Clock3
  },
  {
    value: "Clear",
    label: "Vehicle details laid out in a familiar format",
    icon: ShieldCheck
  }
];

export function CounterSection() {
  return (
    <section className="section-spacing bg-white">
      <div className="container-premium">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Quick facts
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            Small details that make the site easier to use
          </h2>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 shadow-sm">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-brand shadow-sm">
                    <Icon className="h-5 w-5" />
                  </div>
                  <p className="text-3xl font-bold text-zinc-950">{item.value}</p>
                </div>
                <p className="mt-4 text-sm leading-7 text-zinc-600">{item.label}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
