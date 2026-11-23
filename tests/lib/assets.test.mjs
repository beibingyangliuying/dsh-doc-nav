import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerAssetRoutes } from '../../lib/assets.js';

const packageRoot = fileURLToPath(new URL('../../', import.meta.url));

/** Mount one registered route on a throwaway server and request a path. */
async function request(routePath) {
  const routes = new Map();
  const webServer = { register: (definition) => { routes.set(definition.path, definition); return () => routes.delete(definition.path); } };
  registerAssetRoutes(webServer, packageRoot);
  const route = routes.get('/dsh-sidebar-pdf-nav-assets');
  assert.ok(route, 'prefix route registered');
  const server = createServer((req, res) => { void route.handler(req, res); });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    const response = await fetch(`http://127.0.0.1:${port}${routePath}`, { method: routePath.endsWith('HEAD') ? 'GET' : undefined });
    const body = await response.text();
    return { status: response.status, headers: response.headers, body };
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('serves the vendored engine with an immutable cache header', async () => {
  const result = await request('/dsh-sidebar-pdf-nav-assets/pdfjs/pdf.bundle.js?v=1');
  assert.equal(result.status, 200);
  assert.match(result.headers.get('content-type') ?? '', /text\/javascript/);
  assert.match(result.headers.get('cache-control') ?? '', /immutable/);
  assert.ok(result.body.length > 1000);
});

test('serves binary worker assets', async () => {
  const result = await request('/dsh-sidebar-pdf-nav-assets/pdfjs/pdf.worker.mjs');
  assert.equal(result.status, 200);
  assert.ok(result.body.length > 1000);
});

test('rejects path traversal outside the asset root', async () => {
  const result = await request('/dsh-sidebar-pdf-nav-assets/pdfjs/..%2Fpackage.json');
  assert.ok(result.status === 404 || result.status === 403, `unexpected status ${result.status}`);
});

test('reports a missing asset as 404', async () => {
  const result = await request('/dsh-sidebar-pdf-nav-assets/pdfjs/nope.mjs');
  assert.equal(result.status, 404);
});

test('rejects non-GET methods', async () => {
  const routes = new Map();
  registerAssetRoutes({ register: (definition) => { routes.set(definition.path, definition); return () => {}; } }, packageRoot);
  let status = 0;
  let allow = '';
  const res = {
    set headersSent(value) { this.sent = value; },
    get headersSent() { return this.sent === true; },
    statusCode: 0,
    setHeader(name, value) { if (name === 'allow') allow = String(value); },
    end() { status = this.statusCode; },
  };
  await routes.get('/dsh-sidebar-pdf-nav-assets').handler({ method: 'POST', url: '/dsh-sidebar-pdf-nav-assets/pdfjs/pdf.worker.mjs' }, res);
  assert.equal(status, 405);
  assert.match(allow, /GET/);
});
