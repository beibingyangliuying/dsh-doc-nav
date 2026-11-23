import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { registerAssetRoutes } from './assets.js';

export const name = '@beibingyangliuying/dsh-sidebar-pdf-nav';

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/**
 * Server half of @beibingyangliuying/dsh-sidebar-pdf-nav.
 *
 * Every PDF operation (outline parsing, thumbnails, text search) runs in the
 * browser on the bytes the document preview already holds. The Host only serves
 * the vendored PDF.js engine, worker, cMaps, standard fonts and wasm modules,
 * so the package stays useful in a profile without a Web server to the extent
 * the plugin itself does nothing there.
 *
 * @param {object} ctx - the plugin context.
 */
export function apply(ctx) {
  ctx.inject(['webServer'], (webCtx) => {
    webCtx.effect(() => registerAssetRoutes(webCtx.webServer, packageRoot), 'dsh-sidebar-pdf-nav: pdf.js assets');
  });
}
