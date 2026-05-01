import { faqs } from "@/lib/data";

export default function FAQPage() {
  return (
    <div className="container-premium section-spacing">
      <div className="mx-auto max-w-3xl">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">FAQ</p>
        <h1 className="mt-3 font-serif text-5xl font-bold">الأسئلة الشائعة</h1>

        <div className="mt-10 grid gap-4">
          {faqs.map((faq) => (
            <details key={faq.q} className="rounded-3xl border bg-white p-6 shadow-premium dark:bg-zinc-900">
              <summary className="cursor-pointer text-lg font-semibold">{faq.q}</summary>
              <p className="mt-4 text-zinc-500">{faq.a}</p>
            </details>
          ))}
        </div>
      </div>
    </div>
  );
}
