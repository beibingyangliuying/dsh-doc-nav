import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';

const ROUTE_PREFIX = '/dsh-sidebar-pdf-nav-assets';
const PREFIX = `${ROUTE_PREFIX}/`;

const TYPES = new Map(Object.entries({
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.bcmap': 'application/octet-stream',
  '.pfb': 'application/octet-stream',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.txt': 'text/plain; charset=utf-8',
}));

/**
 * Serve the vendored PDF.js assets under one prefix.
 *
 * The browser half resolves every engine URL from this prefix and appends a
 * version query, so responses may be cached aggressively; a plugin update
 * changes the version and therefore the URL.
 *
 * @param {{ register: Function }} webServer - the Host Web server service.
 * @param {string} packageRoot - absolute path of the installed package.
 * @returns {() => void} disposer removing the route.
 */
export function registerAssetRoutes(webServer, packageRoot) {
  const assetsRoot = path.resolve(packageRoot, 'assets');

  return webServer.register({
    kind: 'prefix',
    path: ROUTE_PREFIX,
    handler: async (req, res) => {
      try {
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.statusCode = 405;
          res.setHeader('allow', 'GET, HEAD');
          res.end('Method Not Allowed');
          return;
        }
        const url = new URL(req.url ?? '/', 'http://dsh-sidebar-pdf-nav.invalid');
        if (!url.pathname.startsWith(PREFIX)) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        let relative;
        try {
          relative = decodeURIComponent(url.pathname.slice(PREFIX.length));
        } catch {
          res.statusCode = 400;
          res.end('Bad Request');
          return;
        }
        relative = relative.replaceAll('\\', '/');
        if (!relative || relative.endsWith('/') || relative.split('/').some((part) => part === '..' || part === '.' || part === '')) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        const target = path.resolve(assetsRoot, relative);
        if (target !== assetsRoot && !target.startsWith(assetsRoot + path.sep)) {
          res.statusCode = 403;
          res.end('Forbidden');
          return;
        }
        const info = await stat(target).catch(() => undefined);
        if (info === undefined || !info.isFile()) {
          res.statusCode = 404;
          res.end('Not Found');
          return;
        }
        res.statusCode = 200;
        res.setHeader('content-type', TYPES.get(path.extname(target).toLowerCase()) ?? 'application/octet-stream');
        res.setHeader('content-length', String(info.size));
        res.setHeader('cache-control', 'public, max-age=31536000, immutable');
        res.setHeader('x-content-type-options', 'nosniff');
        if (req.method === 'HEAD') {
          res.end();
          return;
        }
        await new Promise((resolve) => {
          const stream = createReadStream(target);
          stream.on('error', () => { res.destroy(); resolve(); });
          stream.on('end', resolve);
          stream.pipe(res);
        });
      } catch (error) {
        if (!res.headersSent) {
          res.statusCode = 500;
          res.setHeader('content-type', 'text/plain; charset=utf-8');
        }
        res.end('Internal Server Error');
      }
    },
  });
}
