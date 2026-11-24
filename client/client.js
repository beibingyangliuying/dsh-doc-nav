window.__ModuleLoader__.load({
  id: '@beibingyangliuying/dsh-sidebar-doc-nav',
  factory: (require) => {
    var module = { exports: {} };
    var exports = module.exports;

    var reactModule = require('react');
    var React = reactModule && typeof reactModule.createElement === 'function' ? reactModule : reactModule.default;
    var h = React.createElement;
    var reactDomModule = require('react-dom');
    var createPortal = reactDomModule && typeof reactDomModule.createPortal === 'function'
      ? reactDomModule.createPortal
      : (reactDomModule && reactDomModule.default && reactDomModule.default.createPortal);

    var PDF_BODY_ID = '@deepseek-ai/dsh-client-ui-sidebar-documentpreview/pdf';
    var PACKAGE_ID = '@beibingyangliuying/dsh-sidebar-doc-nav';
    var ASSET_BASE = '/dsh-sidebar-doc-nav-assets/pdfjs/';
    var ASSET_VERSION = '6.5.438-dshpdf1';
    var STORE_PAGES = 'dsh-sidebar-doc-nav/v1/pages';
    var STORE_OUTLINE = 'dsh-sidebar-doc-nav/v1/outline';
    var STORE_UI = 'dsh-sidebar-doc-nav/v1/ui';
    var FRAME_SELECTOR = '[data-document-preview]';
    var SCROLL_SELECTOR = '[data-document-zoom-scrollport]';
    var PANEL_WIDTH = 336;
    var DEFAULT_EXPAND_DEPTH = 2;

    var CSS = [
      '.dpr-btn{width:28px;height:28px;color:var(--dsw-alias-label-secondary);border-radius:var(--dsw-radius-sm);cursor:pointer;background:0 0;border:none;flex:none;justify-content:center;align-items:center;padding:6px;line-height:1;display:inline-flex}',
      '.dpr-btn svg{width:15px;height:15px}',
      '.dpr-btn:hover,.dpr-btn[aria-expanded=true]{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}',
      '.dpr-panel{position:fixed;z-index:80;display:flex;flex-direction:column;min-height:0;box-sizing:border-box;background:var(--dsw-alias-bg-base);border:0;border-right:1px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 24%, transparent);border-radius:0;box-shadow:none;font-family:var(--dsw-font,sans-serif);font-size:13px;color:var(--dsw-alias-label-primary);overflow:hidden}',
      '.dpr-head{display:flex;align-items:center;gap:4px;padding:6px 6px 0 6px;flex:none}',
      '.dpr-tabs{display:flex;gap:2px;flex:1;min-width:0}',
      '.dpr-tab{appearance:none;border:none;background:0 0;color:var(--dsw-alias-label-secondary);font:inherit;font-size:12px;line-height:1;padding:7px 9px;border-radius:var(--dsw-radius-sm);cursor:pointer;white-space:nowrap}',
      '.dpr-tab:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dpr-tab[aria-selected=true]{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary);font-weight:600}',
      '.dpr-close{appearance:none;border:none;background:0 0;color:var(--dsw-alias-label-secondary);cursor:pointer;width:26px;height:26px;border-radius:var(--dsw-radius-sm);font-size:16px;line-height:1;padding:0;flex:none}',
      '.dpr-close:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dpr-pagebar{display:flex;align-items:center;gap:6px;padding:6px 10px 8px;flex:none;color:var(--dsw-alias-label-secondary);font-size:12px;border-bottom:1px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 14%, transparent)}',
      '.dpr-pagebar-input{appearance:textfield;width:56px;font:inherit;font-size:12px;padding:3px 6px;text-align:center;color:var(--dsw-alias-label-primary);background:color-mix(in srgb, var(--dsw-alias-label-secondary) 10%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 22%, transparent);border-radius:4px;outline:none}',
      '.dpr-pagebar-input:focus{border-color:var(--dsw-alias-label-primary)}',
      '.dpr-body{flex:1;min-height:0;overflow:auto;overscroll-behavior:contain;padding:4px 0 8px}',
      '.dpr-body::-webkit-scrollbar{width:8px}',
      '.dpr-body::-webkit-scrollbar-thumb{background:color-mix(in srgb, var(--dsw-alias-label-secondary) 32%, transparent);border-radius:4px}',
      '.dpr-row{display:flex;align-items:flex-start;gap:4px;padding:5px 8px;cursor:pointer;border-radius:4px;margin:0 4px;line-height:1.45}',
      '.dpr-row:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dpr-row.is-current{background:color-mix(in srgb, var(--dsw-alias-label-primary) 12%, transparent)}',
      '.dpr-row.is-current .dpr-row-title{font-weight:600}',
      '.dpr-row-title{flex:1;min-width:0;word-break:break-word}',
      '.dpr-row-page{flex:none;color:var(--dsw-alias-label-secondary);font-size:11px;padding-left:6px;font-variant-numeric:tabular-nums}',
      '.dpr-caret{appearance:none;border:none;background:0 0;color:var(--dsw-alias-label-secondary);width:20px;height:22px;margin:-3px 0 -3px -4px;padding:0;flex:none;cursor:pointer;font-size:11px;line-height:1;transition:transform .12s ease;border-radius:3px}',
      '.dpr-caret:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dpr-caret.is-open{transform:rotate(90deg)}',
      '.dpr-caret-empty{cursor:default;visibility:hidden}',
      '.dpr-outline-tools{display:flex;align-items:center;gap:2px;padding:0 6px 4px 6px;flex:none}',
      '.dpr-tool{appearance:none;border:none;background:0 0;color:var(--dsw-alias-label-secondary);font:inherit;font-size:11px;line-height:1;padding:4px 6px;border-radius:3px;cursor:pointer}',
      '.dpr-tool:hover{background:var(--dsw-alias-interactive-bg-hover);color:var(--dsw-alias-label-primary)}',
      '.dpr-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;padding:8px 10px}',
      '.dpr-thumb{display:flex;flex-direction:column;gap:4px;cursor:pointer;border-radius:4px;padding:3px;border:1px solid transparent}',
      '.dpr-thumb:hover{border-color:color-mix(in srgb, var(--dsw-alias-label-secondary) 30%, transparent)}',
      '.dpr-thumb.is-current{border-color:var(--dsw-alias-label-primary);background:color-mix(in srgb, var(--dsw-alias-label-primary) 8%, transparent)}',
      '.dpr-thumb-canvas{display:block;width:100%;height:auto;background:var(--dsw-alias-bg-skeleton);border-radius:2px}',
      '.dpr-thumb-label{font-size:11px;color:var(--dsw-alias-label-secondary);text-align:center;font-variant-numeric:tabular-nums}',
      '.dpr-search{padding:8px 10px 4px;display:flex;flex-direction:column;gap:8px}',
      '.dpr-search-input{appearance:none;width:100%;box-sizing:border-box;font:inherit;font-size:12px;padding:6px 8px;color:var(--dsw-alias-label-primary);background:color-mix(in srgb, var(--dsw-alias-label-secondary) 10%, transparent);border:1px solid color-mix(in srgb, var(--dsw-alias-label-secondary) 22%, transparent);border-radius:4px;outline:none}',
      '.dpr-search-input:focus{border-color:var(--dsw-alias-label-primary)}',
      '.dpr-hint{padding:6px 10px 10px;color:var(--dsw-alias-label-secondary);font-size:12px;line-height:1.5}',
      '.dpr-hit{display:flex;flex-direction:column;gap:2px;padding:6px 10px;cursor:pointer;border-radius:4px;margin:0 4px}',
      '.dpr-hit:hover{background:var(--dsw-alias-interactive-bg-hover)}',
      '.dpr-hit-page{font-size:11px;color:var(--dsw-alias-label-secondary);font-variant-numeric:tabular-nums}',
      '.dpr-hit-text{font-size:12px;line-height:1.45;word-break:break-word}',
      '.dpr-hit-mark{background:color-mix(in srgb, #f5c542 55%, transparent);color:inherit;border-radius:2px;padding:0 1px}',
    ].join('\n');

    function installStyles() {
      if (document.querySelector('style[data-dsh-doc-nav]') !== null) return function () {};
      var tag = document.createElement('style');
      tag.dataset.dshDocNav = 'styles';
      tag.textContent = CSS;
      document.head.appendChild(tag);
      return function () { tag.remove(); };
    }

    /**
     * Read a keyed JSON store from local storage.
     *
     * @param storeKey - local storage key holding an object of records.
     * @returns the stored object, or an empty one when absent or unreadable.
     */
    function readStore(storeKey) {
      try {
        var raw = window.localStorage.getItem(storeKey);
        var parsed = raw === null ? null : JSON.parse(raw);
        return parsed !== null && typeof parsed === 'object' ? parsed : {};
      } catch (error) {
        return {};
      }
    }

    /**
     * Replace a keyed JSON store in local storage.
     *
     * @param storeKey - local storage key to write.
     * @param value - the object to persist.
     */
    function writeStore(storeKey, value) {
      try {
        window.localStorage.setItem(storeKey, JSON.stringify(value));
      } catch (error) {
        /* storage unavailable */
      }
    }

    /**
     * Read one record from a keyed store.
     *
     * @param storeKey - local storage key holding an object of records.
     * @param key - record key inside that store.
     * @returns the stored record, or undefined when absent.
     */
    function readRecord(storeKey, key) {
      migrateLegacyStores();
      return readStore(storeKey)[key];
    }

    /**
     * Write one record into a keyed store, leaving its siblings intact.
     *
     * @param storeKey - local storage key holding an object of records.
     * @param key - record key inside that store.
     * @param value - the record to persist.
     */
    function writeRecord(storeKey, key, value) {
      var all = readStore(storeKey);
      all[key] = value;
      writeStore(storeKey, all);
    }

    // Store names used before the plugin grew Office support; records found
    // there are folded into the current keys once, then dropped.
    var LEGACY_STORES = [
      { current: STORE_PAGES, previous: ['dsh-sidebar-pdf-nav/v1/pages', 'dsh-pdf-reader/v1/pages'] },
      { current: STORE_OUTLINE, previous: ['dsh-sidebar-pdf-nav/v1/outline'] },
      { current: STORE_UI, previous: ['dsh-sidebar-pdf-nav/v1/ui'] },
    ];

    var storesMigrated = false;

    /**
     * Fold records saved under previous store names into the current stores.
     *
     * A record already present under the current name wins, so renaming the
     * package never overwrites state written after the rename. The old keys are
     * dropped once their records are copied.
     */
    function migrateLegacyStores() {
      if (storesMigrated === true) return;
      storesMigrated = true;
      for (var index = 0; index < LEGACY_STORES.length; index += 1) {
        var store = LEGACY_STORES[index];
        var merged = readStore(store.current);
        var copied = false;
        for (var legacyIndex = 0; legacyIndex < store.previous.length; legacyIndex += 1) {
          var legacyKey = store.previous[legacyIndex];
          var legacy = readStore(legacyKey);
          var names = Object.keys(legacy);
          if (names.length === 0) continue;
          copied = true;
          for (var nameIndex = 0; nameIndex < names.length; nameIndex += 1) {
            var name = names[nameIndex];
            if (Object.prototype.hasOwnProperty.call(merged, name)) continue;
            merged[name] = legacy[name];
          }
          try {
            window.localStorage.removeItem(legacyKey);
          } catch (error) {
            /* storage unavailable */
          }
        }
        if (copied === true) writeStore(store.current, merged);
      }
    }

    /**
     * Read the last opened page for a document.
     *
     * @param key - document storage key.
     * @returns the stored page, or 0 when none was remembered.
     */
    function readStoredPage(key) {
      if (key === undefined || key === '') return 0;
      var value = readRecord(STORE_PAGES, key);
      return typeof value === 'number' && value >= 1 ? Math.floor(value) : 0;
    }

    /**
     * Remember the last opened page for a document.
     *
     * @param key - document storage key.
     * @param page - page number to remember.
     */
    function writeStoredPage(key, page) {
      if (key === undefined || key === '') return;
      writeRecord(STORE_PAGES, key, page);
    }

    function findFrame(node) {
      return node !== null && node !== undefined && typeof node.closest === 'function' ? node.closest(FRAME_SELECTOR) : null;
    }

    function findScrollport(node) {
      var frame = findFrame(node);
      return (frame === null ? document : frame).querySelector(SCROLL_SELECTOR);
    }

    function findPageElement(port, page) {
      if (port === null) return null;
      return port.querySelector('[data-pdf-page="' + page + '"]');
    }

    /**
     * Derive the panel width from the preview frame it shares space with.
     *
     * The panel takes just over half the frame, bounded so a narrow pane keeps
     * the page readable and a wide one is not swallowed by the panel.
     *
     * @param frameWidth - frame width in CSS pixels.
     * @returns panel width in CSS pixels.
     */
    function computePanelWidth(frameWidth) {
      var width = Math.round(Math.min(PANEL_WIDTH, Math.max(240, frameWidth * 0.55)));
      return Math.min(width, Math.max(200, Math.round(frameWidth - 200)));
    }

    var OFFICE_EXTENSIONS = { doc: true, docx: true, ppt: true, pptx: true };

    /**
     * Tell whether a path names an Office document the host can convert.
     *
     * @param path - absolute workspace path.
     * @returns true for doc, docx, ppt and pptx, in any case.
     */
    function isOfficeDocumentPath(path) {
      if (typeof path !== 'string') return false;
      var cut = path.lastIndexOf('.');
      var slash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));
      if (cut <= slash + 1) return false;
      return OFFICE_EXTENSIONS[path.slice(cut + 1).toLowerCase()] === true;
    }

    var payloadIds = new WeakMap();
    var payloadSeq = 0;

    /**
     * Identify one payload instance so a re-read of the same file reparses.
     *
     * The host hands the same file down as a fresh array on every read, so the
     * array itself stands in for the document revision.
     *
     * @param payload - bytes handed down by the host, if any.
     * @returns an id stable for that exact array, or 0 when there is no payload.
     */
    function payloadIdOf(payload) {
      if (typeof payload !== 'object' || payload === null) return 0;
      var known = payloadIds.get(payload);
      if (known !== undefined) return known;
      payloadSeq += 1;
      payloadIds.set(payload, payloadSeq);
      return payloadSeq;
    }

    /**
     * Derive the on-screen shape of one page for its thumbnail box.
     *
     * A landscape page such as a slide must reserve a wide box before its canvas
     * paints, otherwise the grid reflows once the render lands.
     *
     * @param viewport - the page viewport at scale 1.
     * @returns width divided by height, or 3:4 when the viewport is unusable.
     */
    function getPageRatio(viewport) {
      if (viewport === undefined || viewport === null) return 0.75;
      var width = Number(viewport.width);
      var height = Number(viewport.height);
      if (!(width > 0) || !(height > 0)) return 0.75;
      return width / height;
    }

    var PAGE_TOP_GAP = 3;

    /**
     * Choose how far to travel when a reader picks a page.
     *
     * A page inside the viewport is scrolled to under its own momentum so the
     * movement stays legible; a page beyond it is placed instantly, because an
     * animated crossing renders every page in between and reads as a long slide.
     *
     * @param delta - target top minus scrollport top, in CSS pixels; negative when the target is above.
     * @param viewport - visible height of the scrollport in CSS pixels.
     * @returns 'smooth' for nearby pages, 'instant' otherwise.
     */
    function chooseScrollBehavior(delta, viewport) {
      return Math.abs(delta) <= viewport ? 'smooth' : 'instant';
    }

    /**
     * Hold a page element at the top of its scrollport until the layout settles.
     *
     * Corrections are written only while the scrollport is at rest, so they never
     * cancel a native smooth scroll, and the observer detaches on the first user
     * gesture so a hand-driven scroll is not pulled back.
     *
     * @param port - scrollable element owning the page.
     * @param target - page element to keep aligned.
     * @param timeoutMs - budget after which no further correction is attempted.
     * @returns detaches the observer early.
     */
    function alignPageToTop(port, target, timeoutMs) {
      var deadline = Date.now() + timeoutMs;
      var lastTop = port.scrollTop;
      var rounds = 0;
      var timer = 0;
      var stopped = false;
      var stop = function () {
        if (stopped === true) return;
        stopped = true;
        window.clearTimeout(timer);
        port.removeEventListener('wheel', stop);
        port.removeEventListener('touchstart', stop);
        port.removeEventListener('pointerdown', stop);
      };
      var tick = function () {
        if (stopped === true) return;
        if (Date.now() > deadline || port.isConnected !== true) { stop(); return; }
        var top = port.scrollTop;
        if (Math.abs(top - lastTop) > 0.5) {
          lastTop = top;
          timer = window.setTimeout(tick, 60);
          return;
        }
        lastTop = top;
        var delta = target.getBoundingClientRect().top - port.getBoundingClientRect().top - PAGE_TOP_GAP;
        if (Math.abs(delta) > 1.5) {
          port.scrollTop = top + delta;
          lastTop = port.scrollTop;
        }
        rounds += 1;
        if (rounds >= 5) { stop(); return; }
        timer = window.setTimeout(tick, 120);
      };
      port.addEventListener('wheel', stop, { passive: true });
      port.addEventListener('touchstart', stop, { passive: true });
      port.addEventListener('pointerdown', stop, { passive: true });
      timer = window.setTimeout(tick, 60);
      return stop;
    }

    var enginePromise;

    function loadEngine() {
      if (enginePromise === undefined) {
        enginePromise = import(ASSET_BASE + 'pdf.bundle.js?v=' + ASSET_VERSION).then(function (engine) {
          if (engine === null || typeof engine.getDocument !== 'function' || engine.GlobalWorkerOptions === undefined) {
            throw new Error('PDF 引擎资源格式不正确');
          }
          engine.GlobalWorkerOptions.workerSrc = ASSET_BASE + 'pdf.worker.mjs?v=' + ASSET_VERSION;
          try {
            engine.GlobalWorkerOptions.rendererSrc = ASSET_BASE + 'pdf.renderer.mjs?v=' + ASSET_VERSION;
          } catch (error) {
            /* older engines do not expose rendererSrc */
          }
          return engine;
        }).catch(function (error) {
          enginePromise = undefined;
          throw error;
        });
      }
      return enginePromise;
    }

    function openDocument(engine, bytes) {
      return engine.getDocument({
        data: bytes.slice(0),
        cMapUrl: ASSET_BASE + 'cmaps/',
        cMapPacked: true,
        standardFontDataUrl: ASSET_BASE + 'standard_fonts/',
        wasmUrl: ASSET_BASE + 'wasm/',
        iccUrl: ASSET_BASE + 'iccs/',
      }).promise;
    }

    function resolveDestinationPage(doc, dest) {
      var initial = typeof dest === 'string' ? doc.getDestination(dest) : Promise.resolve(dest);
      return initial.then(function (resolved) {
        if (!Array.isArray(resolved) || resolved.length === 0) return 0;
        var ref = resolved[0];
        if (typeof ref === 'number') return ref + 1;
        if (ref === null || typeof ref !== 'object') return 0;
        return doc.getPageIndex(ref).then(function (index) { return index + 1; }, function () { return 0; });
      }, function () { return 0; });
    }

    function readOutline(doc) {
      return doc.getOutline().then(function (raw) {
        var items = Array.isArray(raw) ? raw : [];
        var flat = [];
        function build(list, depth) {
          return list.map(function (item) {
            var node = {
              id: 'o' + flat.length,
              title: String(item.title === null || item.title === undefined ? '' : item.title).replace(/\s+/g, ' ').trim() || '(未命名书签)',
              depth: depth,
              dest: item.dest,
              page: 0,
              children: [],
            };
            flat.push(node);
            if (Array.isArray(item.items) && item.items.length > 0) node.children = build(item.items, depth + 1);
            return node;
          });
        }
        var tree = build(items, 0);
        return Promise.all(flat.map(function (node) {
          return resolveDestinationPage(doc, node.dest).then(function (page) { node.page = page; });
        })).then(function () { return { tree: tree, flat: flat, total: flat.length }; });
      }, function () { return { tree: [], flat: [], total: 0 }; });
    }

    function getPageText(doc, pageNumber, cache) {
      var cached = cache.get(pageNumber);
      if (cached !== undefined) return Promise.resolve(cached);
      return doc.getPage(pageNumber).then(function (page) {
        return page.getTextContent().then(function (content) {
          var text = '';
          var items = content.items || [];
          for (var index = 0; index < items.length; index += 1) {
            var item = items[index];
            if (item === null || typeof item.str !== 'string') continue;
            text += item.str;
            text += item.hasEOL === true ? '\n' : ' ';
          }
          var normalized = text.replace(/[ \t]+/g, ' ').trim();
          cache.set(pageNumber, normalized);
          try { page.cleanup(); } catch (error) { /* already released */ }
          return normalized;
        });
      });
    }

    function buildSnippet(text, index, length) {
      var start = Math.max(0, index - 42);
      var end = Math.min(text.length, index + length + 52);
      var head = text.slice(start, index);
      var mark = text.slice(index, index + length);
      var tail = text.slice(index + length, end);
      return { head: (start > 0 ? '…' : '') + head, mark: mark, tail: tail + (end < text.length ? '…' : '') };
    }

    function currentOutlineNode(outline, page) {
      var best = null;
      for (var index = 0; index < outline.flat.length; index += 1) {
        var node = outline.flat[index];
        if (node.page > 0 && node.page <= page) best = node;
      }
      return best;
    }

    function buildDefaultExpansion(flat, maxDepth) {
      var map = {};
      for (var index = 0; index < flat.length; index += 1) {
        var node = flat[index];
        if (node.children.length > 0 && node.depth < maxDepth) map[node.id] = true;
      }
      return map;
    }

    function Thumbnail(props) {
      var holder = React.useRef(null);
      var canvasRef = React.useRef(null);
      var visibleState = React.useState(false);
      var visible = visibleState[0];
      var setVisible = visibleState[1];
      React.useEffect(function () {
        var node = holder.current;
        if (node === null || typeof IntersectionObserver !== 'function') {
          setVisible(true);
          return undefined;
        }
        var observer = new IntersectionObserver(function (entries) {
          for (var index = 0; index < entries.length; index += 1) {
            if (entries[index].isIntersecting === true) {
              setVisible(true);
              observer.disconnect();
              return;
            }
          }
        }, { root: props.root === undefined ? null : props.root, rootMargin: '200px' });
        observer.observe(node);
        return function () { observer.disconnect(); };
      }, []);
      var ratio = typeof props.ratio === 'number' && props.ratio > 0 ? props.ratio : 0.75;

      React.useEffect(function () {
        if (visible !== true || props.doc === undefined) return undefined;
        var cancelled = false;
        var renderTask;
        props.doc.getPage(props.page).then(function (page) {
          if (cancelled === true) return undefined;
          var canvas = canvasRef.current;
          if (canvas === null) return undefined;
          var base = page.getViewport({ scale: 1 });
          var measured = getPageRatio(base);
          if (Math.abs(measured - ratio) > 0.01) canvas.style.aspectRatio = String(measured);
          var density = Math.min(2, window.devicePixelRatio || 1);
          var scale = (props.width / base.width) * density;
          var viewport = page.getViewport({ scale: scale });
          canvas.width = Math.max(1, Math.floor(viewport.width));
          canvas.height = Math.max(1, Math.floor(viewport.height));
          var context = canvas.getContext('2d');
          if (context === null) return undefined;
          context.save();
          context.fillStyle = '#ffffff';
          context.fillRect(0, 0, canvas.width, canvas.height);
          context.restore();
          renderTask = page.render({ canvasContext: context, viewport: viewport });
          return renderTask.promise.then(function () {
            try { page.cleanup(); } catch (error) { /* already released */ }
          }, function () {});
        }, function () {});
        return function () {
          cancelled = true;
          if (renderTask !== undefined) {
            try { renderTask.cancel(); } catch (error) { /* already settled */ }
          }
        };
      }, [visible, props.doc, props.page, props.width]);
      return h('div', { ref: holder, className: 'dpr-thumb' }, h('canvas', { ref: canvasRef, className: 'dpr-thumb-canvas', style: { aspectRatio: String(ratio) } }), h('span', { className: 'dpr-thumb-label' }, props.label));
    }

    function OutlineRows(props) {
      var rows = [];
      function walk(list) {
        for (var index = 0; index < list.length; index += 1) {
          var node = list[index];
          var hasChildren = node.children.length > 0;
          var expanded = props.expanded[node.id] === true;
          var selected = props.currentNodeId === node.id;
          var activate = function (target) {
            return function () {
              props.onPick(target);
            };
          }(node);
          var onRowKeyDown = function (target) {
            return function (event) {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                props.onPick(target);
                return;
              }
              if (target.children.length === 0) return;
              var isOpen = props.expanded[target.id] === true;
              if ((event.key === 'ArrowRight' && isOpen !== true) || (event.key === 'ArrowLeft' && isOpen === true)) {
                event.preventDefault();
                props.onToggle(target.id);
              }
            };
          }(node);
          rows.push(h('div', {
            key: node.id,
            className: 'dpr-row' + (selected ? ' is-current' : ''),
            style: { paddingLeft: String(4 + node.depth * 13) + 'px' },
            role: 'button',
            tabIndex: 0,
            'data-outline-node': node.id,
            'data-outline-current': selected ? 'true' : undefined,
            onClick: activate,
            onKeyDown: onRowKeyDown,
          },
            hasChildren === true
              ? h('button', {
                  type: 'button',
                  className: 'dpr-caret' + (expanded ? ' is-open' : ''),
                  'aria-label': expanded ? '折叠' : '展开',
                  'aria-expanded': expanded,
                  tabIndex: -1,
                  onClick: function (target) { return function (event) { event.stopPropagation(); props.onToggle(target.id); }; }(node),
                }, '\u25B8')
              : h('span', { className: 'dpr-caret dpr-caret-empty', 'aria-hidden': 'true' }, '\u25B8'),
            h('span', { className: 'dpr-row-title' }, node.title),
            node.page > 0 ? h('span', { className: 'dpr-row-page' }, String(node.page)) : null,
          ));
          if (hasChildren === true && expanded === true) walk(node.children);
        }
      }
      walk(props.nodes);
      return h(React.Fragment, null, rows);
    }

    function TocPanel(props) {
      var docState = props.docState;
      var bodyRef = React.useRef(null);
      var pageInputRef = React.useRef(null);
      var tab = props.tab;
      var outline = docState.outline;
      var currentNode = tab === 'outline' && outline !== undefined ? currentOutlineNode(outline, props.currentPage) : null;
      var currentNodeId = currentNode === null ? '' : currentNode.id;

      React.useEffect(function () {
        if (tab !== 'outline') return;
        var body = bodyRef.current;
        if (body === null) return;
        var row = body.querySelector('[data-outline-current="true"]');
        if (row === null) return;
        var rowRect = row.getBoundingClientRect();
        var bodyRect = body.getBoundingClientRect();
        if (rowRect.top < bodyRect.top || rowRect.bottom > bodyRect.bottom) {
          row.scrollIntoView({ block: 'nearest' });
        }
      }, [currentNodeId, tab]);

      React.useEffect(function () {
        var input = pageInputRef.current;
        if (input === null) return;
        if (document.activeElement === input) return;
        input.value = String(props.currentPage);
      }, [props.currentPage]);

      function submitPage() {
        var input = pageInputRef.current;
        if (input === null) return;
        var value = Number(String(input.value).trim());
        if (!Number.isFinite(value)) {
          input.value = String(props.currentPage);
          return;
        }
        var page = Math.max(1, Math.min(props.numPages, Math.floor(value)));
        input.value = String(page);
        props.onJump(page);
        input.blur();
      }

      var tabs = [
        { id: 'outline', label: '目录' + (outline !== undefined && outline.total > 0 ? ' (' + outline.total + ')' : '') },
        { id: 'thumbs', label: '缩略图' },
        { id: 'search', label: '搜索' },
      ];

      var body = null;
      if (docState.status === 'loading') {
        body = renderHint(props.loadingLabel);
      } else if (docState.status === 'error') {
        body = renderHint('PDF 解析失败：' + String(docState.error && docState.error.message ? docState.error.message : docState.error));
      } else if (docState.status !== 'ready') {
        body = renderHint(props.idleLabel);
      } else if (tab === 'outline') {
        body = renderOutlineTab({
          outline: outline,
          currentNodeId: currentNodeId,
          expanded: props.expanded,
          onExpandAll: props.onExpandAll,
          onCollapseAll: props.onCollapseAll,
          onToggle: props.onToggle,
          onJump: props.onJump,
        });
      } else if (tab === 'thumbs') {
        body = renderThumbsTab({
          docState: docState,
          numPages: props.numPages,
          currentPage: props.currentPage,
          labelOf: props.labelOf,
          onJump: props.onJump,
          root: bodyRef.current,
        });
      } else {
        body = renderSearchTab({
          search: props.search,
          query: props.query,
          onQuery: props.onQuery,
          onSearch: props.onSearch,
          labelOf: props.labelOf,
          onJump: props.onJump,
        });
      }

      return h('div', {
        className: 'dpr-panel',
        role: 'dialog',
        'aria-label': props.panelLabel,
        'data-dsh-doc-nav-panel': true,
        style: { left: String(props.anchor.left) + 'px', top: String(props.anchor.top) + 'px', width: String(props.anchor.width) + 'px', height: String(props.anchor.height) + 'px' },
      },
        h('div', { className: 'dpr-head' },
          h('div', { className: 'dpr-tabs', role: 'tablist' },
            tabs.map(function (entry) {
              return h('button', {
                key: entry.id,
                type: 'button',
                role: 'tab',
                className: 'dpr-tab',
                'aria-selected': tab === entry.id,
                onClick: function () { props.onTab(entry.id); },
              }, entry.label);
            }),
          ),
          h('button', { type: 'button', className: 'dpr-close', 'aria-label': '关闭', title: '关闭 (Esc)', onClick: props.onClose }, '\u00D7'),
        ),
        h('div', { className: 'dpr-pagebar' },
          h('span', null, '跳到第'),
          h('input', {
            ref: pageInputRef,
            className: 'dpr-pagebar-input',
            type: 'text',
            inputMode: 'numeric',
            defaultValue: String(props.currentPage),
            onKeyDown: function (event) { if (event.key === 'Enter') submitPage(); },
            onBlur: function () { var input = pageInputRef.current; if (input !== null) input.value = String(props.currentPage); },
          }),
          h('span', null, '页 / 共 ' + String(props.numPages) + ' 页'),
        ),
        h('div', { className: 'dpr-body', ref: bodyRef }, body),
      );
    }

    /**
     * Render one centered hint line in the panel body.
     *
     * @param text - the message to show.
     * @returns the hint element.
     */
    function renderHint(text) {
      return h('p', { className: 'dpr-hint' }, text);
    }

    /**
     * Render the outline tab: bulk controls plus the bookmark tree.
     *
     * @param props - outline, expansion state and navigation handlers.
     * @returns the outline content, or a hint when the document has no bookmarks.
     */
    function renderOutlineTab(props) {
      var outline = props.outline;
      if (outline === undefined || outline.total === 0) {
        return renderHint('这份 PDF 没有内嵌书签。试试「缩略图」翻页，或用「搜索」定位正文。');
      }
      return h(React.Fragment, null,
        h('div', { className: 'dpr-outline-tools' },
          h('button', { type: 'button', className: 'dpr-tool', onClick: props.onExpandAll }, '展开全部'),
          h('button', { type: 'button', className: 'dpr-tool', onClick: props.onCollapseAll }, '折叠全部'),
        ),
        h(OutlineRows, {
          nodes: outline.tree,
          expanded: props.expanded,
          currentNodeId: props.currentNodeId,
          onPick: function (node) { if (node.page > 0) props.onJump(node.page); },
          onToggle: props.onToggle,
        }),
      );
    }

    /**
     * Render the thumbnail tab as a page grid.
     *
     * @param props - parsed document, page count, current page and handlers.
     * @returns the thumbnail grid.
     */
    function renderThumbsTab(props) {
      var docState = props.docState;
      var cells = [];
      for (var pageNumber = 1; pageNumber <= props.numPages; pageNumber += 1) {
        cells.push(h('div', {
          key: 'thumb-' + pageNumber,
          className: 'dpr-thumb' + (pageNumber === props.currentPage ? ' is-current' : ''),
          onClick: function (target) { return function () { props.onJump(target); }; }(pageNumber),
        }, h(Thumbnail, {
          doc: docState.doc,
          page: pageNumber,
          width: 148,
          root: props.root,
          ratio: docState.ratio,
          label: props.labelOf(pageNumber),
        })));
      }
      return h('div', { className: 'dpr-grid' }, cells);
    }

    /**
     * Render the search tab: query box, progress line and hits.
     *
     * @param props - search state, query and handlers.
     * @returns the search content.
     */
    function renderSearchTab(props) {
      var search = props.search;
      return h(React.Fragment, null,
        h('div', { className: 'dpr-search' },
          h('input', {
            className: 'dpr-search-input',
            type: 'search',
            placeholder: '搜索全文，回车执行',
            value: props.query,
            autoFocus: true,
            onChange: function (event) { props.onQuery(event.target.value); },
            onKeyDown: function (event) { if (event.key === 'Enter') props.onSearch(); },
          }),
          h('span', { className: 'dpr-hit-page' },
            search.status === 'running'
              ? '搜索中… ' + String(search.scanned) + '/' + String(search.total)
              : search.status === 'done'
                ? '找到 ' + String(search.results.length) + ' 处' + (search.results.length >= 200 ? '（仅显示前 200 处）' : '')
                : ''),
        ),
        search.results.map(function (hit) {
          return h('div', { key: hit.key, className: 'dpr-hit', onClick: function () { props.onJump(hit.page); } },
            h('span', { className: 'dpr-hit-page' }, '第 ' + props.labelOf(hit.page) + ' 页'),
            h('span', { className: 'dpr-hit-text' }, hit.head, h('mark', { className: 'dpr-hit-mark' }, hit.mark), hit.tail));
        }),
      );
    }

    /**
     * Parse the document behind a navigation source and track its progress.
     *
     * The hook owns the load token, so a slow read of a retired document can
     * never overwrite a newer one, and it destroys the old document when the key
     * changes or the component unmounts.
     *
     * @param options.source - navigation source: eager flag plus the reader.
     * @param options.documentKey - identity of the document; '' loads nothing.
     * @param options.open - whether the panel is open; lazy sources wait for it.
     * @param options.onReset - called when a new key retires the previous document.
     * @returns the document state.
     */
    function useDocumentLoad(options) {
      var source = options.source;
      var documentKey = options.documentKey;
      var open = options.open;
      var onReset = options.onReset;

      var stateValue = React.useState({ status: 'idle' });
      var docState = stateValue[0];
      var setDocState = stateValue[1];
      var readRef = React.useRef(source.read);
      var documentKeyRef = React.useRef(documentKey);
      var loadTokenRef = React.useRef(0);
      var activeKeyRef = React.useRef('');
      var docRef = React.useRef(undefined);
      var resetRef = React.useRef(onReset);

      // The host re-renders with a fresh source object, so the refs carry the
      // current reader and key into loads that outlive this render.
      readRef.current = source.read;
      documentKeyRef.current = documentKey;
      resetRef.current = onReset;

      var startLoad = React.useCallback(function () {
        var key = documentKeyRef.current;
        if (key === '' || activeKeyRef.current === key) return;
        activeKeyRef.current = key;
        loadTokenRef.current += 1;
        var token = loadTokenRef.current;
        var stale = function () { return token !== loadTokenRef.current; };
        var doc;
        setDocState({ status: 'loading' });
        Promise.resolve().then(function () { return readRef.current(); }).then(function (payload) {
          if (stale()) return undefined;
          if (payload === undefined || payload === null) throw new Error('文档内容为空');
          return loadEngine().then(function (engine) { return openDocument(engine, payload); });
        }).then(function (loading) {
          if (loading === undefined) return undefined;
          doc = loading;
          if (stale()) {
            doc.destroy();
            return undefined;
          }
          docRef.current = doc;
          return Promise.all([
            readOutline(doc),
            doc.getPageLabels().catch(function () { return null; }),
            doc.getPage(1).then(function (first) {
              var viewport = first.getViewport({ scale: 1 });
              try { first.cleanup(); } catch (error) { /* already released */ }
              return getPageRatio(viewport);
            }, function () { return 0.75; }),
          ]).then(function (results) {
            if (stale()) return undefined;
            setDocState({
              status: 'ready',
              doc: doc,
              outline: results[0],
              labels: results[1],
              ratio: results[2],
              numPages: doc.numPages,
            });
            return undefined;
          });
        }).catch(function (error) {
          if (stale()) return;
          setDocState({ status: 'error', error: error });
          activeKeyRef.current = '';
        });
      }, []);

      // A new document retires whatever the previous key loaded; the token makes
      // any in-flight read of the old document land as a no-op.
      React.useEffect(function () {
        loadTokenRef.current += 1;
        activeKeyRef.current = '';
        if (resetRef.current !== undefined) resetRef.current();
        setDocState({ status: 'idle' });
        return function () {
          loadTokenRef.current += 1;
          activeKeyRef.current = '';
          var doc = docRef.current;
          docRef.current = undefined;
          if (doc !== undefined) {
            try { doc.destroy(); } catch (error) { /* already destroyed */ }
          }
        };
      }, [documentKey]);

      // An eager source is already parsed by the host, so load it on sight; a lazy
      // one waits for the reader to open the panel.
      React.useEffect(function () {
        if (source.eager !== true) return undefined;
        startLoad();
        return undefined;
      }, [documentKey, source.eager, startLoad]);

      React.useEffect(function () {
        if (source.eager === true || open !== true) return undefined;
        startLoad();
        return undefined;
      }, [documentKey, source.eager, open, startLoad]);

      return docState;
    }

    /**
     * Track which page the reader is looking at and remember it per document.
     *
     * The visible page is the one with the largest overlap with the scrollport,
     * measured on an animation frame so a fast scroll never runs a layout per
     * event. Writes are debounced, so paging through a document does not hit
     * storage on every frame.
     *
     * @param options.status - document state; tracking starts when 'ready'.
     * @param options.buttonRef - the toggle button, used to find the scrollport.
     * @param options.storageKey - key the remembered page is stored under.
     * @returns the current page and its setter.
     */
    function usePageTracking(options) {
      var status = options.status;
      var buttonRef = options.buttonRef;
      var storageKey = options.storageKey;

      var state = React.useState(1);
      var page = state[0];
      var setPage = state[1];

      React.useEffect(function () {
        if (status !== 'ready') return undefined;
        var port = findScrollport(buttonRef.current);
        if (port === null) return undefined;
        var raf = 0;
        var measure = function () {
          raf = 0;
          var area = port.getBoundingClientRect();
          var nodes = port.querySelectorAll('[data-pdf-page]');
          var best = 1;
          var bestVisible = -1;
          for (var index = 0; index < nodes.length; index += 1) {
            var box = nodes[index].getBoundingClientRect();
            var visible = Math.min(box.bottom, area.bottom) - Math.max(box.top, area.top);
            if (visible > bestVisible) {
              bestVisible = visible;
              best = Number(nodes[index].getAttribute('data-pdf-page'));
            }
          }
          if (best >= 1) setPage(best);
        };
        var schedule = function () { if (raf === 0) raf = window.requestAnimationFrame(measure); };
        port.addEventListener('scroll', schedule, { passive: true });
        measure();
        var observer = typeof ResizeObserver === 'function' ? new ResizeObserver(schedule) : null;
        if (observer !== null) observer.observe(port);
        return function () {
          port.removeEventListener('scroll', schedule);
          if (observer !== null) observer.disconnect();
          if (raf !== 0) window.cancelAnimationFrame(raf);
        };
      }, [status, buttonRef]);

      React.useEffect(function () {
        if (status !== 'ready') return undefined;
        var timer = window.setTimeout(function () { writeStoredPage(storageKey, page); }, 600);
        return function () { window.clearTimeout(timer); };
      }, [page, storageKey, status]);

      return { page: page, setPage: setPage };
    }

    /**
     * Jump to the page the reader left off on, once per document.
     *
     * The first page is the default, so only a remembered page past it is worth
     * restoring; the delay lets the host finish laying out the pages before the
     * jump measures them.
     *
     * @param options.status - document state; restores when 'ready'.
     * @param options.numPages - page count of the ready document.
     * @param options.documentKey - identity of the document being restored.
     * @param options.storageKey - key the remembered page is stored under.
     * @param options.jumpToPage - scrolls the document to a page.
     */
    function useRestoreLastPage(options) {
      var status = options.status;
      var numPages = options.numPages;
      var documentKey = options.documentKey;
      var storageKey = options.storageKey;
      var jumpToPage = options.jumpToPage;
      var restoredRef = React.useRef('');

      React.useEffect(function () {
        if (status !== 'ready') return undefined;
        if (restoredRef.current === documentKey) return undefined;
        restoredRef.current = documentKey;
        var saved = readStoredPage(storageKey);
        if (saved < 2 || saved > numPages) return undefined;
        var timer = window.setTimeout(function () { jumpToPage(saved); }, 350);
        return function () { window.clearTimeout(timer); };
      }, [status, numPages, documentKey, storageKey, jumpToPage]);
    }

    /**
     * Anchor the panel beside the document and push the scrollport aside.
     *
     * The host detaches the frame and the scrollport while a document loads, so
     * the effect re-resolves both on structural changes, restores the margin it
     * wrote on the previous node, and cancels the push when the panel closes.
     *
     * @param options.open - whether the panel is open.
     * @param options.buttonRef - the toggle button, used to find host nodes.
     * @param options.setAnchor - stores the measured frame rect.
     * @param options.setOpen - opens or closes the panel (Escape closes it).
     */
    function usePanelAnchor(options) {
      var open = options.open;
      var buttonRef = options.buttonRef;
      var setAnchor = options.setAnchor;
      var setOpen = options.setOpen;

      React.useEffect(function () {
        if (open !== true) return undefined;
        var frame = null;
        var frameObserver = null;
        var port = null;
        var portMargin = null;
        var timer = 0;

        // Re-resolve the anchor and the pushed scrollport together: the host
        // detaches both while a document loads, so either node may be replaced
        // without the panel state changing.
        var sync = function () {
          timer = 0;
          var button = buttonRef.current;
          if (button === null) return;
          var nextFrame = findFrame(button);
          if (nextFrame !== frame) {
            if (frameObserver !== null) frameObserver.disconnect();
            frameObserver = null;
            frame = nextFrame;
            if (frame !== null && typeof ResizeObserver === 'function') {
              frameObserver = new ResizeObserver(schedule);
              frameObserver.observe(frame);
            }
          }
          var width = 0;
          if (frame !== null) {
            var rect = frame.getBoundingClientRect();
            if (rect.height >= 80) {
              width = computePanelWidth(rect.width);
              setAnchor(function (previous) {
                var next = {
                  left: Math.round(rect.left),
                  top: Math.round(rect.top),
                  width: width,
                  height: Math.round(rect.height),
                };
                if (previous !== null && previous.left === next.left && previous.top === next.top && previous.width === next.width && previous.height === next.height) return previous;
                return next;
              });
            }
          }
          var nextPort = findScrollport(button);
          if (nextPort !== port) {
            if (port !== null && portMargin !== null && port.isConnected === true) port.style.marginLeft = portMargin;
            port = nextPort;
            portMargin = port === null ? null : port.style.marginLeft;
          }
          if (port !== null) port.style.marginLeft = width > 0 ? String(width) + 'px' : '';
        };

        var schedule = function () {
          if (timer !== 0) return;
          timer = window.setTimeout(sync, 80);
        };

        var structureObserver = typeof MutationObserver === 'function' ? new MutationObserver(schedule) : null;
        if (structureObserver !== null) structureObserver.observe(document.documentElement, { childList: true, subtree: true });
        window.addEventListener('resize', schedule);
        var onKeyDown = function (event) { if (event.key === 'Escape') setOpen(false); };
        document.addEventListener('keydown', onKeyDown, true);
        sync();
        return function () {
          if (timer !== 0) window.clearTimeout(timer);
          if (structureObserver !== null) structureObserver.disconnect();
          if (frameObserver !== null) frameObserver.disconnect();
          window.removeEventListener('resize', schedule);
          document.removeEventListener('keydown', onKeyDown, true);
          if (port !== null && portMargin !== null && port.isConnected === true) port.style.marginLeft = portMargin;
        };
      }, [open, buttonRef, setAnchor, setOpen]);
    }

    function NavAction(props) {
      var source = props.source;
      var contentId = source.storageKey;
      var documentKey = source.documentKey;

      var openState = React.useState(false);
      var open = openState[0];
      var setOpen = openState[1];
      var tabState = React.useState('outline');
      var tab = tabState[0];
      var setTab = tabState[1];
      var anchorState = React.useState(null);
      var anchor = anchorState[0];
      var setAnchor = anchorState[1];
      var expandedState = React.useState({});
      var expanded = expandedState[0];
      var setExpanded = expandedState[1];
      var queryState = React.useState('');
      var query = queryState[0];
      var setQuery = queryState[1];
      var searchState = React.useState({ status: 'idle', results: [], scanned: 0, total: 0 });
      var search = searchState[0];
      var setSearch = searchState[1];

      var buttonRef = React.useRef(null);
      var panelRef = React.useRef(null);
      var jumpCancelRef = React.useRef(null);
      var textCacheRef = React.useRef(new Map());
      var searchTokenRef = React.useRef(0);
      var uiRestoreRef = React.useRef({ id: '', skip: false });

      // A retired document takes its cached text, remembered page and search
      // results with it, so the load hook asks for that reset here.
      var docState = useDocumentLoad({
        source: source,
        documentKey: documentKey,
        open: open,
        onReset: function () {
          textCacheRef.current = new Map();
          setSearch({ status: 'idle', results: [], scanned: 0, total: 0 });
        },
      });
      var tracking = usePageTracking({
        status: docState.status,
        buttonRef: buttonRef,
        storageKey: contentId,
      });
      var currentPage = tracking.page;
      var setCurrentPage = tracking.setPage;

      React.useEffect(function () {
        var stored = contentId === '' ? undefined : readRecord(STORE_UI, contentId);
        uiRestoreRef.current = { id: contentId, skip: true };
        if (stored === null || typeof stored !== 'object') return;
        setOpen(stored.open === true);
        if (stored.tab === 'outline' || stored.tab === 'thumbs' || stored.tab === 'search') setTab(stored.tab);
      }, [contentId]);

      React.useEffect(function () {
        if (contentId === '') return;
        if (uiRestoreRef.current.skip === true && uiRestoreRef.current.id === contentId) {
          uiRestoreRef.current.skip = false;
          return;
        }
        writeRecord(STORE_UI, contentId, { open: open === true, tab: tab });
      }, [open, tab, contentId]);

      var jumpToPage = React.useCallback(function (page) {
        var port = findScrollport(buttonRef.current);
        if (port === null) return;
        var target = findPageElement(port, page);
        if (target === null) return;
        var delta = target.getBoundingClientRect().top - port.getBoundingClientRect().top - PAGE_TOP_GAP;
        setCurrentPage(page);
        if (jumpCancelRef.current !== null) jumpCancelRef.current();
        if (chooseScrollBehavior(delta, port.clientHeight) === 'smooth') {
          port.scrollTo({ top: port.scrollTop + delta, behavior: 'smooth' });
          jumpCancelRef.current = alignPageToTop(port, target, 1600);
          return;
        }
        port.scrollTop += delta;
        jumpCancelRef.current = alignPageToTop(port, target, 1200);
      }, []);

      React.useEffect(function () {
        return function () {
          if (jumpCancelRef.current !== null) jumpCancelRef.current();
        };
      }, []);

      useRestoreLastPage({
        status: docState.status,
        numPages: docState.status === 'ready' ? docState.numPages : 0,
        documentKey: documentKey,
        storageKey: contentId,
        jumpToPage: jumpToPage,
      });

      var storeOutline = React.useCallback(function (map) {
        if (contentId === '') return;
        writeRecord(STORE_OUTLINE, contentId, { nodes: map });
      }, [contentId]);

      React.useEffect(function () {
        if (docState.status !== 'ready' || contentId === '') return;
        var stored = readRecord(STORE_OUTLINE, contentId);
        if (stored !== null && typeof stored === 'object' && stored.nodes !== null && typeof stored.nodes === 'object') {
          setExpanded(stored.nodes);
          return;
        }
        var preset = buildDefaultExpansion(docState.outline.flat, DEFAULT_EXPAND_DEPTH);
        setExpanded(preset);
        storeOutline(preset);
      }, [docState.status, contentId, storeOutline]);

      usePanelAnchor({
        open: open,
        buttonRef: buttonRef,
        setAnchor: setAnchor,
        setOpen: setOpen,
      });

      var runSearch = React.useCallback(function () {
        var doc = docState.doc;
        if (doc === undefined) return;
        var needle = query.trim().toLowerCase();
        if (needle === '') {
          setSearch({ status: 'idle', results: [], scanned: 0, total: 0 });
          return;
        }
        searchTokenRef.current += 1;
        var token = searchTokenRef.current;
        var found = [];
        setSearch({ status: 'running', results: [], scanned: 0, total: doc.numPages });
        var step = function (pageNumber) {
          if (token !== searchTokenRef.current) return;
          if (pageNumber > doc.numPages) {
            setSearch({ status: 'done', results: found.slice(0, 200), scanned: doc.numPages, total: doc.numPages });
            return;
          }
          getPageText(doc, pageNumber, textCacheRef.current).then(function (text) {
            if (token !== searchTokenRef.current) return;
            var lower = text.toLowerCase();
            var index = lower.indexOf(needle);
            while (index !== -1 && found.length < 200) {
              found.push({ page: pageNumber, key: String(pageNumber) + ':' + String(index), head: '', mark: '', tail: '' });
              var snippet = buildSnippet(text, index, needle.length);
              found[found.length - 1].head = snippet.head;
              found[found.length - 1].mark = snippet.mark;
              found[found.length - 1].tail = snippet.tail;
              index = lower.indexOf(needle, index + needle.length);
            }
            if (pageNumber % 5 === 0) {
              setSearch({ status: 'running', results: found.slice(0, 200), scanned: pageNumber, total: doc.numPages });
            }
            step(pageNumber + 1);
          }, function () {
            if (token !== searchTokenRef.current) return;
            step(pageNumber + 1);
          });
        };
        step(1);
      }, [docState.doc, query]);

      var labelOf = function (pageNumber) {
        var labels = docState.labels;
        if (Array.isArray(labels) && typeof labels[pageNumber - 1] === 'string') return labels[pageNumber - 1];
        return String(pageNumber);
      };

      var commitExpansion = function (next) {
        setExpanded(next);
        storeOutline(next);
      };

      var toggleNode = function (id) {
        var next = Object.assign({}, expanded);
        next[id] = expanded[id] !== true;
        commitExpansion(next);
      };

      var expandAll = function () {
        if (docState.status !== 'ready') return;
        var flat = docState.outline.flat;
        var next = {};
        for (var index = 0; index < flat.length; index += 1) {
          if (flat[index].children.length > 0) next[flat[index].id] = true;
        }
        commitExpansion(next);
      };

      var collapseAll = function () {
        commitExpansion({});
      };

      var icon = h('svg', { viewBox: '0 0 16 16', 'aria-hidden': 'true', focusable: 'false' },
        h('path', { d: 'M3 4h10M3 8h10M3 12h6', stroke: 'currentColor', strokeWidth: '1.5', strokeLinecap: 'round' }));

      var button = h('button', {
        ref: buttonRef,
        type: 'button',
        className: 'dpr-btn',
        title: source.buttonTitle,
        'aria-label': source.buttonLabel,
        'aria-expanded': open,
        'data-dsh-doc-nav-toggle': true,
        onClick: function () { setOpen(function (value) { return value !== true; }); },
      }, icon);

      if (open !== true || anchor === null) return button;

      var ready = docState.status === 'ready' ? docState : { status: docState.status, doc: undefined, outline: { tree: [], flat: [], total: 0 }, labels: null, numPages: 0, error: docState.error };
      var panel = h(TocPanel, {
        anchor: anchor,
        panelLabel: source.panelLabel,
        loadingLabel: source.loadingLabel,
        idleLabel: source.idleLabel,
        tab: tab,
        onTab: setTab,
        onClose: function () { setOpen(false); },
        onJump: jumpToPage,
        currentPage: currentPage,
        numPages: ready.numPages,
        docState: ready,
        expanded: expanded,
        onToggle: toggleNode,
        onExpandAll: expandAll,
        onCollapseAll: collapseAll,
        query: query,
        onQuery: setQuery,
        onSearch: runSearch,
        search: search,
        labelOf: labelOf,
      });
      var portal = typeof createPortal === 'function' && typeof document !== 'undefined' ? createPortal(panel, document.body) : panel;
      return h(React.Fragment, null, button, portal);
    }

    /**
     * Build the navigation source for a PDF body the host already parsed.
     *
     * @param props - keyed document-action props carrying the tab and its bytes.
     * @returns the navigation action for that PDF.
     */
    function PdfNavAction(props) {
      var info = typeof props.useTabInfo === 'function' ? props.useTabInfo() : undefined;
      var contentId = info !== undefined && info !== null && info.tab !== undefined ? String(info.tab.contentId === undefined ? '' : info.tab.contentId) : '';
      var bytes = props.content !== undefined && props.content !== null && props.content.kind === 'bytes' ? props.content.data : undefined;
      var loaded = bytes !== undefined && contentId !== '';
      var source = {
        storageKey: contentId,
        // Reading the same file again hands down a new array, which must reparse.
        documentKey: loaded ? contentId + '#' + String(payloadIdOf(bytes)) : '',
        eager: true,
        buttonTitle: '目录 / 缩略图 / 搜索',
        buttonLabel: 'PDF 目录',
        panelLabel: 'PDF 目录与导航',
        loadingLabel: '正在解析 PDF…',
        idleLabel: '正在等待 PDF 内容…',
        read: function () { return Promise.resolve(bytes); },
      };
      return h(NavAction, { source: source });
    }

    /**
     * Unwrap the PDF bytes the host rendered for an Office document.
     *
     * @param result - the renderer Remote reply.
     * @returns the converted PDF bytes.
     * @throws Error naming the host error code when the conversion failed.
     */
    function readOfficePdfPayload(result) {
      if (result === undefined || result === null || result.ok !== true) {
        var error = result !== undefined && result !== null && result.error !== undefined && result.error !== null ? result.error : {};
        throw new Error('Office 文档转换失败（' + String(error.code === undefined ? 'unknown' : error.code) + '）');
      }
      return result.value.data;
    }

    /**
     * Build the navigation source for an Office document through the host renderer.
     *
     * The host converts doc, docx, ppt and pptx to PDF, so the panel parses that
     * conversion and its page numbers match the preview exactly.
     *
     * @param props - list-slot props carrying the file path, session and renderer.
     * @returns the navigation action, or null for other file types.
     */
    function OfficeNavAction(props) {
      var path = typeof props.absolutePath === 'string' ? props.absolutePath : '';
      if (!isOfficeDocumentPath(path)) return null;
      var sessionId = props.sessionId;
      var renderOfficePdf = props.renderOfficePdf;
      var source = {
        storageKey: 'office:' + path,
        documentKey: 'office:' + path,
        eager: false,
        buttonTitle: '幻灯片导航（目录 / 缩略图 / 搜索）',
        buttonLabel: '幻灯片导航',
        panelLabel: '幻灯片目录与导航',
        loadingLabel: '正在转换幻灯片…',
        idleLabel: '正在等待文档内容…',
        read: function () {
          return Promise.resolve(renderOfficePdf(sessionId, path)).then(readOfficePdfPayload);
        },
      };
      return h(NavAction, { source: source });
    }

    function apply(ctx) {
      ctx.effect(installStyles, PACKAGE_ID + ': styles');
      ctx.slots.inject('sidebar.right.tab.document.action', function () {
        return ctx.slots.register({
          name: 'sidebar.right.tab.document.action',
          key: PDF_BODY_ID,
        }, PdfNavAction);
      });
      // The list slot also hosts Office tabs, whose bytes only exist after the
      // host converts them; the renderer Remote is what we ask for that.
      ctx.inject(['remote', 'remote.officeKit'], function (scope) {
        ctx.slots.inject('sidebar.right.tab.document.actions', function () {
          return ctx.slots.register({
            name: 'sidebar.right.tab.document.actions',
            id: 'dsh-sidebar-doc-nav-office',
            order: 10,
            inject: function () {
              return {
                renderOfficePdf: function (sessionId, path, signal) {
                  return scope.remote.officeKit.render(sessionId, path, 'foreground', signal);
                },
              };
            },
          }, OfficeNavAction);
        });
      });
    }

    exports.name = PACKAGE_ID;
    exports.inject = ['slots'];
    exports.apply = apply;
    exports.buildDefaultExpansion = buildDefaultExpansion;
    exports.OutlineRows = OutlineRows;
    exports.chooseScrollBehavior = chooseScrollBehavior;
    exports.computePanelWidth = computePanelWidth;
    exports.isOfficeDocumentPath = isOfficeDocumentPath;
    exports.payloadIdOf = payloadIdOf;
    exports.getPageRatio = getPageRatio;
    exports.readStoredPage = readStoredPage;
    exports.writeStoredPage = writeStoredPage;
    exports.readOfficePdfPayload = readOfficePdfPayload;
    exports.renderThumbsTab = renderThumbsTab;
    exports.renderSearchTab = renderSearchTab;

    return module.exports;
  },
});
