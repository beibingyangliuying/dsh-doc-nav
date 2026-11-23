# 随包内置的 PDF.js

这里的文件是浏览器里真正解析 PDF 的引擎本体。它不是 `pnpm install` 拉下来的依赖，
而是随包分发的预构建产物——因此安装时不需要任何构建步骤。

## 来源

- 上游引擎：`pdfjs-dist@6.5.438`（Apache-2.0，许可证见 `PDFJS-LICENSE.txt`）。
- 这三个文件逐字节来自 `dsh-reader`（<https://github.com/Popipot/DSH-Reading-Plugin>）的
  `dist/reader-assets/pdfjs/`，由它自带的 `scripts/build-pdf.mjs`（esbuild）产出；本项目直接整份
  复制，没有再做修改。

| 文件 | 大小 | sha256 | 与上游的关系 |
| --- | --- | --- | --- |
| `pdf.renderer.mjs` | 245736 B | `e16505dc…d1d17c` | 与 `pdfjs-dist@6.5.438/build/pdf.renderer.mjs` 逐字节相同 |
| `pdf.worker.mjs` | 2248941 B | `232d33bc…68dbb95` | 比上游（2248830 B）多 111 B，49 字节不同 |
| `pdf.bundle.js` | 446919 B | `431fc357…3212d6e` | 上游没有对应文件，是 esbuild 把 `web/src/pdf/pdf-entry.js` 打成的单文件 |

`pdf.worker.mjs` 的那处差异在 `adjustType1ToUnicode`：上游是两条独立的
`if (properties.isInternalFont) return;` 与 `if (properties.hasIncludedToUnicodeMap) return;`，
这里合成 `if (properties.isInternalFont || (properties.composite && properties.hasIncludedToUnicodeMap)) return;`。
丢掉这个补丁，部分 Type1 复合字体的文字层会取不到。

## 其余目录

`cmaps/`（169 个 CMap）、`standard_fonts/`（16 个标准字体）、`wasm/`（15 个 wasm 及其 JS 兜底）、
`iccs/`（2 个 ICC 配置）同样来自上述构建产物。

## 重建

重建需要 `dsh-reader` 仓库的 `scripts/build-pdf.mjs` 及其 esbuild 入口：先对上游 `pdfjs-dist@6.5.438`
的 worker 打上 `adjustType1ToUnicode` 补丁，再用该入口打包。重建后除上表三个文件外，其余目录内容应保持不变。
