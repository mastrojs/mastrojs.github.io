import { parseYamlFrontmatter, readMarkdownFileInFolder, readMarkdownFiles } from "@mastrojs/markdown";
import { unsafeInnerHtml } from "@mastrojs/mastro";
import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";
import markdownItHighlightJs from "markdown-it-highlightjs";

/**
 * Get all markdown files
 */
export const readMdFiles = async () => {
  const files = await readMarkdownFiles("data/blog/**.md");
  files.reverse();
  return files.map(md => ({...md, path: md.path.slice(5, -3) + "/"}));
}

/**
 * Read a markdown file from the data folder
 */
export const readMd = (path: string) =>
  readMarkdownFileInFolder("data", path, mdToHtml)

/**
 * Custom markdown renderer with:
 *
 * - anchor links for headings
 * - support for `:::tip` blocks
 * - syntax highlighting (even html inside tagged template literals)
 * - copy code to clipboard button
 * - support for ` ```css title=styles.css ins={6-7} del={4-5}` syntax
 */
const mdToHtml = (txt: string) => {
  const { body, meta } = parseYamlFrontmatter(txt);
  const content = unsafeInnerHtml(md.render(body));
  return { content, meta };
};

const md = markdownIt({ html: true, typographer: true })
  .use(markdownItAnchor, {
    permalink: markdownItAnchor.permalink.headerLink({ class: "anchor" }),
  })
  .use(markdownItContainer, "tip")
  .use(markdownItHighlightJs, { auto: false });
const defaultRender = md.renderer.rules.fence;

md.use((md: any) => {
  // see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md
  md.renderer.rules.fence = (
    tokens: Array<{info: string; content: string}>,
    idx: number,
    options: unknown,
    env: unknown,
    self: unknown,
) => {
    const { title, ranges } = parseInfo(tokens[idx].info);
    const pre = ranges
      ? `<pre>${ranges.map((range) =>
          `<span class="insOrDel -${range.insOrDel}" style="top: ${range.from - 0.5}lh; height: ${
            range.to - range.from + 1
          }lh;"></span>`).join("")
        }${renderCode(ranges, tokens, idx, options, env, self)}`
      : defaultRender(tokens, idx, options, env, self) + copyBtn();

    const figcaption = title ? `<figcaption>${title}</figcaption>` : "";
    return `<figure>${figcaption}${pre}</figure>`;
  };
});

const copyBtn = (text?: string) =>
  `<button title="Copy to clipboard"${
    text ? ` data-text="${escapeForAttribute(text)}"` : ""
    }>⧉</button><div class="copied">Copied!</div>`;
const titleRegex = /title=([^ ]+)/;
const insDelRegex = /(ins|del)={[^=]+}/g;

const parseInfo = (info: string) => {
  const title = info.match(titleRegex)?.[1];
  const ranges = info.match(insDelRegex)?.flatMap((match) => {
    const [insOrDel, ranges] = match.split("=");
    return ranges.slice(1, -1).split(",").flatMap((range) => {
      const [fromStr, toStr] = range.trim().split("-");
      const from = parseInt(fromStr, 10);
      const to = parseInt(toStr, 10);
      return isNaN(from) ? [] : { insOrDel, from, to: to || from };
    });
  });
  return { title, ranges };
};

/**
 * Render code block considering deletion markers
 */
const renderCode = (
  ranges: Array<{ insOrDel: string; from: number; to: number;}>,
  tokens:  Array<{content: string}>,
  idx: number,
  options: unknown,
  env: unknown,
  self: unknown,
) => {
  const lines = tokens[idx].content.split("\n");
  const copyLines = [...lines];
  const deletions = ranges.filter((range) => range.insOrDel === "del");
  const dels = deletions.flatMap((range) => {
    const arr = [];
    for (let i = range.from - 1; i < range.to; i++) {
      arr.push({ i, line: lines[i] });
      // erase line marked with del:
      lines[i] = "";
      copyLines.splice(i, 1);
    }
    return arr;
  });
  tokens[idx].content = lines.join("\n");

  // syntax highlight things
  const htmlStr = defaultRender(tokens, idx, options, env, self);

  const htmlLines = htmlStr.slice(5).split("\n");
  for (const del of dels) {
    const matches = htmlLines[del.i]?.match(/^<code[^>]*>/);
    const lostPrefix = matches?.[0] || "";
    // patch deleted line back in:
    htmlLines[del.i] = lostPrefix + escapeForHtml(del.line);
  }
  htmlLines.push(copyBtn(deletions.length > 0 ? copyLines.join("\n") : undefined));
  return htmlLines.join("\n");
}

const escapeForHtml = (st: string) =>
  st.replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");

const escapeForAttribute = (str: string) =>
  escapeForHtml(str)
    .replaceAll("'", "&#39;")
    .replaceAll('"', "&quot;");
