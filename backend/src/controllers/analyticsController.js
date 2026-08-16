import AnalyticsVisit from "../models/AnalyticsVisit.js";
import Car from "../models/Car.js";

const locationCache = new Map();
const LOCATION_CACHE_MS = 24 * 60 * 60 * 1000;
const VALID_PERIODS = new Set([7, 30, 90]);

function cleanText(value, maxLength = 250) {
  if (typeof value !== "string") return "";
  return value.replace(/[\u0000-\u001f\u007f]/g, "").trim().slice(0, maxLength);
}

function normalizeIp(value) {
  const ip = cleanText(value, 100).split(",")[0].trim();
  if (ip.startsWith("::ffff:")) return ip.slice(7);
  return ip || "Unknown";
}

function getClientIp(req) {
  return normalizeIp(
    req.headers["cf-connecting-ip"] ||
    req.headers["x-real-ip"] ||
    req.ip ||
    req.socket?.remoteAddress ||
    "Unknown"
  );
}

function isPrivateIp(ip) {
  return ip === "Unknown" || ip === "::1" || ip === "127.0.0.1" ||
    ip.startsWith("10.") || ip.startsWith("192.168.") ||
    /^172\.(1[6-9]|2\d|3[01])\./.test(ip) || ip.startsWith("fe80:") || ip.startsWith("fc") || ip.startsWith("fd");
}

