const items = [
  { name: "Sonia", text: "Equipe tres reactive, documents clairs et accompagnement rassurant jusqu'a la conclusion." },
  { name: "Karim", text: "Le vehicule correspondait a la description et le suivi WhatsApp a fait gagner un temps precieux." },
  { name: "Amira", text: "Process import bien organise, expedition suivie et communication professionnelle du debut a la livraison." }
];

export function Testimonials({ compact = false }: { compact?: boolean }) {
  const content = (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <article key={item.name} className="rounded-3xl border bg-white p-6 shadow-premium dark:bg-zinc-900 sm:p-8">
          <p className="text-sm text-zinc-600 dark:text-zinc-300 sm:text-base">
            &quot;{item.text}&quot;
          </p>
          <p className="mt-6 font-semibold">{item.name}</p>
        </article>
      ))}
    </div>
  );

  if (compact) return content;

  return (
    <section className="section-spacing bg-zinc-50 dark:bg-zinc-900/40">
      <div className="container-premium">
        <div className="mb-12 text-center">
          <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">Avis clients</p>
          <h2 className="mt-3 font-serif text-4xl font-bold">Ils nous font confiance</h2>
        </div>
        {content}
      </div>
    </section>
  );
}
