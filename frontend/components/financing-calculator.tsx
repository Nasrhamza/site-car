"use client";

// Calculateur de mensualité simple.
import { useMemo, useState } from "react";
import { currency } from "@/lib/utils";

export function FinancingCalculator({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(Math.floor(price * 0.2));
  const [months, setMonths] = useState(48);

  const monthly = useMemo(() => {
    const financed = Math.max(price - downPayment, 0);
    const rate = 0.08 / 12;
    return financed > 0 ? (financed * rate) / (1 - Math.pow(1 + rate, -months)) : 0;
  }, [price, downPayment, months]);

  return (
    <div className="rounded-3xl border bg-white p-6 shadow-premium dark:bg-zinc-900">
      <h3 className="text-xl font-bold">Calculateur de financement</h3>
      <div className="mt-5 grid gap-4">
        <label className="text-sm">
          Apport
          <input type="range" min={0} max={price} step={1000} value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="mt-2 w-full" />
          <span className="mt-1 block font-semibold">{currency(downPayment)}</span>
        </label>
        <label className="text-sm">
          Durée
          <input type="range" min={12} max={84} step={12} value={months} onChange={(e) => setMonths(Number(e.target.value))} className="mt-2 w-full" />
          <span className="mt-1 block font-semibold">{months} mois</span>
        </label>
        <div className="rounded-2xl bg-brand/10 p-4">
          <p className="text-sm text-zinc-500">Mensualité estimée</p>
          <p className="text-3xl font-extrabold text-brand">{currency(monthly)}</p>
        </div>
      </div>
    </div>
  );
}
