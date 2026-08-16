"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { DEFAULT_AED_TO_TND_RATE } from "@/lib/utils";

type ExchangeRateState = {
  rate: number;
  date: string | null;
  source: string;
  sourceUrl: string | null;
  stale: boolean;
};

let sharedRate: ExchangeRateState | null = null;
let pendingRequest: Promise<ExchangeRateState> | null = null;

function loadRate() {
  if (sharedRate) return Promise.resolve(sharedRate);
  if (pendingRequest) return pendingRequest;

  pendingRequest = api
    .get("/exchange-rates/aed-tnd")
    .then(({ data }) => {
      const rate = Number(data?.rate);
      sharedRate = {
        rate: Number.isFinite(rate) && rate > 0 ? rate : DEFAULT_AED_TO_TND_RATE,
        date: data?.date || null,
        source: data?.source || "fallback",
        sourceUrl: data?.sourceUrl || null,
        stale: Boolean(data?.stale)
      };
      return sharedRate;
    })
    .catch(() => ({
      rate: DEFAULT_AED_TO_TND_RATE,
      date: null,
      source: "fallback",
      sourceUrl: null,
      stale: true
    }))
    .finally(() => {
      pendingRequest = null;
    });

  return pendingRequest;
}

export function useAedToTndRate() {
  const [exchange, setExchange] = useState<ExchangeRateState>(
    sharedRate || {
      rate: DEFAULT_AED_TO_TND_RATE,
      date: null,
      source: "loading",
      sourceUrl: null,
      stale: false
    }
  );

  useEffect(() => {
    let active = true;
    loadRate().then((next) => {
      if (active) setExchange(next);
    });
    return () => {
      active = false;
    };
  }, []);

  return exchange;
}