function parseUserAgent(userAgent = "") {
  const ua = userAgent.toLowerCase();
  const device = /ipad|tablet|kindle/.test(ua) ? "Tablet" : /mobile|iphone|android/.test(ua) ? "Mobile" : "Desktop";

  let browser = "Other";
  if (/edg\//.test(ua)) browser = "Edge";
  else if (/opr\//.test(ua)) browser = "Opera";
  else if (/chrome\//.test(ua) && !/chromium/.test(ua)) browser = "Chrome";
  else if (/firefox\//.test(ua)) browser = "Firefox";
  else if (/safari\//.test(ua) && !/chrome\//.test(ua)) browser = "Safari";

  let os = "Other";
  if (/windows nt/.test(ua)) os = "Windows";
  else if (/iphone|ipad|ipod/.test(ua)) os = "iOS";
  else if (/android/.test(ua)) os = "Android";
  else if (/mac os x/.test(ua)) os = "macOS";
  else if (/linux/.test(ua)) os = "Linux";

  return { device, browser, os };
}

function getReferrerHost(referrer) {
  if (!referrer) return "Direct";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "") || "Direct";
  } catch {
    return "Direct";
  }
}

async function resolveLocation(ip) {
  if (isPrivateIp(ip)) {
    return { country: "Local network", countryCode: "", region: "", city: "Local", latitude: null, longitude: null, timezone: "", isp: "" };
  }

  const cached = locationCache.get(ip);
  if (cached && Date.now() - cached.savedAt < LOCATION_CACHE_MS) return cached.data;

  const fallback = { country: "Unknown", countryCode: "", region: "", city: "Unknown", latitude: null, longitude: null, timezone: "", isp: "" };
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 2500);

  try {
    const fields = "success,country,country_code,region,city,latitude,longitude,timezone,connection";
    const response = await fetch(`https://ipwho.is/${encodeURIComponent(ip)}?fields=${fields}`, { signal: controller.signal });
    if (!response.ok) return fallback;
    const payload = await response.json();
    if (!payload.success) return fallback;

    const data = {
      country: cleanText(payload.country, 120) || "Unknown",
      countryCode: cleanText(payload.country_code, 3).toUpperCase(),
      region: cleanText(payload.region, 160),
      city: cleanText(payload.city, 160) || "Unknown",
      latitude: Number.isFinite(payload.latitude) ? payload.latitude : null,
      longitude: Number.isFinite(payload.longitude) ? payload.longitude : null,
      timezone: cleanText(payload.timezone?.id, 100),
      isp: cleanText(payload.connection?.isp || payload.connection?.org, 200)
    };
    locationCache.set(ip, { savedAt: Date.now(), data });
    if (locationCache.size > 5000) locationCache.delete(locationCache.keys().next().value);
    return data;
  } catch {
    return fallback;
  } finally {
    clearTimeout(timeout);
  }
}

export async function trackVisit(req, res) {
  try {
    const visitorId = cleanText(req.body?.visitorId, 100);
    const sessionId = cleanText(req.body?.sessionId, 100);
    const path = cleanText(req.body?.path, 500);

    if (!visitorId || !sessionId || !path) return res.status(400).json({ message: "Invalid analytics event" });
    if (path.startsWith("/admin") || path.startsWith("/login")) return res.status(204).end();

    const ip = getClientIp(req);
    const [location, client] = await Promise.all([
      resolveLocation(ip),
      Promise.resolve(parseUserAgent(req.headers["user-agent"] || ""))
    ]);
    const referrer = cleanText(req.body?.referrer, 1000);

    await AnalyticsVisit.create({
      visitorId,
      sessionId,
      path: path.startsWith("/") ? path : `/${path}`,
      referrer,
      referrerHost: getReferrerHost(referrer),
      ip,
      ...location,
      ...client,
      language: cleanText(req.body?.language, 35),
      screenWidth: Number.isFinite(Number(req.body?.screenWidth)) ? Number(req.body.screenWidth) : null,
      screenHeight: Number.isFinite(Number(req.body?.screenHeight)) ? Number(req.body.screenHeight) : null
    });

    return res.status(204).end();
  } catch (error) {
    console.error("Analytics tracking error:", error.message);
    return res.status(204).end();
  }
}

function increment(map, key, extras = {}) {
  const safeKey = key || "Unknown";
  const current = map.get(safeKey) || { name: safeKey, views: 0, visitors: new Set(), ...extras };
  current.views += 1;
  map.set(safeKey, current);
  return current;
}

function topValues(map, limit = 8) {
  return [...map.values()]
    .map((item) => ({ ...item, visitors: item.visitors instanceof Set ? item.visitors.size : item.visitors }))
    .sort((a, b) => b.views - a.views)
    .slice(0, limit);
}

export async function getAnalyticsOverview(req, res) {
  try {
    const requestedDays = Number(req.query.days);
    const days = VALID_PERIODS.has(requestedDays) ? requestedDays : 30;
    const now = new Date();
    const since = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const liveSince = new Date(now.getTime() - 5 * 60 * 1000);

    const [events, topVehicles] = await Promise.all([
      AnalyticsVisit.find({ createdAt: { $gte: since } })
        .sort({ createdAt: 1 })
        .select("visitorId sessionId path referrerHost ip country countryCode region city device browser os language screenWidth screenHeight createdAt")
        .lean(),
      Car.find({ status: { $ne: "Masque" } })
        .sort({ views: -1, createdAt: -1 })
        .limit(8)
        .select("name slug brand model year price priceType status views images")
        .lean()
    ]);

    const visitors = new Set();
    const liveVisitors = new Set();
    const sessions = new Map();
    const visitorSessions = new Map();
    const daily = new Map();
    const countries = new Map();
    const cities = new Map();
    const pages = new Map();
    const referrers = new Map();
    const devices = new Map();
    const browsers = new Map();
    const operatingSystems = new Map();

    for (const event of events) {
      visitors.add(event.visitorId);
      if (new Date(event.createdAt) >= liveSince) liveVisitors.add(event.visitorId);

      if (!visitorSessions.has(event.visitorId)) visitorSessions.set(event.visitorId, new Set());
      visitorSessions.get(event.visitorId).add(event.sessionId);

      const session = sessions.get(event.sessionId) || {
        sessionId: event.sessionId,
        visitorId: event.visitorId,
        firstSeen: event.createdAt,
        lastSeen: event.createdAt,
        pageViews: 0,
        pages: new Set(),
        entryPage: event.path,
        lastPage: event.path,
        ip: event.ip,
        country: event.country,
        countryCode: event.countryCode,
        region: event.region,
        city: event.city,
        device: event.device,
        browser: event.browser,
        os: event.os,
        referrer: event.referrerHost,
        language: event.language,
        screen: event.screenWidth && event.screenHeight ? `${event.screenWidth}x${event.screenHeight}` : "—"
      };
      session.pageViews += 1;
      session.pages.add(event.path);
      session.lastPage = event.path;
      session.lastSeen = event.createdAt;
      sessions.set(event.sessionId, session);

      const date = new Date(event.createdAt).toISOString().slice(0, 10);
      const day = daily.get(date) || { date, views: 0, visitors: new Set(), sessions: new Set() };
      day.views += 1;
      day.visitors.add(event.visitorId);
      day.sessions.add(event.sessionId);
      daily.set(date, day);

      const country = increment(countries, event.country, { code: event.countryCode });
      country.visitors.add(event.visitorId);
      const city = increment(cities, `${event.city || "Unknown"}, ${event.country || "Unknown"}`);
      city.visitors.add(event.visitorId);
      increment(pages, event.path).visitors.add(event.visitorId);
      increment(referrers, event.referrerHost || "Direct").visitors.add(event.visitorId);
      increment(devices, event.device).visitors.add(event.visitorId);
      increment(browsers, event.browser).visitors.add(event.visitorId);
      increment(operatingSystems, event.os).visitors.add(event.visitorId);
    }

    const sessionList = [...sessions.values()];
    const uniqueVisitors = visitors.size;
    const returningVisitors = [...visitorSessions.values()].filter((value) => value.size > 1).length;
    const bouncedSessions = sessionList.filter((session) => session.pageViews === 1).length;
    const averageSessionSeconds = sessionList.length
      ? Math.round(sessionList.reduce((sum, session) => sum + Math.max(0, (new Date(session.lastSeen) - new Date(session.firstSeen)) / 1000), 0) / sessionList.length)
      : 0;
    const today = now.toISOString().slice(0, 10);

    return res.json({
      period: { days, since, until: now },
      summary: {
        pageViews: events.length,
        uniqueVisitors,
        sessions: sessionList.length,
        viewsToday: daily.get(today)?.views || 0,
        liveNow: liveVisitors.size,
        returningVisitors,
        returningRate: uniqueVisitors ? Math.round((returningVisitors / uniqueVisitors) * 1000) / 10 : 0,
        bounceRate: sessionList.length ? Math.round((bouncedSessions / sessionList.length) * 1000) / 10 : 0,
        pagesPerSession: sessionList.length ? Math.round((events.length / sessionList.length) * 100) / 100 : 0,
        averageSessionSeconds
      },
      daily: [...daily.values()].map((item) => ({ date: item.date, views: item.views, visitors: item.visitors.size, sessions: item.sessions.size })),
      countries: topValues(countries, 10),
      cities: topValues(cities, 10),
      pages: topValues(pages, 10),
      referrers: topValues(referrers, 10),
      devices: topValues(devices, 6),
      browsers: topValues(browsers, 8),
      operatingSystems: topValues(operatingSystems, 8),
      topVehicles,
      recentVisitors: sessionList
        .sort((a, b) => new Date(b.lastSeen) - new Date(a.lastSeen))
        .slice(0, 40)
        .map((session) => ({ ...session, pages: [...session.pages] }))
    });
  } catch (error) {
    console.error("Analytics overview error:", error);
    return res.status(500).json({ message: "Unable to load analytics" });
  }
}
