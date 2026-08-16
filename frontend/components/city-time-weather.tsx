"use client";

import { useEffect, useMemo, useState, type ComponentType } from "react";
import {
  Cloud,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSun,
  MapPin,
  Snowflake,
  Sun,
  Wind
} from "lucide-react";
import { useLanguage } from "@/lib/site-language";

type Weather = {
  temperature: number;
  apparentTemperature: number;
  weatherCode: number;
  isDay: boolean;
  windSpeed: number;
};

type City = {
  key: "tunis" | "dubai";
  flagUrl: string;
  name: { en: string; ar: string };
  country: { en: string; ar: string };
  timeZone: string;
  latitude: number;
  longitude: number;
};

const CITIES: City[] = [
  {
    key: "tunis",
    flagUrl: "https://flagcdn.com/w160/tn.png",
    name: { en: "Tunis", ar: "تونس" },
    country: { en: "Tunisia", ar: "تونس" },
    timeZone: "Africa/Tunis",
    latitude: 36.8065,
    longitude: 10.1815
  },
  {
    key: "dubai",
    flagUrl: "https://flagcdn.com/w160/ae.png",
    name: { en: "Dubai", ar: "دبي" },
    country: { en: "United Arab Emirates", ar: "الإمارات العربية المتحدة" },
    timeZone: "Asia/Dubai",
    latitude: 25.2048,
    longitude: 55.2708
  }
];

function getWeatherPresentation(code: number, isDay: boolean, language: "ar" | "en") {
  let Icon: ComponentType<{ className?: string }> = isDay ? Sun : CloudSun;
  let en = "Clear sky";
  let ar = "سماء صافية";

  if (code === 1 || code === 2) {
    Icon = CloudSun;
    en = "Partly cloudy";
    ar = "غائم جزئيًا";
  } else if (code === 3) {
    Icon = Cloud;
    en = "Cloudy";
    ar = "غائم";
  } else if (code === 45 || code === 48) {
    Icon = CloudFog;
    en = "Foggy";
    ar = "ضباب";
  } else if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
    Icon = CloudRain;
    en = "Rain";
    ar = "أمطار";
  } else if ((code >= 71 && code <= 77) || (code >= 85 && code <= 86)) {
    Icon = Snowflake;
    en = "Snow";
    ar = "ثلوج";
  } else if (code >= 95) {
    Icon = CloudLightning;
    en = "Thunderstorm";
    ar = "عاصفة رعدية";
  }

  return { Icon, label: language === "ar" ? ar : en };
}

function cityTime(date: Date, timeZone: string, language: "ar" | "en") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-TN" : "en-GB", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).format(date);
}

function cityDate(date: Date, timeZone: string, language: "ar" | "en") {
  return new Intl.DateTimeFormat(language === "ar" ? "ar-TN" : "en-GB", {
    timeZone,
    weekday: "long",
    day: "numeric",
    month: "long"
  }).format(date);
}

function getDubaiCalendarParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dubai",
    year: "numeric",
    month: "numeric",
    day: "numeric"
  }).formatToParts(date);
  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value || 0);

  return { year: value("year"), month: value("month") - 1, day: value("day") };
}

