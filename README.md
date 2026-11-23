# @beibingyangliuying/dsh-sidebar-pdf-nav

给 DSH 侧边栏自带 PDF 阅读器补上**目录（书签）导航**、**缩略图**、**全文搜索**和**阅读状态记忆**。

宿主内置的 PDF 预览（`@deepseek-ai/dsh-client-ui-sidebar-documentpreview`）只负责渲染页面，
没有解析 PDF 的 `/Outlines` 书签树，所以长文档只能一页页往下滚。本插件以
`sidebar.right.tab.document.action` 槽位的 occupant 身份注册到 **PDF 渲染器 id** 上，
因此只在 PDF 标签的工具栏里出现一个按钮，不影响其它文件类型。

## 功能

- **目录**：解析 PDF 内嵌书签树，保留层级；默认展开前两级。点击行只跳到该条目所在页，展开/折叠只由行首三角负责（键盘上 `←`/`→` 同样只开合，`Enter`/空格只跳转）；当前阅读位置所在的条目自动高亮并滚入视野；面板顶部提供「展开全部 / 折叠全部」。
- **缩略图**：双列页面缩略图，`IntersectionObserver` 惰性渲染，只画可视区域附近的页。
- **搜索**：按页串行抽取文本（`getTextContent`），结果带上下文片段与页码，点击跳页。
- **跳页**：目录、缩略图、搜索结果与页码输入共用同一跳页逻辑——目标在一屏内就平滑滚过去，超出一屏则瞬时定位，避免长距离动画从中间页一路扫过；落位后等页面渲染稳定再校正一次，期间手动滚动会立即取消校正。
- **推挤式侧栏**：面板贴住文档区左缘、占满整个高度，正文被推窄并让宿主按新的可用宽度重新适配（`fit-width`）；关闭时正文恢复。
- **状态记忆**：以标签的 `contentId`（文件路径）为键写入 `localStorage`——当前页、目录展开集合、面板开合与当前标签页，重开同一 PDF 时一并恢复。

存储键（改动前的老版本会把 `pages` 自动迁移过来）：

| 键 | 内容 |
| --- | --- |
| `dsh-sidebar-pdf-nav/v1/pages` | `{ [contentId]: 页码 }` |
| `dsh-sidebar-pdf-nav/v1/outline` | `{ [contentId]: { nodes: { [nodeId]: boolean } } }` |
| `dsh-sidebar-pdf-nav/v1/ui` | `{ [contentId]: { open, tab } }` |

## 结构

| 路径 | 作用 |
| --- | --- |
| `lib/index.js` | 插件服务端入口：声明插件名，挂载资源路由 |
| `lib/assets.js` | 以 `/dsh-sidebar-pdf-nav-assets` 前缀托管 `assets/`，含路径穿越校验与长缓存头 |
| `client/client.js` | 浏览器半边（经典脚本 + `window.__ModuleLoader__`，无需构建）：注册槽位、渲染面板、驱动 PDF.js |
| `assets/pdfjs/` | 随包内置的 PDF.js 6.5.438 引擎、worker、cmaps、标准字体、wasm、icc |
| `cordis.patch.yml` | bundle patch：向 profile 插入一行插件行（行名即包名） |
| `tests/` | `node --test`：资源路由契约、插件装配契约、浏览器半边注册契约 |

浏览器半边直接 `import('/dsh-sidebar-pdf-nav-assets/pdfjs/pdf.bundle.js?v=…')`，
再设置 `GlobalWorkerOptions.workerSrc` / `rendererSrc`，因此不需要打包器，
也不需要依赖别的插件提供 pdf.js。

## 安装

需要 DSH `>=0.2.2-rc.0 <0.3.0`（Web GUI）和 `pnpm`——`dsh plugin` 只是把参数转发给 profile 目录里的 pnpm。
四种来源任选其一，装完重启 `dsh` 进程：

```bash
# 从 npm（可升级）
dsh plugin --profile web add @beibingyangliuying/dsh-sidebar-pdf-nav

# 从 GitHub（拉源码；本包没有编译步骤）
dsh plugin --profile web add github:beibingyangliuying/dsh-pdf-reader

# 从本地 tarball（离线分发）
npm pack
dsh plugin --profile web add ./beibingyangliuying-dsh-sidebar-pdf-nav-0.1.0.tgz

# 从本地 checkout（开发；link 安装，改完刷新页面即生效）
dsh plugin --profile web add D:/OneDrive/Desktop/dsh-pdf-reader
```

`add` 会把包记进 profile 的 `dependencies` 与 `dsh.profile.bundles`，层由包内的 `cordis.patch.yml` 提供；
`dsh --profile web --dump-config | grep dsh-sidebar-pdf-nav` 可确认那一层已经出现。
卸载用 `dsh plugin --profile web remove @beibingyangliuying/dsh-sidebar-pdf-nav`。

不需要构建：客户端半边是原生 JS，由宿主按 `/plugins/<包名>/client.js` 直接供给；`assets/pdfjs/` 是预构建引擎
（来源与重建方式见 [`assets/pdfjs/README.md`](assets/pdfjs/README.md)）。`dsh.client.platform` 为 `web`，
所以按钮只出现在 Web GUI，桌面版不会加载客户端半边。

## 测试

```bash
node --test "tests/**/*.test.mjs"
node --check client/client.js
```

## 发布

npm 包内容由 `files` 决定（212 个文件，gzip 后约 2.5 MB，不含 `tests/`）。构建产物本来就在仓库里，
发布前不需要 `build`：

```bash
npm login          # 首次
npm publish        # 作用域包按 publishConfig 以 public 发布
```

GitHub 直接装也成立，前提是 `assets/pdfjs/` 已入库——`.gitattributes` 把它标成 vendored，
`.gitignore` 不排除它。

## 已知边界

- 依赖宿主 DOM 的两个属性：滚动容器 `[data-document-zoom-scrollport]`、页元素 `[data-pdf-page]`，
  以及预览框 `[data-document-preview]`（推挤布局用它定位并取宽度）。
  宿主升级若改名，跳页、当前页跟随与推挤宽度会失效（面板仍可打开）。
- 推挤靠给滚动容器加 `margin-left`，让宿主 `ResizeObserver` 观察到 `clientWidth` 变化后重算 `fit-width`；
  因此开合面板时正文会有一次轻微的缩放跳动。
- 宿主换会话/换文档时会先卸载 `ZoomViewport`、解析完再挂新的滚动容器，所以面板打开期间会监听
  DOM 结构变化（80ms 合并）重新绑定 frame 与滚动容器，新节点自动接上推挤；旧节点的 `margin-left` 复原。
- 页码输入框提交后 `blur()`，避免宿主快捷键继续把按键当作阅读快捷键处理。
- 没有书签的 PDF 会在「目录」页给出提示，引导改用缩略图或搜索。
