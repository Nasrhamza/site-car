import { BadgeCheck, Eye, MessageCircle, ShieldCheck, Truck } from "lucide-react";

const trustPoints = [
  {
    title: "Clear listings",
    description: "Photos, prices, and key specs are shown in one place.",
    icon: Eye
  },
  {
    title: "Transparent details",
    description: "Each car card keeps the core information easy to compare.",
    icon: ShieldCheck
  },
  {
    title: "Direct support",
    description: "WhatsApp contact stays visible for faster follow-up.",
    icon: MessageCircle
  },
  {
    title: "Delivery follow-up",
    description: "The workflow stays organized after the vehicle is chosen.",
    icon: Truck
  }
];

export function HomeTrust() {
  return (
    <section className="section-spacing bg-zinc-50">
      <div className="container-premium grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-zinc-500">
            Why this layout works
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight text-zinc-950 sm:text-4xl">
            A standard structure reduces friction for visitors
          </h2>
          <p className="mt-4 text-sm leading-7 text-zinc-600 sm:text-base">
            We keep the homepage focused on the inventory, the contact route, and a few trust
            signals so visitors do not have to hunt for basic information.
          </p>

          <div className="mt-6 grid gap-3">
            {[
              "Inventory first",
              "Direct contact",
              "Simple navigation",
              "Readable cards"
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3">
                <BadgeCheck className="h-5 w-5 text-brand" />
                <span className="text-sm font-medium text-zinc-800">{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {trustPoints.map((item) => {
            const Icon = item.icon;

            return (
              <article key={item.title} className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-950 text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-zinc-950">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-600">{item.description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