async function fetchWeather(city: City, signal: AbortSignal): Promise<Weather> {
  const query = new URLSearchParams({
    latitude: String(city.latitude),
    longitude: String(city.longitude),
    current: "temperature_2m,apparent_temperature,weather_code,is_day,wind_speed_10m",
    timezone: city.timeZone,
    forecast_days: "1"
  });
  const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query}`, {
    signal,
    next: { revalidate: 900 }
  });

  if (!response.ok) throw new Error("Weather service unavailable");
  const payload = await response.json();

  return {
    temperature: Number(payload?.current?.temperature_2m),
    apparentTemperature: Number(payload?.current?.apparent_temperature),
    weatherCode: Number(payload?.current?.weather_code || 0),
    isDay: Number(payload?.current?.is_day) === 1,
    windSpeed: Number(payload?.current?.wind_speed_10m)
  };
}

export function CityTimeWeather() {
  const { language } = useLanguage();
  const [now, setNow] = useState(() => new Date());
  const [weather, setWeather] = useState<Partial<Record<City["key"], Weather>>>({});
  const [weatherUnavailable, setWeatherUnavailable] = useState(false);
  const [weatherUpdatedAt, setWeatherUpdatedAt] = useState<Date | null>(null);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    const load = () => {
      Promise.all(CITIES.map((city) => fetchWeather(city, controller.signal)))
        .then(([tunis, dubai]) => {
          setWeather({ tunis, dubai });
          setWeatherUnavailable(false);
          setWeatherUpdatedAt(new Date());
        })
        .catch((error) => {
          if (error?.name !== "AbortError") setWeatherUnavailable(true);
        });
    };

    load();
    const refreshTimer = window.setInterval(load, 15 * 60 * 1000);
    return () => {
      controller.abort();
      window.clearInterval(refreshTimer);
    };
  }, []);

  const calendar = useMemo(() => {
    const { year, month, day } = getDubaiCalendarParts(now);
    const firstWeekday = new Date(Date.UTC(year, month, 1)).getUTCDay();
    const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
    const cells = Array.from({ length: 42 }, (_unused, index) => {
      const date = index - firstWeekday + 1;
      return date > 0 && date <= daysInMonth ? date : null;
    });
    const monthLabel = new Intl.DateTimeFormat(language === "ar" ? "ar-TN" : "en-GB", {
      timeZone: "Asia/Dubai",
      month: "long",
      year: "numeric"
    }).format(now);

    return { year, day, cells, monthLabel };
  }, [language, now]);

  const labels = language === "ar"
    ? {
        eyebrow: "تونس ودبي الآن",
        title: "وقتك وطقسك بين تونس ودبي",
        subtitle: "توقيت مباشر وطقس متجدد لمتابعة أعمالك واتصالاتك بسهولة.",
        feelsLike: "محسوسة",
        wind: "الرياح",
        loading: "جاري تحميل الطقس",
        unavailable: "الطقس غير متاح مؤقتًا",
        updated: "آخر تحديث",
        live: "طقس مباشر",
        weekdays: ["ح", "ن", "ث", "ر", "خ", "ج", "س"]
      }
    : {
        eyebrow: "Tunis & Dubai live",
        title: "Your time and weather, in one place",
        subtitle: "Live local time and refreshed weather for easier calls and follow-up.",
        feelsLike: "Feels like",
        wind: "Wind",
        loading: "Loading weather",
        unavailable: "Weather temporarily unavailable",
        updated: "Updated",
        live: "Live weather",
        weekdays: ["S", "M", "T", "W", "T", "F", "S"]
      };

  return (
    <section className="section-spacing overflow-hidden bg-white dark:bg-zinc-950">
      <div className="container-premium">
        <div className="relative overflow-hidden rounded-[32px] bg-zinc-950 px-4 py-6 text-white shadow-[0_28px_80px_rgba(15,23,42,.18)] sm:px-6 lg:px-8 lg:py-8">
          <div className="pointer-events-none absolute -right-28 -top-28 h-64 w-64 rounded-full bg-brand/25 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-brand-gold/15 blur-3xl" />

          <div className="relative flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-brand-gold">{labels.eyebrow}</p>
              <h2 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">{labels.title}</h2>
            </div>
            <p className="max-w-xl text-sm leading-6 text-zinc-400 sm:text-end">{labels.subtitle}</p>
          </div>

          <div className="relative mt-10 grid gap-4 lg:grid-cols-[minmax(0,1fr)_270px_minmax(0,1fr)] lg:items-stretch">
            {CITIES.map((city, cityIndex) => {
              const currentWeather = weather[city.key];
              const presentation = getWeatherPresentation(
                currentWeather?.weatherCode || 0,
                currentWeather?.isDay ?? true,
                language
              );
              const WeatherIcon = presentation.Icon;

              return (
                <div
                  key={city.key}
                  className={`rounded-[26px] border border-white/10 bg-white/[0.07] p-5 backdrop-blur ${cityIndex === 0 ? "lg:col-start-1 lg:row-start-1" : "lg:col-start-3 lg:row-start-1"}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span className="grid h-12 w-14 place-items-center overflow-hidden rounded-2xl border border-white/10 bg-white p-1.5 shadow-lg">
                        <img
                          src={city.flagUrl}
                          alt={city.country[language]}
                          className="h-full w-full rounded-lg object-cover"
                          loading="lazy"
                        />
                      </span>
                      <div>
                        <h3 className="text-lg font-extrabold">{city.name[language]}</h3>
                        <p className="mt-0.5 flex items-center gap-1 text-xs text-zinc-400"><MapPin className="h-3.5 w-3.5" />{city.country[language]}</p>
                      </div>
                    </div>
                    {currentWeather ? <WeatherIcon className="h-8 w-8 text-brand-gold" /> : null}
                  </div>

                  <p className="mt-7 font-mono text-3xl font-black tabular-nums tracking-tight sm:text-4xl" dir="ltr">
                    {cityTime(now, city.timeZone, language)}
                  </p>
                  <p className="mt-1 text-sm font-medium text-zinc-400">{cityDate(now, city.timeZone, language)}</p>

                  <div className="mt-5 border-t border-white/10 pt-4">
                    {currentWeather ? (
                      <div className="flex items-end justify-between gap-4">
                        <div>
                          <p className="text-3xl font-black tabular-nums" dir="ltr">{currentWeather.temperature.toFixed(1)}°C</p>
                          <p className="mt-1 text-xs font-semibold text-zinc-300">{presentation.label}</p>
                        </div>
                        <div className="space-y-1 text-end text-[11px] text-zinc-400">
                          <p>{labels.feelsLike} {currentWeather.apparentTemperature.toFixed(1)}°</p>
                          <p className="inline-flex items-center gap-1"><Wind className="h-3.5 w-3.5" />{labels.wind} {Math.round(currentWeather.windSpeed)} km/h</p>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-400">{weatherUnavailable ? labels.unavailable : labels.loading}</p>
                    )}
                  </div>
                </div>
              );
            })}

            <div className="order-first rounded-[26px] bg-[#f7f3e8] p-4 text-zinc-950 shadow-[0_18px_45px_rgba(0,0,0,.28)] lg:col-start-2 lg:row-start-1 lg:order-none lg:self-center">
              <div className="flex items-center justify-between border-b border-zinc-900/10 pb-3">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.22em] text-brand">ALHADUNICARS</p>
                  <p className="mt-1 text-sm font-extrabold capitalize">{calendar.monthLabel}</p>
                </div>
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-brand text-2xl font-black text-white shadow-lg shadow-brand/20">{calendar.day}</div>
              </div>
              <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[10px]">
                {labels.weekdays.map((weekday, index) => <span key={`${weekday}-${index}`} className="font-bold text-zinc-400">{weekday}</span>)}
                {calendar.cells.map((day, index) => (
                  <span
                    key={index}
                    className={`grid aspect-square place-items-center rounded-full font-semibold ${day === calendar.day ? "bg-brand font-black text-white" : day ? "text-zinc-700" : "text-transparent"}`}
                  >
                    {day || "·"}
                  </span>
                ))}
              </div>
              <div className="mt-3 flex items-center justify-between rounded-xl bg-zinc-950 px-3 py-2 text-[10px] font-bold text-white">
                <span className="inline-flex items-center gap-1.5"><img src="https://flagcdn.com/w40/tn.png" alt="" className="h-3 w-4 rounded-sm object-cover" />Tunis</span><span className="text-brand-gold">↔</span><span className="inline-flex items-center gap-1.5">Dubai<img src="https://flagcdn.com/w40/ae.png" alt="" className="h-3 w-4 rounded-sm object-cover" /></span>
              </div>
            </div>
          </div>

          <div className="relative mt-4 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-zinc-500">
            <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />{labels.live}</span>
            {weatherUpdatedAt ? <span>{labels.updated} {cityTime(weatherUpdatedAt, "Asia/Dubai", language).slice(0, 5)}</span> : null}
            <span>Open-Meteo</span>
          </div>
        </div>
      </div>
    </section>
  );
}
