"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowDownToLine,
  BarChart3,
  CarFront,
  Clock3,
  Eye,
  FileSpreadsheet,
  FileText,
  Globe2,
  Laptop2,
  MapPin,
  MousePointerClick,
  RefreshCw,
  Repeat2,
  Route,
  ShieldCheck,
  Smartphone,
  Users
} from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { api } from "@/lib/api";
import { useLanguage } from "@/lib/site-language";
import { cn, currency, resolveMediaUrl } from "@/lib/utils";

type MetricItem = { name: string; views: number; visitors: number; code?: string };
type DailyItem = { date: string; views: number; visitors: number; sessions: number };
type RecentVisitor = {
  sessionId: string;
  visitorId: string;
  firstSeen: string;
  lastSeen: string;
  pageViews: number;
  pages: string[];
  entryPage: string;
  lastPage: string;
  ip: string;
  country: string;
  countryCode: string;
  region: string;
  city: string;
  device: string;
  browser: string;
  os: string;
  referrer: string;
  language: string;
  screen: string;
};

type TopVehicle = {
  _id: string;
  name: string;
  slug: string;
  brand: string;
  model: string;
  year: number;
  price?: number | null;
  priceType: string;
  status: string;
  views: number;
  images?: Array<{ url: string; alt?: string }>;
};

type AnalyticsData = {
  period: { days: number; since: string; until: string };
  summary: {
    pageViews: number;
    uniqueVisitors: number;
    sessions: number;
    viewsToday: number;
    liveNow: number;
    returningVisitors: number;
    returningRate: number;
    bounceRate: number;
    pagesPerSession: number;
    averageSessionSeconds: number;
  };
  daily: DailyItem[];
  countries: MetricItem[];
  cities: MetricItem[];
  pages: MetricItem[];
  referrers: MetricItem[];
  devices: MetricItem[];
  browsers: MetricItem[];
  operatingSystems: MetricItem[];
  topVehicles: TopVehicle[];
  recentVisitors: RecentVisitor[];
};

const COLORS = ["#c8102e", "#111827", "#10b981", "#f59e0b", "#3b82f6", "#8b5cf6"];

function flagFromCode(code?: string) {
  if (!code || code.length !== 2) return "🌍";
  return String.fromCodePoint(...code.toUpperCase().split("").map((character) => 127397 + character.charCodeAt(0)));
}

