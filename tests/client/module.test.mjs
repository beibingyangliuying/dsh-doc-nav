import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';

const source = await readFile(new URL('../../client/client.js', import.meta.url), 'utf8');

/** Execute client.js against a stub module loader and return the plugin exports. */
function loadPlugin({ storage } = {}) {
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
    localStorage: storage ?? { getItem: () => null, setItem: () => {}, removeItem: () => {} },
    devicePixelRatio: 1,
  };
  runInNewContext(source, { window, document, console });
  assert.ok(captured, 'module loader called');
  assert.equal(captured.id, '@beibingyangliuying/dsh-sidebar-doc-nav');
  const requireStub = (id) => {
    if (id === 'react') return react;
    if (id === 'react-dom') return { createPortal: (node) => node };
    throw new Error(`unexpected require ${id}`);
  };
  return { ...captured.factory(requireStub), styleTags };
}

/** Build an in-memory localStorage stand-in that keeps writes between calls. */
function createMemoryStorage(initial = {}) {
  const data = new Map(Object.entries(initial));
  return {
    getItem: (key) => (data.has(key) ? data.get(key) : null),
    setItem: (key, value) => { data.set(key, String(value)); },
    removeItem: (key) => { data.delete(key); },
  };
}

/** Build a stub plugin context that records slot registrations and injected services. */
function createContext() {
  const registered = [];
  const effects = [];
  const serviceRequests = [];
  const renders = [];
  const remote = {
    officeKit: {
      render: async (sessionId, path, priority, signal) => {
        renders.push({ sessionId, path, priority, signal });
        return { ok: true, value: { data: new Uint8Array([1, 2, 3]) } };
      },
    },
  };
  const ctx = {
    effect: (factory, label) => { effects.push(label); factory(); },
    inject: (services, run) => { serviceRequests.push(services); run({ remote }); },
    slots: {
      inject: (slotName, run) => { registered.push({ slotName, ...run() }); },
      register: (definition, component) => ({ definition, component }),
    },
  };
  return { ctx, registered, effects, serviceRequests, renders };
}

test('registers the PDF action and the Office list action', () => {
  const plugin = loadPlugin();
  const { ctx, registered, effects, serviceRequests } = createContext();
  plugin.apply(ctx);
  assert.equal(plugin.inject.includes('slots'), true);
  assert.equal(registered.length, 2);
  assert.equal(registered[0].slotName, 'sidebar.right.tab.document.action');
  assert.equal(registered[0].definition.name, 'sidebar.right.tab.document.action');
  assert.equal(registered[0].definition.key, '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/pdf');
  assert.equal(typeof registered[0].definition.key, 'string');
  assert.equal(registered[1].slotName, 'sidebar.right.tab.document.actions');
  assert.equal(registered[1].definition.name, 'sidebar.right.tab.document.actions');
  assert.equal(registered[1].definition.id, 'dsh-sidebar-doc-nav-office');
  assert.equal(registered[1].definition.order, 10);
  assert.equal(JSON.stringify(serviceRequests[0]), JSON.stringify(['remote', 'remote.officeKit']));
  assert.equal(effects.length, 1);
});


test('offers the navigation action for Office files only', () => {
  const plugin = loadPlugin();
  const { ctx, registered } = createContext();
  plugin.apply(ctx);
  const office = registered[1].component;
  assert.equal(office({ absolutePath: 'C:/w/报告.pdf', sessionId: 's1' }), null);
  assert.equal(office({ absolutePath: 'C:/w/报告.txt', sessionId: 's1' }), null);
  const deck = office({ absolutePath: 'C:/w/汇报.PPTX', sessionId: 's1' });
  assert.equal(deck.props.source.storageKey, 'office:C:/w/汇报.PPTX');
  assert.equal(deck.props.source.documentKey, 'office:C:/w/汇报.PPTX');
  assert.equal(deck.props.source.eager, false);
});

test('forwards Office conversions to the renderer Remote in the foreground', async () => {
  const plugin = loadPlugin();
  const { ctx, registered, renders } = createContext();
  plugin.apply(ctx);
  const face = registered[1].definition.inject();
  const result = await face.renderOfficePdf('s1', 'C:/w/汇报.pptx', undefined);
  assert.equal(result.ok, true);
  assert.deepEqual(renders.map((call) => [call.sessionId, call.path, call.priority]), [['s1', 'C:/w/汇报.pptx', 'foreground']]);
});

