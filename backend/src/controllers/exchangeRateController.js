import { env } from "../config/env.js";

const CACHE_TTL_MS = 12 * 60 * 60 * 1000;
let cachedRate = null;

async function fetchJson(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: controller.signal
    });

    if (!response.ok) {
      throw new Error(`Exchange rate provider returned ${response.status}`);
    }

    return response.json();
  } finally {
    clearTimeout(timeout);
  }
}

async function fetchLatestAedToTnd() {
  try {
    const payload = await fetchJson("https://open.er-api.com/v6/latest/AED");
    const rate = Number(payload?.rates?.TND);

    if (payload?.result === "success" && Number.isFinite(rate) && rate > 0) {
      return {
        rate,
        date: new Date(Number(payload.time_last_update_unix) * 1000).toISOString().slice(0, 10),
        source: "ExchangeRate-API",
        sourceUrl: "https://www.exchangerate-api.com"
      };
    }
  } catch (error) {
    console.warn("Primary exchange provider unavailable:", error?.message || error);
  }

  const payload = await fetchJson("https://api.frankfurter.dev/v2/rate/AED/TND");
  const rate = Number(payload?.rate);

  if (!Number.isFinite(rate) || rate <= 0) {
    throw new Error("Invalid AED/TND exchange rate");
  }

  return {
    rate,
    date: String(payload?.date || new Date().toISOString().slice(0, 10)),
    source: "Frankfurter",
    sourceUrl: "https://frankfurter.dev"
  };
}

export async function getAedToTndRate(_req, res) {
  const now = Date.now();

  if (cachedRate && now - cachedRate.cachedAt < CACHE_TTL_MS) {
    return res.json({ ...cachedRate, cached: true });
  }

  try {
    const latest = await fetchLatestAedToTnd();
    cachedRate = { ...latest, cachedAt: now };
    return res.json({ ...cachedRate, cached: false });
  } catch (error) {
    console.error("AED/TND exchange rate error:", error?.message || error);

    if (cachedRate) {
      return res.json({ ...cachedRate, cached: true, stale: true });
    }

    return res.json({
      rate: env.AED_TO_TND_FALLBACK,
      date: null,
      source: "fallback",
      sourceUrl: null,
      cached: false,
      stale: true
    });
  }
}
