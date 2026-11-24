import { test } from 'node:test';
import assert from 'node:assert/strict';
import { apply, name } from '../../lib/index.js';

test('declares the package name used by the profile row', () => {
  assert.equal(name, '@beibingyangliuying/dsh-sidebar-doc-nav');
});

test('registers the asset route through webServer and disposes it', async () => {
  const routes = [];
  const disposers = [];
  let injected = null;
  let effectRun = false;
  const ctx = {
    inject: (deps, callback) => {
      injected = deps;
      callback({
        webServer: {
          register: (definition) => {
            routes.push(definition);
            return () => disposers.push(definition.path);
          },
        },
        effect: (factory) => {
          effectRun = true;
          factory();
        },
      });
    },
  };
  apply(ctx);
  assert.deepEqual(injected, ['webServer']);
  assert.equal(effectRun, true);
  assert.equal(routes.length, 1);
  assert.equal(routes[0].kind, 'prefix');
  assert.equal(routes[0].path, '/dsh-sidebar-doc-nav-assets');
});