test('reserves the page shape for a thumbnail before it paints', () => {
  const plugin = loadPlugin();
  assert.equal(plugin.getPageRatio({ width: 1600, height: 900 }), 16 / 9);
  assert.equal(plugin.getPageRatio({ width: 595, height: 842 }), 595 / 842);
  assert.equal(plugin.getPageRatio({ width: 0, height: 842 }), 0.75);
  assert.equal(plugin.getPageRatio(null), 0.75);
});

test('recognizes Office extensions case-insensitively', () => {
  const plugin = loadPlugin();
  const isOffice = plugin.isOfficeDocumentPath;
  assert.equal(isOffice('a.pptx'), true);
  assert.equal(isOffice('C:/w/A.DOCX'), true);
  assert.equal(isOffice('ppt'), false);
  assert.equal(isOffice('C:/w.d/ppt'), false);
  assert.equal(isOffice('a.pdf'), false);
  assert.equal(isOffice('a.txt'), false);
  assert.equal(isOffice(undefined), false);
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
  plugin.apply({ effect: (factory) => { factory(); }, inject: () => {}, slots: { inject: () => {}, register: () => ({}) } });
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

test('remembers the last opened page per document', () => {
  const plugin = loadPlugin({ storage: createMemoryStorage() });
  assert.equal(plugin.readStoredPage('doc'), 0);
  plugin.writeStoredPage('doc', 7);
  assert.equal(plugin.readStoredPage('doc'), 7);
  plugin.writeStoredPage('doc', 2.6);
  assert.equal(plugin.readStoredPage('doc'), 2);
  plugin.writeStoredPage('', 4);
  assert.equal(plugin.readStoredPage(''), 0);
});

test('folds stores saved under the previous package names', () => {
  const earliestPages = 'dsh-pdf-reader/v1/pages';
  const previousPages = 'dsh-sidebar-pdf-nav/v1/pages';
  const previousOutline = 'dsh-sidebar-pdf-nav/v1/outline';
  const storage = createMemoryStorage({
    [earliestPages]: JSON.stringify({ old: 4, doc: 1 }),
    [previousPages]: JSON.stringify({ doc: 2 }),
    [previousOutline]: JSON.stringify({ doc: { nodes: { o0: true } } }),
  });
  const plugin = loadPlugin({ storage });
  assert.equal(plugin.readStoredPage('doc'), 2);
  assert.equal(plugin.readStoredPage('old'), 4);
  assert.equal(storage.getItem(earliestPages), null);
  assert.equal(storage.getItem(previousPages), null);
  assert.equal(storage.getItem(previousOutline), null);
  assert.deepEqual(JSON.parse(storage.getItem('dsh-sidebar-doc-nav/v1/pages')), { doc: 2, old: 4 });
  assert.deepEqual(JSON.parse(storage.getItem('dsh-sidebar-doc-nav/v1/outline')), { doc: { nodes: { o0: true } } });
});

test('unwraps rendered Office bytes and names the host error code', () => {
  const plugin = loadPlugin();
  const bytes = plugin.readOfficePdfPayload({ ok: true, value: { data: new Uint8Array([9, 8]) } });
  assert.deepEqual(Array.from(bytes), [9, 8]);
  assert.throws(() => plugin.readOfficePdfPayload({ ok: false, error: { code: 'document-render/failed' } }), /document-render\/failed/);
  assert.throws(() => plugin.readOfficePdfPayload(undefined), /unknown/);
});

test('marks the current page in the thumbnail grid', () => {
  const plugin = loadPlugin();
  const node = plugin.renderThumbsTab({
    docState: { doc: {}, ratio: 0.75 },
    numPages: 3,
    currentPage: 2,
    labelOf: (page) => String(page),
    onJump: () => {},
    root: null,
  });
  assert.equal(node.props.className, 'dpr-grid');
  const cells = node.children[0];
  assert.equal(cells.length, 3);
  assert.match(cells[1].props.className, /is-current/);
  assert.equal(cells[0].children[0].props.page, 1);
  assert.equal(cells[0].children[0].props.ratio, 0.75);
});

test('renders search hits with the emphasized match', () => {
  const plugin = loadPlugin();
  const node = plugin.renderSearchTab({
    search: { status: 'done', results: [{ page: 5, key: '5:0', head: '前文', mark: '关键词', tail: '后文' }], scanned: 9, total: 9 },
    query: '关键词',
    onQuery: () => {},
    onSearch: () => {},
    labelOf: (page) => String(page),
    onJump: () => {},
  });
  assert.equal(node.children[0].children[0].props.value, '关键词');
  assert.equal(node.children[0].children[1].children[0], '找到 1 处');
  assert.equal(node.children[1][0].children[0].children[0], '第 5 页');
  assert.equal(node.children[1][0].children[1].children[1].children[0], '关键词');
});