function formatDuration(seconds: number) {
  if (seconds < 60) return `${seconds}s`;
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${minutes}m ${remaining}s`;
}

function csvCell(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function KpiCard({ label, value, hint, icon: Icon, accent = "brand" }: {
  label: string;
  value: string | number;
  hint: string;
  icon: typeof Users;
  accent?: "brand" | "emerald" | "blue" | "amber" | "zinc";
}) {
  const accentClass = {
    brand: "bg-brand/10 text-brand dark:bg-brand/20",
    emerald: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
    blue: "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300",
    amber: "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
    zinc: "bg-zinc-100 text-zinc-700 dark:bg-white/10 dark:text-zinc-200"
  }[accent];

  return (
    <div className="rounded-[24px] border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-zinc-400">{label}</p>
          <p className="mt-2 text-3xl font-black tracking-tight text-zinc-950 dark:text-white">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", accentClass)}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <p className="mt-3 text-xs leading-5 text-zinc-500 dark:text-zinc-400">{hint}</p>
    </div>
  );
}

function RankingList({ items, empty, valueLabel, showFlag = false }: {
  items: MetricItem[];
  empty: string;
  valueLabel: string;
  showFlag?: boolean;
}) {
  const max = Math.max(...items.map((item) => item.views), 1);
  if (!items.length) return <p className="py-10 text-center text-sm text-zinc-400">{empty}</p>;

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={`${item.name}-${item.code || ""}`}>
          <div className="mb-2 flex items-center justify-between gap-3 text-sm">
            <span className="min-w-0 truncate font-semibold text-zinc-800 dark:text-zinc-100">
              {showFlag ? <span className="me-2">{flagFromCode(item.code)}</span> : null}{item.name}
            </span>
            <span className="shrink-0 text-xs font-bold text-zinc-500 dark:text-zinc-400">{item.views} {valueLabel}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-zinc-100 dark:bg-white/10">
            <div className="h-full rounded-full bg-gradient-to-r from-brand to-red-400" style={{ width: `${Math.max(6, (item.views / max) * 100)}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();
  const [days, setDays] = useState<7 | 30 | 90>(30);
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null);
  const [exporting, setExporting] = useState<"pdf" | "excel" | "csv" | "">("");

  const copy = language === "en" ? {
    eyebrow: "LIVE BUSINESS INTELLIGENCE", title: "Visitor analytics", subtitle: "Understand who visits the showroom, where they come from, and which vehicles or pages attract them most.",
    refresh: "Refresh", csv: "CSV", excel: "Excel", pdf: "PDF", exporting: "Preparing", lastUpdate: "Last update", days: "days", loadError: "Unable to load analytics. Check that the API and database are running.", retry: "Try again",
    pageViews: "Page views", unique: "Unique visitors", sessions: "Visits / sessions", today: "Views today", live: "Live now", returning: "Returning visitors",
    pagesViewed: "Public pages opened", distinctBrowsers: "Distinct browser visitors", sessionsHint: "Separate browsing sessions", todayHint: "Since midnight", liveHint: "Active during the last 5 minutes", returningHint: "Visitors who came back",
    trend: "Traffic trend", trendHint: "Daily page views, visitors, and sessions", views: "Views", visitors: "Visitors", sessionLabel: "Sessions", noData: "No visits recorded for this period.",
    performance: "Engagement quality", bounce: "Bounce rate", pagesSession: "Pages / session", avgSession: "Average session", returnRate: "Return rate",
    countries: "Top countries", cities: "Top cities", geographyHint: "Approximate location based on the visitor IP address.",
    pages: "Most viewed pages", sources: "Traffic sources", direct: "Direct", devices: "Devices", browsers: "Browsers", systems: "Operating systems", vehiclesTitle: "Most viewed vehicles", vehiclesHint: "The listings attracting the strongest customer interest.", vehicleViews: "views", priceOnRequest: "Price on request", openListing: "Open listing",
    recent: "Recent visitor sessions", recentHint: "Technical visit data useful for understanding demand and diagnosing traffic.", ip: "IP address", location: "Location", device: "Device", journey: "Journey", source: "Source", lastSeen: "Last seen", pageCount: "pages", entry: "Entry", current: "Last page",
    privacyTitle: "Privacy and accuracy", privacy: "Admin and login pages are not tracked. Records are automatically deleted after 180 days. IP location is approximate and can be affected by VPNs or mobile networks.",
    emptyRecent: "No recent visitor session yet.", local: "Local network"
  } : {
    eyebrow: "تحليلات مباشرة", title: "تحليلات الزوار", subtitle: "تعرف على عدد الزوار، بلدانهم، مصادر الزيارات، والصفحات أو السيارات الأكثر جذبا للاهتمام.",
    refresh: "تحديث", csv: "CSV", excel: "Excel", pdf: "PDF", exporting: "جار التحضير", lastUpdate: "آخر تحديث", days: "يوما", loadError: "تعذر تحميل التحليلات. تحقق من تشغيل الخادم وقاعدة البيانات.", retry: "إعادة المحاولة",
    pageViews: "مشاهدات الصفحات", unique: "زوار مختلفون", sessions: "الزيارات", today: "مشاهدات اليوم", live: "متصلون الآن", returning: "زوار عادوا للموقع",
    pagesViewed: "عدد الصفحات العامة المفتوحة", distinctBrowsers: "متصفحات مختلفة", sessionsHint: "جلسات تصفح منفصلة", todayHint: "منذ منتصف الليل", liveHint: "نشطون خلال آخر 5 دقائق", returningHint: "زوار رجعوا للموقع",
    trend: "تطور الزيارات", trendHint: "المشاهدات والزوار والجلسات حسب اليوم", views: "مشاهدة", visitors: "زوار", sessionLabel: "جلسات", noData: "لا توجد زيارات مسجلة في هذه الفترة.",
    performance: "جودة التفاعل", bounce: "نسبة الخروج السريع", pagesSession: "صفحات لكل زيارة", avgSession: "متوسط مدة الزيارة", returnRate: "نسبة العودة",
    countries: "أهم البلدان", cities: "أهم المدن", geographyHint: "موقع تقريبي بالاعتماد على عنوان IP الخاص بالزائر.",
    pages: "الصفحات الأكثر مشاهدة", sources: "مصادر الزيارات", direct: "مباشر", devices: "الأجهزة", browsers: "المتصفحات", systems: "أنظمة التشغيل", vehiclesTitle: "السيارات الأكثر مشاهدة", vehiclesHint: "الإعلانات التي تجذب أكبر اهتمام من الزوار.", vehicleViews: "مشاهدة", priceOnRequest: "السعر عند الطلب", openListing: "فتح الإعلان",
    recent: "آخر جلسات الزوار", recentHint: "بيانات تقنية لفهم الطلب ومتابعة حركة الموقع.", ip: "عنوان IP", location: "الموقع", device: "الجهاز", journey: "مسار الزيارة", source: "المصدر", lastSeen: "آخر نشاط", pageCount: "صفحات", entry: "الدخول", current: "آخر صفحة",
    privacyTitle: "الخصوصية والدقة", privacy: "لا يتم تتبع صفحات الإدارة وتسجيل الدخول. تحذف السجلات آليا بعد 180 يوما. تحديد الموقع عبر IP تقريبي وقد يتأثر بالـVPN أو شبكة الهاتف.",
    emptyRecent: "لا توجد جلسات زوار مسجلة بعد.", local: "شبكة محلية"
  };

  const loadAnalytics = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get<AnalyticsData>("/analytics/overview", { params: { days } });
      setData(response.data);
      setUpdatedAt(new Date());
    } catch (requestError: any) {
      setError(requestError?.response?.data?.message || copy.loadError);
    } finally {
      setLoading(false);
    }
  }, [days, copy.loadError]);

  useEffect(() => { void loadAnalytics(); }, [loadAnalytics]);

  const dailyData = useMemo(() => {
    if (!data) return [];
    const indexed = new Map(data.daily.map((item) => [item.date, item]));
    return Array.from({ length: days }, (_, index) => {
      const date = new Date();
      date.setHours(12, 0, 0, 0);
      date.setDate(date.getDate() - (days - index - 1));
      const key = date.toISOString().slice(0, 10);
      return indexed.get(key) || { date: key, views: 0, visitors: 0, sessions: 0 };
    });
  }, [data, days]);

  function exportCsv() {
    if (!data?.recentVisitors.length) return;
    setExporting("csv");
    const headers = ["IP", "Country", "Region", "City", "Device", "Browser", "OS", "Language", "Screen", "Source", "Entry page", "Last page", "Page views", "First seen", "Last seen"];
    const rows = data.recentVisitors.map((visitor) => [visitor.ip, visitor.country, visitor.region, visitor.city, visitor.device, visitor.browser, visitor.os, visitor.language, visitor.screen, visitor.referrer, visitor.entryPage, visitor.lastPage, visitor.pageViews, visitor.firstSeen, visitor.lastSeen]);
    const csv = [headers, ...rows].map((row) => row.map(csvCell).join(",")).join("\n");
    downloadBlob(new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" }), `alhadunicars-visitors-${new Date().toISOString().slice(0, 10)}.csv`);
    window.setTimeout(() => setExporting(""), 350);
  }

  async function exportExcel() {
    if (!data) return;
    setExporting("excel");
    try {
      const { Workbook } = await import("exceljs");
      const workbook = new Workbook();
      workbook.creator = "ALHADUNICARS Analytics";
      workbook.created = new Date();

      const headerStyle = {
        font: { bold: true, color: { argb: "FFFFFFFF" } },
        fill: { type: "pattern" as const, pattern: "solid" as const, fgColor: { argb: "FFC8102E" } },
        alignment: { vertical: "middle" as const, horizontal: "left" as const }
      };
      const styleSheet = (sheet: any) => {
        sheet.views = [{ state: "frozen", ySplit: 1 }];
        sheet.getRow(1).height = 25;
        sheet.getRow(1).eachCell((cell: any) => Object.assign(cell, headerStyle));
        sheet.autoFilter = { from: { row: 1, column: 1 }, to: { row: 1, column: sheet.columnCount } };
        sheet.eachRow((row: any, rowNumber: number) => {
          if (rowNumber > 1 && rowNumber % 2 === 0) row.eachCell((cell: any) => { cell.fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF7F7F8" } }; });
        });
      };

      const summarySheet = workbook.addWorksheet("Summary");
      summarySheet.columns = [{ header: "Metric", key: "metric", width: 32 }, { header: "Value", key: "value", width: 22 }];
      summarySheet.addRows([
        { metric: "Report period", value: `${days} days` }, { metric: "Page views", value: summary.pageViews },
        { metric: "Unique visitors", value: summary.uniqueVisitors }, { metric: "Sessions", value: summary.sessions },
        { metric: "Views today", value: summary.viewsToday }, { metric: "Live now", value: summary.liveNow },
        { metric: "Returning visitors", value: summary.returningVisitors }, { metric: "Returning rate", value: `${summary.returningRate}%` },
        { metric: "Bounce rate", value: `${summary.bounceRate}%` }, { metric: "Pages per session", value: summary.pagesPerSession },
        { metric: "Average session", value: formatDuration(summary.averageSessionSeconds) }
      ]);
      styleSheet(summarySheet);

      const trendSheet = workbook.addWorksheet("Daily traffic");
      trendSheet.columns = [{ header: "Date", key: "date", width: 16 }, { header: "Page views", key: "views", width: 16 }, { header: "Visitors", key: "visitors", width: 16 }, { header: "Sessions", key: "sessions", width: 16 }];
      trendSheet.addRows(dailyData);
      styleSheet(trendSheet);

      const rankingsSheet = workbook.addWorksheet("Rankings");
      rankingsSheet.columns = [{ header: "Category", key: "category", width: 22 }, { header: "Name", key: "name", width: 46 }, { header: "Views", key: "views", width: 14 }, { header: "Visitors", key: "visitors", width: 14 }];
      const rankingGroups = [["Country", data.countries], ["City", data.cities], ["Page", data.pages], ["Source", data.referrers], ["Device", data.devices], ["Browser", data.browsers], ["Operating system", data.operatingSystems]] as const;
      rankingGroups.forEach(([category, items]) => items.forEach((item) => rankingsSheet.addRow({ category, name: item.name, views: item.views, visitors: item.visitors })));
      styleSheet(rankingsSheet);

      const visitorsSheet = workbook.addWorksheet("Recent visitors");
      visitorsSheet.columns = [
        { header: "IP", key: "ip", width: 22 }, { header: "Country", key: "country", width: 22 }, { header: "Region", key: "region", width: 22 }, { header: "City", key: "city", width: 22 },
        { header: "Device", key: "device", width: 14 }, { header: "Browser", key: "browser", width: 16 }, { header: "OS", key: "os", width: 16 }, { header: "Language", key: "language", width: 14 },
        { header: "Screen", key: "screen", width: 14 }, { header: "Source", key: "referrer", width: 28 }, { header: "Entry page", key: "entryPage", width: 34 }, { header: "Last page", key: "lastPage", width: 34 },
        { header: "Page views", key: "pageViews", width: 14 }, { header: "First seen", key: "firstSeen", width: 24 }, { header: "Last seen", key: "lastSeen", width: 24 }
      ];
      visitorsSheet.addRows(data.recentVisitors.map((visitor) => ({ ...visitor, firstSeen: new Date(visitor.firstSeen).toLocaleString("en-GB"), lastSeen: new Date(visitor.lastSeen).toLocaleString("en-GB") })));
      styleSheet(visitorsSheet);

      const buffer = await workbook.xlsx.writeBuffer();
      downloadBlob(new Blob([new Uint8Array(buffer)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }), `alhadunicars-analytics-${new Date().toISOString().slice(0, 10)}.xlsx`);
    } finally {
      setExporting("");
    }
  }

  async function exportPdf() {
    if (!data) return;
    setExporting("pdf");
    try {
      const [{ jsPDF }, autoTableModule] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
      const autoTable = autoTableModule.default;
      const document = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
      document.setProperties({ title: "ALHADUNICARS Visitor Analytics", author: "ALHADUNICARS" });
      document.setFillColor(18, 18, 20);
      document.rect(0, 0, 297, 36, "F");
      document.setTextColor(255, 255, 255);
      document.setFont("helvetica", "bold");
      document.setFontSize(22);
      document.text("ALHADUNICARS — Visitor Analytics", 14, 17);
      document.setFont("helvetica", "normal");
      document.setFontSize(9);
      document.setTextColor(210, 210, 215);
      document.text(`Period: last ${days} days  |  Generated: ${new Date().toLocaleString("en-GB")}`, 14, 26);

      autoTable(document, {
        startY: 43,
        head: [["Page views", "Unique visitors", "Sessions", "Views today", "Live now", "Return rate", "Bounce rate", "Pages/session", "Avg. session"]],
        body: [[summary.pageViews, summary.uniqueVisitors, summary.sessions, summary.viewsToday, summary.liveNow, `${summary.returningRate}%`, `${summary.bounceRate}%`, summary.pagesPerSession, formatDuration(summary.averageSessionSeconds)]],
        theme: "grid",
        headStyles: { fillColor: [200, 16, 46], fontSize: 8 },
        bodyStyles: { fontStyle: "bold", fontSize: 10, textColor: [20, 20, 22] }
      });

      const rankingRows = Math.max(data.countries.length, data.pages.length, data.referrers.length, data.devices.length);
      autoTable(document, {
        startY: (document as any).lastAutoTable.finalY + 9,
        head: [["Top countries", "Views", "Top pages", "Views", "Traffic sources", "Views", "Devices", "Views"]],
        body: Array.from({ length: rankingRows }, (_, index) => [data.countries[index]?.name || "", data.countries[index]?.views || "", data.pages[index]?.name || "", data.pages[index]?.views || "", data.referrers[index]?.name || "", data.referrers[index]?.views || "", data.devices[index]?.name || "", data.devices[index]?.views || ""]),
        theme: "striped",
        headStyles: { fillColor: [25, 25, 28], fontSize: 8 },
        bodyStyles: { fontSize: 8 },
        columnStyles: { 0: { cellWidth: 36 }, 2: { cellWidth: 48 }, 4: { cellWidth: 42 }, 6: { cellWidth: 32 } }
      });

      document.addPage("a4", "landscape");
      document.setTextColor(20, 20, 22);
      document.setFont("helvetica", "bold");
      document.setFontSize(16);
      document.text("Recent visitor sessions", 14, 16);
      autoTable(document, {
        startY: 22,
        head: [["IP", "Location", "Device / browser", "Source", "Entry page", "Last page", "Pages", "Last seen"]],
        body: data.recentVisitors.slice(0, 35).map((visitor) => [visitor.ip, `${visitor.city}, ${visitor.country}`, `${visitor.device} / ${visitor.browser} / ${visitor.os}`, visitor.referrer, visitor.entryPage, visitor.lastPage, visitor.pageViews, new Date(visitor.lastSeen).toLocaleString("en-GB")]),
        theme: "grid",
        headStyles: { fillColor: [200, 16, 46], fontSize: 8 },
        bodyStyles: { fontSize: 7 },
        styles: { overflow: "linebreak", cellPadding: 2 },
        columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 37 }, 2: { cellWidth: 40 }, 3: { cellWidth: 32 }, 4: { cellWidth: 42 }, 5: { cellWidth: 42 }, 6: { cellWidth: 14 }, 7: { cellWidth: 32 } }
      });
      document.save(`alhadunicars-analytics-${new Date().toISOString().slice(0, 10)}.pdf`);
    } finally {
      setExporting("");
    }
  }

  if (loading && !data) {
    return (
      <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-zinc-200 bg-white dark:border-white/10 dark:bg-zinc-900">
        <div className="text-center"><RefreshCw className="mx-auto h-8 w-8 animate-spin text-brand" /><p className="mt-4 text-sm text-zinc-500">Loading analytics...</p></div>
      </div>
    );
  }

  if (error && !data) {
    return (
      <div className="grid min-h-[520px] place-items-center rounded-[28px] border border-red-200 bg-white p-8 text-center dark:border-red-500/30 dark:bg-zinc-900">
        <div><BarChart3 className="mx-auto h-10 w-10 text-brand" /><h1 className="mt-4 text-2xl font-black dark:text-white">Analytics unavailable</h1><p className="mt-2 max-w-md text-sm text-zinc-500">{error}</p><button onClick={() => void loadAnalytics()} className="mt-5 rounded-xl bg-brand px-5 py-3 text-sm font-bold text-white">{copy.retry}</button></div>
      </div>
    );
  }

  if (!data) return null;
  const summary = data.summary;

  return (
    <div className="space-y-5 pb-12">
      <section className="relative overflow-hidden rounded-[28px] bg-zinc-950 px-6 py-7 text-white shadow-xl md:px-8">
        <div className="absolute inset-y-0 right-0 w-1/2 bg-[radial-gradient(circle_at_center,rgba(200,16,46,.32),transparent_65%)]" />
        <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-end">
          <div>
            <p className="text-xs font-black tracking-[0.22em] text-red-400">{copy.eyebrow}</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight md:text-4xl">{copy.title}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-white/65">{copy.subtitle}</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[7, 30, 90].map((period) => (
              <button key={period} onClick={() => setDays(period as 7 | 30 | 90)} className={cn("rounded-xl px-4 py-2.5 text-sm font-bold transition", days === period ? "bg-white text-zinc-950" : "bg-white/10 text-white hover:bg-white/15")}>{period} {copy.days}</button>
            ))}
            <button onClick={() => void loadAnalytics()} disabled={loading} className="inline-flex items-center gap-2 rounded-xl bg-brand px-4 py-2.5 text-sm font-bold text-white disabled:opacity-60"><RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />{copy.refresh}</button>
            <button onClick={exportCsv} disabled={!data.recentVisitors.length || Boolean(exporting)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-40"><ArrowDownToLine className="h-4 w-4" />{exporting === "csv" ? copy.exporting : copy.csv}</button>
            <button onClick={() => void exportExcel()} disabled={Boolean(exporting)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-40"><FileSpreadsheet className="h-4 w-4" />{exporting === "excel" ? copy.exporting : copy.excel}</button>
            <button onClick={() => void exportPdf()} disabled={Boolean(exporting)} className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-bold text-white disabled:opacity-40"><FileText className="h-4 w-4" />{exporting === "pdf" ? copy.exporting : copy.pdf}</button>
          </div>
        </div>
        {updatedAt ? <p className="relative mt-5 text-xs text-white/45">{copy.lastUpdate}: {updatedAt.toLocaleTimeString(language === "ar" ? "ar-TN" : "en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}</p> : null}
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <KpiCard label={copy.pageViews} value={summary.pageViews.toLocaleString()} hint={copy.pagesViewed} icon={Eye} accent="brand" />
        <KpiCard label={copy.unique} value={summary.uniqueVisitors.toLocaleString()} hint={copy.distinctBrowsers} icon={Users} accent="blue" />
        <KpiCard label={copy.sessions} value={summary.sessions.toLocaleString()} hint={copy.sessionsHint} icon={MousePointerClick} accent="zinc" />
        <KpiCard label={copy.today} value={summary.viewsToday.toLocaleString()} hint={copy.todayHint} icon={Activity} accent="amber" />
        <KpiCard label={copy.live} value={summary.liveNow.toLocaleString()} hint={copy.liveHint} icon={Globe2} accent="emerald" />
        <KpiCard label={copy.returning} value={summary.returningVisitors.toLocaleString()} hint={copy.returningHint} icon={Repeat2} accent="brand" />
      </section>

      <section className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:p-6">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div><h2 className="text-xl font-black text-zinc-950 dark:text-white">{copy.vehiclesTitle}</h2><p className="mt-1 text-sm text-zinc-500">{copy.vehiclesHint}</p></div>
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-brand/10 px-3 py-1.5 text-xs font-black text-brand"><Eye className="h-4 w-4" />{data.topVehicles.reduce((total, vehicle) => total + (vehicle.views || 0), 0).toLocaleString()} {copy.vehicleViews}</span>
        </div>
        {data.topVehicles.length ? (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {data.topVehicles.map((vehicle, index) => {
              const image = resolveMediaUrl(vehicle.images?.[0]?.url);
              return (
                <Link key={vehicle._id} href={`/voitures/${vehicle.slug}`} className="group overflow-hidden rounded-[22px] border border-zinc-200 bg-zinc-50 transition hover:-translate-y-1 hover:border-brand/30 hover:shadow-lg dark:border-white/10 dark:bg-white/5">
                  <div className="relative h-32 overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                    {image ? <img src={image} alt={vehicle.images?.[0]?.alt || vehicle.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="grid h-full place-items-center"><CarFront className="h-10 w-10 text-zinc-400" /></div>}
                    <span className="absolute left-3 top-3 grid h-8 w-8 place-items-center rounded-full bg-zinc-950 text-xs font-black text-white shadow-lg">#{index + 1}</span>
                    <span className="absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-2.5 py-1 text-xs font-black text-zinc-950 shadow"><Eye className="h-3.5 w-3.5 text-brand" />{vehicle.views || 0}</span>
                  </div>
                  <div className="p-4">
                    <p className="truncate text-xs font-bold uppercase tracking-wider text-zinc-400">{vehicle.brand} · {vehicle.model} · {vehicle.year}</p>
                    <h3 className="mt-1 truncate text-base font-black text-zinc-950 dark:text-white">{vehicle.name}</h3>
                    <div className="mt-4 flex items-center justify-between gap-3"><p className="font-black text-brand">{Number(vehicle.price) > 0 ? currency(Number(vehicle.price)) : copy.priceOnRequest}</p><span className="text-xs font-bold text-zinc-500 transition group-hover:text-brand">{copy.openListing} →</span></div>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : <p className="mt-6 rounded-2xl border border-dashed border-zinc-200 p-8 text-center text-sm text-zinc-400 dark:border-white/10">{copy.noData}</p>}
      </section>

      <section className="grid gap-5 xl:grid-cols-[minmax(0,1.65fr)_minmax(300px,.85fr)]">
        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:p-6">
          <div className="mb-6"><h2 className="text-xl font-black text-zinc-950 dark:text-white">{copy.trend}</h2><p className="mt-1 text-sm text-zinc-500">{copy.trendHint}</p></div>
          <div className="h-[310px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyData} margin={{ top: 8, right: 10, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="viewsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#c8102e" stopOpacity={0.35} /><stop offset="95%" stopColor="#c8102e" stopOpacity={0} /></linearGradient>
                  <linearGradient id="visitorsGradient" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.25} /><stop offset="95%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="4 4" stroke="#a1a1aa33" />
                <XAxis dataKey="date" tickFormatter={(value) => new Date(`${value}T12:00:00`).toLocaleDateString(language === "ar" ? "ar-TN" : "en-GB", { day: "2-digit", month: "short" })} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} minTickGap={28} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: "#71717a" }} axisLine={false} tickLine={false} />
                <Tooltip labelFormatter={(value) => new Date(`${value}T12:00:00`).toLocaleDateString(language === "ar" ? "ar-TN" : "en-GB", { dateStyle: "medium" })} contentStyle={{ borderRadius: 14, border: "1px solid #e4e4e7", boxShadow: "0 12px 30px rgba(0,0,0,.12)" }} />
                <Area type="monotone" dataKey="views" name={copy.views} stroke="#c8102e" strokeWidth={3} fill="url(#viewsGradient)" />
                <Area type="monotone" dataKey="visitors" name={copy.visitors} stroke="#10b981" strokeWidth={2} fill="url(#visitorsGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-5 shadow-sm dark:border-white/10 dark:bg-zinc-900 md:p-6">
          <h2 className="text-xl font-black text-zinc-950 dark:text-white">{copy.performance}</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[
              { label: copy.bounce, value: `${summary.bounceRate}%`, icon: Route },
              { label: copy.pagesSession, value: summary.pagesPerSession.toFixed(2), icon: MousePointerClick },
              { label: copy.avgSession, value: formatDuration(summary.averageSessionSeconds), icon: Clock3 },
              { label: copy.returnRate, value: `${summary.returningRate}%`, icon: Repeat2 }
            ].map((item) => <div key={item.label} className="rounded-2xl bg-zinc-50 p-4 dark:bg-white/5"><item.icon className="h-5 w-5 text-brand" /><p className="mt-5 text-2xl font-black dark:text-white">{item.value}</p><p className="mt-1 text-xs text-zinc-500">{item.label}</p></div>)}
          </div>
          <div className="mt-5 h-[150px]" dir="ltr">
            {data.devices.length ? <ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.devices} dataKey="views" nameKey="name" innerRadius={42} outerRadius={65} paddingAngle={3}>{data.devices.map((item, index) => <Cell key={item.name} fill={COLORS[index % COLORS.length]} />)}</Pie><Tooltip contentStyle={{ borderRadius: 12 }} /></PieChart></ResponsiveContainer> : <div className="grid h-full place-items-center text-sm text-zinc-400">{copy.noData}</div>}
          </div>
          <div className="mt-2 flex flex-wrap justify-center gap-3 text-xs text-zinc-500">{data.devices.map((item, index) => <span key={item.name} className="inline-flex items-center gap-1.5"><i className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />{item.name} ({item.views})</span>)}</div>
        </div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-brand/10 text-brand"><Globe2 className="h-5 w-5" /></span><div><h2 className="text-xl font-black dark:text-white">{copy.countries}</h2><p className="mt-1 text-xs text-zinc-500">{copy.geographyHint}</p></div></div><RankingList items={data.countries} empty={copy.noData} valueLabel={copy.views} showFlag /></div>
        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-start gap-3"><span className="grid h-10 w-10 place-items-center rounded-2xl bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300"><MapPin className="h-5 w-5" /></span><div><h2 className="text-xl font-black dark:text-white">{copy.cities}</h2><p className="mt-1 text-xs text-zinc-500">{copy.geographyHint}</p></div></div><RankingList items={data.cities} empty={copy.noData} valueLabel={copy.views} /></div>
      </section>

      <section className="grid gap-5 xl:grid-cols-2">
        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-center gap-3"><Route className="h-5 w-5 text-brand" /><h2 className="text-xl font-black dark:text-white">{copy.pages}</h2></div><RankingList items={data.pages} empty={copy.noData} valueLabel={copy.views} /></div>
        <div className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-center gap-3"><MousePointerClick className="h-5 w-5 text-brand" /><h2 className="text-xl font-black dark:text-white">{copy.sources}</h2></div><RankingList items={data.referrers.map((item) => ({ ...item, name: item.name === "Direct" ? copy.direct : item.name }))} empty={copy.noData} valueLabel={copy.views} /></div>
      </section>

      <section className="grid gap-5 lg:grid-cols-3">
        {[
          { title: copy.devices, icon: Smartphone, items: data.devices },
          { title: copy.browsers, icon: Globe2, items: data.browsers },
          { title: copy.systems, icon: Laptop2, items: data.operatingSystems }
        ].map((group) => <div key={group.title} className="rounded-[28px] border border-zinc-200/80 bg-white p-6 shadow-sm dark:border-white/10 dark:bg-zinc-900"><div className="mb-6 flex items-center gap-3"><group.icon className="h-5 w-5 text-brand" /><h2 className="text-lg font-black dark:text-white">{group.title}</h2></div><RankingList items={group.items} empty={copy.noData} valueLabel={copy.views} /></div>)}
      </section>

      <section className="overflow-hidden rounded-[28px] border border-zinc-200/80 bg-white shadow-sm dark:border-white/10 dark:bg-zinc-900">
        <div className="flex flex-col justify-between gap-3 border-b border-zinc-100 p-6 dark:border-white/10 md:flex-row md:items-end">
          <div><h2 className="text-xl font-black dark:text-white">{copy.recent}</h2><p className="mt-1 text-sm text-zinc-500">{copy.recentHint}</p></div>
          <span className="rounded-full bg-zinc-100 px-3 py-1.5 text-xs font-bold text-zinc-600 dark:bg-white/10 dark:text-zinc-300">{data.recentVisitors.length} {copy.sessionLabel}</span>
        </div>
        <div className="overflow-x-auto">
          {data.recentVisitors.length ? (
            <table className="w-full min-w-[1080px] text-start text-sm">
              <thead className="bg-zinc-50 text-xs uppercase tracking-wider text-zinc-400 dark:bg-white/5"><tr><th className="px-5 py-4 text-start">{copy.ip}</th><th className="px-5 py-4 text-start">{copy.location}</th><th className="px-5 py-4 text-start">{copy.device}</th><th className="px-5 py-4 text-start">{copy.journey}</th><th className="px-5 py-4 text-start">{copy.source}</th><th className="px-5 py-4 text-start">{copy.lastSeen}</th></tr></thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-white/10">
                {data.recentVisitors.map((visitor) => (
                  <tr key={visitor.sessionId} className="transition hover:bg-zinc-50/80 dark:hover:bg-white/[.03]">
                    <td className="px-5 py-4"><p className="font-mono text-xs font-bold text-zinc-800 dark:text-zinc-100">{visitor.ip}</p><p className="mt-1 text-xs text-zinc-400">{visitor.language || "—"} · {visitor.screen}</p></td>
                    <td className="px-5 py-4"><p className="font-semibold text-zinc-800 dark:text-zinc-100">{flagFromCode(visitor.countryCode)} {visitor.city}</p><p className="mt-1 text-xs text-zinc-400">{visitor.region ? `${visitor.region}, ` : ""}{visitor.country === "Local network" ? copy.local : visitor.country}</p></td>
                    <td className="px-5 py-4"><p className="font-semibold text-zinc-800 dark:text-zinc-100">{visitor.device} · {visitor.browser}</p><p className="mt-1 text-xs text-zinc-400">{visitor.os}</p></td>
                    <td className="max-w-[280px] px-5 py-4"><p className="truncate font-semibold text-zinc-800 dark:text-zinc-100">{copy.entry}: {visitor.entryPage}</p><p className="mt-1 truncate text-xs text-zinc-400">{copy.current}: {visitor.lastPage} · {visitor.pageViews} {copy.pageCount}</p></td>
                    <td className="max-w-[190px] px-5 py-4"><p className="truncate font-semibold text-zinc-700 dark:text-zinc-200">{visitor.referrer === "Direct" ? copy.direct : visitor.referrer}</p></td>
                    <td className="px-5 py-4"><p className="whitespace-nowrap font-semibold text-zinc-700 dark:text-zinc-200">{new Date(visitor.lastSeen).toLocaleDateString(language === "ar" ? "ar-TN" : "en-GB", { day: "2-digit", month: "short", year: "numeric" })}</p><p className="mt-1 text-xs text-zinc-400">{new Date(visitor.lastSeen).toLocaleTimeString(language === "ar" ? "ar-TN" : "en-GB", { hour: "2-digit", minute: "2-digit" })}</p></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : <p className="p-12 text-center text-sm text-zinc-400">{copy.emptyRecent}</p>}
        </div>
      </section>

      <section className="flex items-start gap-4 rounded-[24px] border border-emerald-200 bg-emerald-50 p-5 text-emerald-950 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-100">
        <ShieldCheck className="mt-0.5 h-6 w-6 shrink-0 text-emerald-600 dark:text-emerald-300" />
        <div><h2 className="font-black">{copy.privacyTitle}</h2><p className="mt-1 text-sm leading-6 text-emerald-800/80 dark:text-emerald-100/70">{copy.privacy}</p></div>
      </section>
    </div>
  );
}
