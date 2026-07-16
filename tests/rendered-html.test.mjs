import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set(
    "test",
    String(process.pid) + "-" + String(Date.now()),
  );
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: {
        accept: "text/html",
        host: "localhost",
        "x-forwarded-host": "localhost",
        "x-forwarded-proto": "http",
      },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished Miller Santos portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<html lang="pt-BR"/i);
  assert.match(html, /Miller Santos — Produtos digitais com IA/i);
  assert.match(html, /PROBLEMAS/);
  assert.match(html, /REAIS VIRAM/);
  assert.doesNotMatch(html, /SUPORTE[\s\S]*QUE VIROU/);
  assert.match(html, /MS \/ BUILD SYSTEM/);
  assert.match(html, /PROBLEMA REAL/);
  assert.match(html, /PRODUTO ÚTIL/);
  assert.doesNotMatch(html, /anos resolvendo problemas|estrelas no GitHub/);
  assert.match(html, /action-icon-external/);
  assert.match(html, /action-icon-down/);
  assert.doesNotMatch(html, /↗|↓|↑/);
  assert.match(html, /Código aberto/);
  assert.match(html, /Vou de Van Alagoas/);
  assert.match(html, /curriculo-miller-santos\.pdf/);
  assert.match(html, /https:\/\/millersantosbr-id\.web\.app\/og\.png/);
  assert.match(html, /\/site\.webmanifest/);
  assert.match(html, /\/favicon\.svg/);
  assert.match(html, /\/apple-touch-icon\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the portfolio assets and removes starter-only dependencies", async () => {
  const [page, layout, portfolio, styles, packageJson, nextConfig, firebaseConfig] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
    readFile(new URL("../next.config.ts", import.meta.url), "utf8"),
    readFile(new URL("../firebase.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<Portfolio \/>/);
  assert.match(layout, /export const metadata/);
  assert.match(layout, /\/og\.png/);
  assert.match(portfolio, /api\.github\.com/);
  assert.match(portfolio, /per_page=100/);
  assert.match(portfolio, /syncState/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.match(styles, /product-core-spin/);
  assert.match(styles, /systems-scan-sweep/);
  assert.match(styles, /\.action-icon-external::after/);
  assert.match(styles, /\.action-icon-down::after/);
  assert.match(styles, /system-signal-flow-mobile/);
  assert.match(styles, /@media \(max-width: 420px\)/);
  assert.match(styles, /env\(safe-area-inset-left\)/);
  assert.doesNotMatch(styles, /\.metric-strip/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);
  assert.match(nextConfig, /FIREBASE_STATIC_EXPORT/);
  assert.match(nextConfig, /output: "export"/);
  assert.match(firebaseConfig, /"public": "out"/);

  const manifest = await readFile(
    new URL("../public/site.webmanifest", import.meta.url),
    "utf8",
  );
  assert.match(manifest, /"name": "millersantosbr ID"/);
  assert.match(manifest, /web-app-manifest-512x512\.png/);

  await Promise.all([
    access(new URL("../public/og.png", import.meta.url)),
    access(new URL("../public/curriculo-miller-santos.pdf", import.meta.url)),
    access(new URL("../public/favicon.ico", import.meta.url)),
    access(new URL("../public/favicon.svg", import.meta.url)),
    access(new URL("../public/favicon-96x96.png", import.meta.url)),
    access(new URL("../public/apple-touch-icon.png", import.meta.url)),
    access(new URL("../public/web-app-manifest-192x192.png", import.meta.url)),
    access(new URL("../public/web-app-manifest-512x512.png", import.meta.url)),
  ]);
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
