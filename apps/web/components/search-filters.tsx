"use client";

import { useEffect, useMemo, useState } from "react";
import { categories } from "@/lib/data";
import { Grid2X2, List, Search, SlidersHorizontal, RotateCcw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { FUEL_TYPE_OPTIONS } from "@/lib/company";

type Params = Record<string, any>;

export function SearchFilters({
  params,
  setParams,
  view,
  setView,
  total,
  suggestions = []
}: {
  params: Params;
  setParams: (value: Params | ((prev: Params) => Params)) => void;
  view: "grid" | "list";
  setView: (view: "grid" | "list") => void;
  total: number;
  suggestions?: string[];
}) {
  const [search, setSearch] = useState(params.search || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSearch(params.search || "");
  }, [params.search]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setParams((prev: Params) => ({ ...prev, page: 1, search }));
    }, 300);

    return () => clearTimeout(timer);
  }, [search, setParams]);

  const activeFilters = useMemo(
    () =>
      [
        params.category,
        params.fuelType,
        params.sort !== "-createdAt" ? params.sort : "",
        params.minPrice,
        params.maxPrice
      ].filter(Boolean).length,
    [params.category, params.fuelType, params.sort, params.minPrice, params.maxPrice]
  );

  const resetFilters = () => {
    setSearch("");
    setParams((prev: Params) => ({
      ...prev,
      page: 1,
      search: "",
      category: "",
      fuelType: "",
      minPrice: "",
      maxPrice: "",
      sort: "-createdAt"
    }));
  };

  return (
    <div className="rounded-[28px] border border-zinc-200/70 bg-white p-4 shadow-premium dark:border-white/10 dark:bg-zinc-900 sm:p-5">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Recherche live : categorie, marque, modele..."
              className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 py-3 pl-11 pr-4 outline-none transition focus:border-brand dark:border-white/10 dark:bg-white/5"
              list="catalogue-suggestions"
            />
            <datalist id="catalogue-suggestions">
              {suggestions.map((item) => <option key={item} value={item} />)}
            </datalist>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:w-auto">
            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filtres {activeFilters > 0 ? `(${activeFilters})` : ""}
            </button>
            <button onClick={() => setView("grid")} className={`rounded-2xl border p-3 ${view === "grid" ? "bg-brand text-white" : ""}`}>
              <Grid2X2 className="mx-auto h-4 w-4" />
            </button>
            <button onClick={() => setView("list")} className={`rounded-2xl border p-3 ${view === "list" ? "bg-brand text-white" : ""}`}>
              <List className="mx-auto h-4 w-4" />
            </button>
            <button onClick={resetFilters} className="inline-flex items-center justify-center gap-2 rounded-2xl border px-4 py-3 text-sm font-semibold">
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-sm text-zinc-500 dark:text-zinc-400">
          <span>{total} vehicule(s) trouves</span>
          {search && <span className="rounded-full bg-brand/10 px-3 py-1 text-brand">Recherche : {search}</span>}
          {params.category && <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">{params.category}</span>}
          {params.fuelType && <span className="rounded-full bg-zinc-100 px-3 py-1 dark:bg-white/5">{params.fuelType}</span>}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setParams((prev: Params) => ({ ...prev, page: 1, category: "" }))}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              !params.category
                ? "bg-brand text-white"
                : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-200"
            }`}
          >
            Toutes
          </button>
          {categories.map((category) => (
            <button
              key={category.name}
              type="button"
              onClick={() => setParams((prev: Params) => ({ ...prev, page: 1, category: category.name }))}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                params.category === category.name
                  ? "bg-brand text-white"
                  : "bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:bg-white/5 dark:text-zinc-200"
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        <AnimatePresence initial={false}>
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: mobileOpen ? "auto" : 0, opacity: mobileOpen ? 1 : 0 }}
            className="overflow-hidden lg:!h-auto lg:!opacity-100"
          >
            <div className="grid gap-4 pt-2 md:grid-cols-2 xl:grid-cols-5 lg:pt-0">
              <select
                value={params.category || ""}
                onChange={(e) => setParams((prev: Params) => ({ ...prev, page: 1, category: e.target.value }))}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none"
              >
                <option value="">Toutes categories</option>
                {categories.map((category) => <option key={category.name}>{category.name}</option>)}
              </select>

              <select
                value={params.fuelType || ""}
                onChange={(e) => setParams((prev: Params) => ({ ...prev, page: 1, fuelType: e.target.value }))}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none"
              >
                <option value="">Tous carburants</option>
                {FUEL_TYPE_OPTIONS.map((fuelType) => (
                  <option key={fuelType} value={fuelType}>{fuelType}</option>
                ))}
              </select>

              <input
                type="number"
                min={0}
                value={params.minPrice || ""}
                onChange={(e) => setParams((prev: Params) => ({ ...prev, page: 1, minPrice: e.target.value }))}
                placeholder="Prix min"
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none"
              />

              <input
                type="number"
                min={0}
                value={params.maxPrice || ""}
                onChange={(e) => setParams((prev: Params) => ({ ...prev, page: 1, maxPrice: e.target.value }))}
                placeholder="Prix max"
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none"
              />

              <select
                value={params.sort || "-createdAt"}
                onChange={(e) => setParams((prev: Params) => ({ ...prev, page: 1, sort: e.target.value }))}
                className="rounded-2xl border bg-transparent px-4 py-3 outline-none"
              >
                <option value="-createdAt">Plus recent</option>
                <option value="price">Prix croissant</option>
                <option value="-price">Prix decroissant</option>
                <option value="-views">Plus populaire</option>
              </select>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
