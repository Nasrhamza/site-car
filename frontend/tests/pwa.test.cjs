const { test } = require("node:test");
const assert = require("node:assert/strict");
const { readFileSync } = require("node:fs");
const { join } = require("node:path");
const { runInNewContext } = require("node:vm");

function worker(fetch) {
  const handlers = {};
  runInNewContext(readFileSync(join(__dirname, "../public/sw.js"), "utf8"), {
    self: {
      addEventListener: (type, callback) => { handlers[type] = callback; },
      skipWaiting: () => Promise.resolve(),
      clients: { claim: () => Promise.resolve() }
    },
    fetch,
    Response
  });
  return handlers;
}

test("live page requests go unchanged to the network", async () => {
  const request = { method: "GET", mode: "navigate", url: "https://alhadunicars.com/catalogue" };
  const response = new Response("Latest inventory");
  const handlers = worker(async (input) => { assert.equal(input, request); return response; });
  let result;
  handlers.fetch({ request, respondWith: (promise) => { result = promise; } });
  assert.equal(await result, response);
});

test("uploads, API calls and assets are not intercepted", () => {
  const handlers = worker(() => assert.fail("Worker should not fetch this request"));
  for (const request of [
    { method: "POST", mode: "navigate" },
    { method: "POST", mode: "cors" },
    { method: "GET", mode: "cors" },
    { method: "GET", mode: "same-origin" }
  ]) {
    handlers.fetch({ request, respondWith: () => assert.fail("Worker should not intercept this request") });
  }
});

test("offline navigation returns a bilingual non-cacheable 503 page", async () => {
  const handlers = worker(async () => { throw new Error("Offline"); });
  let result;
  handlers.fetch({ request: { method: "GET", mode: "navigate" }, respondWith: (promise) => { result = promise; } });
  const response = await result;
  assert.equal(response.status, 503);
  assert.equal(response.headers.get("Cache-Control"), "no-store");
  const html = await response.text();
  assert.match(html, /You're offline/);
  assert.match(html, /لا يوجد اتصال بالإنترنت/);
});

test("service worker updates are not stored in browser cache", async () => {
  const config = require("../next.config.js");
  const route = (await config.headers()).find((item) => item.source === "/sw.js");
  assert.ok(route);
  assert.ok(route.headers.some((header) => header.key === "Cache-Control" && header.value.includes("no-store")));
  assert.ok(route.headers.some((header) => header.key === "Service-Worker-Allowed" && header.value === "/"));
});
