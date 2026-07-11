"use client";

import { useEffect, useMemo, useState } from "react";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { api } from "@/lib/api";
import { CarCard } from "@/components/car-card";
import { SearchFilters } from "@/components/search-filters";

type CatalogueParams = {
  page: number;
  limit: number;
  sort: string;
  search: string;
  category: string;
  fuelType: string;
  minPrice: string;
  maxPrice: string;
};

function parseSearchParams(searchParams: ReadonlyURLSearchParams): CatalogueParams {
  return {
    page: Number(searchParams.get("page") || 1),
    limit: Number(searchParams.get("limit") || 9),
    sort: searchParams.get("sort") || "-createdAt",
    search: searchParams.get("search") || "",
    category: searchParams.get("category") || "",
    fuelType: searchParams.get("fuelType") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || ""
  };
}

function serializeParams(params: CatalogueParams) {
  return JSON.stringify(params);
}

const fallbackCars = [
  { title: "Toyota Corolla", image: "/alhaduni-logo.jpg" },
  { title: "BMW X5", image: "/alhaduni-logo.jpg" },
  { title: "Mercedes C-Class", image: "/alhaduni-logo.jpg" }
];

export default function CataloguePage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const urlParams = useMemo(() => parseSearchParams(searchParams), [searchParams]);

  const [params, setParams] = useState<CatalogueParams>(urlParams);
  const [cars, setCars] = useState<any[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, pages: 1 });
  const [view, setView] = useState<"grid" | "list">("grid");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setParams((prev) => {
      if (serializeParams(prev) === serializeParams(urlParams)) {
        return prev;
      }

      return urlParams;
    });
  }, [urlParams]);

  useEffect(() => {
    const query = new URLSearchParams();

    if (params.page > 1) query.set("page", String(params.page));
    if (params.limit !== 9) query.set("limit", String(params.limit));
    if (params.sort && params.sort !== "-createdAt") query.set("sort", params.sort);
    if (params.search) query.set("search", params.search);
    if (params.category) query.set("category", params.category);
    if (params.fuelType) query.set("fuelType", params.fuelType);
    if (params.minPrice) query.set("minPrice", params.minPrice);
    if (params.maxPrice) query.set("maxPrice", params.maxPrice);

    const nextUrl = query.toString() ? `${pathname}?${query.toString()}` : pathname;
    router.replace(nextUrl, { scroll: false });
  }, [params, pathname, router]);

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    api
      .get("/cars", { params })
      .then(({ data }) => {
        if (!mounted) return;

        setCars((prev) =>
          params.page > 1 ? [...prev, ...data.items] : data.items
        );

        setMeta({
          total: data.total,
          page: data.page,
          pages: data.pages
        });
        setError("");
      })
      .catch((requestError) => {
        console.error("Erreur chargement catalogue :", requestError);
        if (!mounted) return;

        if (params.page === 1) {
          setCars([]);
        }

        setError(
          requestError?.response?.data?.message ||
            "المعرض غير متاح مؤقتًا. حاول مرة أخرى بعد قليل."
        );
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, [params]);

  const suggestions = useMemo(() => {
    const names = cars.flatMap((car) => [car.name, car.brand, car.model]);
    return Array.from(new Set(names)).slice(0, 10);
  }, [cars]);

  return (
    <div className="container-premium section-spacing">
      <div className="mb-10 max-w-3xl">
        <p className="gradient-text text-sm font-semibold uppercase tracking-[0.3em]">المعرض</p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">المركبات المتوفرة لدينا</h1>
      </div>

      <SearchFilters
        params={params}
        setParams={setParams}
        view={view}
        setView={setView}
        total={meta.total}
        suggestions={suggestions}
      />

      {error ? (
        <div className="mt-8 rounded-[28px] border border-amber-300/60 bg-amber-50 p-6 text-amber-900 dark:border-amber-500/20 dark:bg-amber-500/10 dark:text-amber-100">
          <p className="font-semibold">الخدمة غير متاحة مؤقتًا</p>
          <p className="mt-2 text-sm opacity-90">{error}</p>
        </div>
      ) : null}

      {loading ? (
        <div className={`mt-6 grid gap-4 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 6 }).map((_, index) => (
            <div key={index} className="h-[360px] animate-pulse rounded-[24px] border bg-zinc-100 dark:bg-white/5" />
          ))}
        </div>
      ) : (
        <div className={`mt-6 grid gap-4 ${view === "grid" ? "sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4" : "grid-cols-1"}`}>
          {cars.map((car) => <CarCard key={car._id} car={car} variant={view} />)}
        </div>
      )}

      {!loading && cars.length === 0 && !error && (
        <div className="mt-10">
          <div className="mb-4 text-center text-zinc-500 dark:text-zinc-400">
            لا توجد مركبات مطابقة للفلاتر الحالية، لذلك نعرض مثالًا بسيطًا حتى تبقى الصفحة مرئية.
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {fallbackCars.map((car) => (
              <article key={car.title} className="overflow-hidden rounded-[24px] border border-zinc-200 bg-white shadow-sm">
                <div className="relative h-56 bg-zinc-100">
                  <img
                    src={car.image}
                    alt={car.title}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-zinc-950">{car.title}</h3>
                  <p className="mt-1 text-sm text-zinc-500">أضف السيارات من لوحة التحكم ليظهر المخزون الحقيقي هنا.</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      )}

      {meta.page < meta.pages && !loading && !error && (
        <div className="mt-10 text-center">
          <button
            onClick={() => setParams((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="rounded-full bg-brand px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5"
          >
            تحميل المزيد
          </button>
        </div>
      )}
    </div>
  );
}
