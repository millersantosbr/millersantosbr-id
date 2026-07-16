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
  assert.match(html, /Código aberto/);
  assert.match(html, /Vou de Van Alagoas/);
  assert.match(html, /curriculo-miller-santos\.pdf/);
  assert.match(html, /http:\/\/localhost\/og\.png/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape/);
});

test("ships the portfolio assets and removes starter-only dependencies", async () => {
  const [page, layout, portfolio, styles, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/portfolio.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<Portfolio \/>/);
  assert.match(layout, /generateMetadata/);
  assert.match(layout, /\/og\.png/);
  assert.match(portfolio, /api\.github\.com/);
  assert.match(portfolio, /per_page=100/);
  assert.match(portfolio, /syncState/);
  assert.match(styles, /prefers-reduced-motion/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await access(new URL("../public/og.png", import.meta.url));
  await access(new URL("../public/curriculo-miller-santos.pdf", import.meta.url));
  await assert.rejects(access(new URL("app/_sites-preview", templateRoot)));
});
