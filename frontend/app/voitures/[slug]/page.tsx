import Link from "next/link";
import { notFound } from "next/navigation";
import CarDetailsClient from "./car-details-client";

function apiBase() {
  return (process.env.NEXT_PUBLIC_API_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api").replace(/\/$/, "");
}

async function getCarDetails(slug: string) {
  const response = await fetch(`${apiBase()}/cars/${encodeURIComponent(slug)}`, {
    cache: "no-store"
  });

  if (response.status === 404) return null;
  if (!response.ok) throw new Error("Vehicle details unavailable");
  return response.json();
}

export default async function CarDetailsPage({ params }: { params: { slug: string } }) {
  let data;

  try {
    data = await getCarDetails(params.slug);
  } catch {
    return (
      <div className="container-premium section-spacing">
        <div className="mx-auto max-w-3xl rounded-[28px] border border-amber-300/60 bg-white p-8 shadow-premium dark:border-amber-500/20 dark:bg-zinc-900">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-brand">Vehicle details</p>
          <h1 className="mt-3 font-serif text-4xl font-bold">Details are temporarily unavailable</h1>
          <p className="mt-4 text-zinc-500">Please try again shortly.</p>
          <Link href="/catalogue" className="mt-6 inline-flex rounded-2xl bg-zinc-950 px-5 py-3 text-sm font-semibold text-white dark:bg-white dark:text-zinc-950">Back to inventory</Link>
        </div>
      </div>
    );
  }

  if (!data) notFound();
  return <CarDetailsClient initialData={data} />;
}
