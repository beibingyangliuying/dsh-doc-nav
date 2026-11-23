import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../../client/client.js', import.meta.url), 'utf8');

/** Execute client.js against a stub module loader and return the plugin exports. */
function loadPlugin() {
  let captured;
  const styleTags = [];
  const document = {
    querySelector: () => null,
    createElement: () => ({ dataset: {}, textContent: '' }),
    head: { appendChild: (tag) => styleTags.push(tag) },
    addEventListener() {},
    removeEventListener() {},
    body: {},
  };
  const react = {
    createElement: (type, props, ...children) => ({ type, props, children }),
    Fragment: Symbol('fragment'),
    useState: (value) => [typeof value === 'function' ? value() : value, () => {}],
    useRef: (value) => ({ current: value }),
    useEffect: () => {},
    useCallback: (fn) => fn,
  };
  const window = {
    __ModuleLoader__: {
      load: (definition) => { captured = definition; },
    },
    localStorage: { getItem: () => null, setItem: () => {} },
    devicePixelRatio: 1,
  };
  runInNewContext(source, { window, document, console });
  assert.ok(captured, 'module loader called');
  assert.equal(captured.id, '@beibingyangliuying/dsh-sidebar-pdf-nav');
  const requireStub = (id) => {
    if (id === 'react') return react;
    if (id === 'react-dom') return { createPortal: (node) => node };
    throw new Error(`unexpected require ${id}`);
  };
  return { ...captured.factory(requireStub), styleTags };
}

test('registers the action slot under the built-in PDF renderer id', () => {
  const plugin = loadPlugin();
  const registered = [];
  const effects = [];
  const ctx = {
    effect: (factory, label) => { effects.push(label); factory(); },
    slots: {
      inject: (slotName, run) => { registered.push({ slotName, ...run() }); },
      register: (definition, component) => ({ definition, component }),
    },
  };
  plugin.apply(ctx);
  assert.equal(plugin.inject.includes('slots'), true);
  assert.equal(registered.length, 1);
  assert.equal(registered[0].slotName, 'sidebar.right.tab.document.action');
  assert.equal(registered[0].definition.name, 'sidebar.right.tab.document.action');
  assert.equal(registered[0].definition.key, '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/pdf');
  assert.equal(typeof registered[0].definition.key, 'string');
  assert.equal(effects.length, 1);
});

test('expands only bookmarks that own children above the depth limit', () => {
  const plugin = loadPlugin();
  const flat = [
    { id: 'o0', depth: 0, children: [{}] },
    { id: 'o1', depth: 0, children: [] },
    { id: 'o2', depth: 1, children: [{}] },
    { id: 'o3', depth: 2, children: [{}] },
  ];
  assert.deepEqual(JSON.parse(JSON.stringify(plugin.buildDefaultExpansion(flat, 2))), { o0: true, o2: true });
  assert.deepEqual(JSON.parse(JSON.stringify(plugin.buildDefaultExpansion([], 2))), {});
});

test('installs its stylesheet once per document', () => {
  const plugin = loadPlugin();
  assert.equal(plugin.styleTags.length, 0);
  plugin.apply({ effect: (factory) => { factory(); }, slots: { inject: () => {}, register: () => ({}) } });
  assert.equal(plugin.styleTags.length, 1);
  assert.match(plugin.styleTags[0].textContent, /dpr-panel/);
});

/** Collect rendered row elements (those carrying data-outline-node) from a stub element tree. */
function collectOutlineRows(node, rows = []) {
  if (node === null || typeof node !== 'object') return rows;
  if (Array.isArray(node)) {
    for (const child of node) collectOutlineRows(child, rows);
    return rows;
  }
  if (node.props != null && node.props['data-outline-node'] !== undefined) rows.push(node);
  for (const child of node.children ?? []) collectOutlineRows(child, rows);
  return rows;
}

/** Render OutlineRows for a two-level outline and record the callbacks it fires. */
function renderOutline(plugin, expanded) {
  const child = { id: 'o1', depth: 1, title: '1.1', page: 3, children: [] };
  const parent = { id: 'o0', depth: 0, title: '1', page: 1, children: [child] };
  const picked = [];
  const toggled = [];
  const tree = plugin.OutlineRows({
    nodes: [parent],
    expanded,
    currentNodeId: '',
    onPick: (node) => picked.push(node.id),
    onToggle: (id) => toggled.push(id),
  });
  return { rows: collectOutlineRows(tree), picked, toggled };
}

const keyEvent = (key) => ({ key, prevented: false, preventDefault() { this.prevented = true; } });

test('clicking a bookmark title jumps without collapsing it', () => {
  const plugin = loadPlugin();
  const { rows, picked, toggled } = renderOutline(plugin, { o0: true });
  assert.deepEqual(rows.map((row) => row.props['data-outline-node']), ['o0', 'o1']);
  rows[0].props.onClick();
  assert.deepEqual(picked, ['o0']);
  assert.deepEqual(toggled, []);
});

test('the caret toggles expansion without jumping', () => {
  const plugin = loadPlugin();
  const { rows, picked, toggled } = renderOutline(plugin, { o0: true });
  const caret = rows[0].children[0];
  assert.match(caret.props.className, /dpr-caret/);
  let stopped = false;
  caret.props.onClick({ stopPropagation() { stopped = true; } });
  assert.equal(stopped, true);
  assert.deepEqual(toggled, ['o0']);
  assert.deepEqual(picked, []);
});

test('keyboard: arrows toggle parents, Enter and Space only jump', () => {
  const plugin = loadPlugin();
  const open = renderOutline(plugin, { o0: true });
  open.rows[0].props.onKeyDown(keyEvent('Enter'));
  open.rows[0].props.onKeyDown(keyEvent(' '));
  assert.deepEqual(open.picked, ['o0', 'o0']);
  assert.deepEqual(open.toggled, []);
  open.rows[0].props.onKeyDown(keyEvent('ArrowLeft'));
  assert.deepEqual(open.toggled, ['o0']);
  open.rows[0].props.onKeyDown(keyEvent('ArrowRight'));
  assert.deepEqual(open.toggled, ['o0']);

  const closed = renderOutline(plugin, {});
  closed.rows[0].props.onKeyDown(keyEvent('ArrowRight'));
  assert.deepEqual(closed.toggled, ['o0']);

  open.rows[1].props.onKeyDown(keyEvent('ArrowRight'));
  assert.deepEqual(open.toggled, ['o0']);
});

test('sizes the panel to just over half the frame, bounded on both ends', () => {
  const plugin = loadPlugin();
  assert.equal(plugin.computePanelWidth(1200), 336);
  assert.equal(plugin.computePanelWidth(500), 275);
  assert.equal(plugin.computePanelWidth(300), 200);
  assert.equal(plugin.computePanelWidth(200), 200);
  assert.equal(plugin.computePanelWidth(2000), 336);
});

test('scrolls smoothly to nearby pages and jumps instantly across the viewport', () => {
  const plugin = loadPlugin();
  const choose = plugin.chooseScrollBehavior;
  assert.equal(choose(300, 800), 'smooth');
  assert.equal(choose(-300, 800), 'smooth');
  assert.equal(choose(800, 800), 'smooth');
  assert.equal(choose(801, 800), 'instant');
  assert.equal(choose(-5000, 800), 'instant');
});
