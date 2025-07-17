import markdownIt from "markdown-it";
import markdownItAnchor from "markdown-it-anchor";
import markdownItContainer from "markdown-it-container";
import markdownItHighlightJs from "markdown-it-highlightjs";
import { parseYamlFrontmatter, unsafeInnerHtml } from "mastro";

/**
 * Custom markdown renderer with:
 *
 * - anchor links for headings
 * - support for `:::tip` blocks
 * - syntax highlighting (even html inside tagged template literals)
 * - copy code to clipboard button
 * - support for ` ```css title=styles.css ins={6-7} del={4-5}` syntax
 */
export const mdToHtml = async (txt) => {
  const { body, meta } = await parseYamlFrontmatter(txt);
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

md.use((md) => {
  // see https://github.com/markdown-it/markdown-it/blob/master/docs/architecture.md
  md.renderer.rules.fence = (tokens, idx, options, env, self) => {
    const { info } = tokens[idx];
    const { title, ranges } = parseInfo(info);
    const htmlStr = defaultRender(tokens, idx, options, env, self);
    const figcaption = title ? `<figcaption>${title}</figcaption>` : "";
    const pre = ranges && htmlStr.startsWith("<pre>")
      ? `<pre>${ranges.map((range) =>
          `<span class="insOrDel -${range.insOrDel}" style="top: ${range.from - 0.5}lh; height: ${
            range.to - range.from + 1
          }lh;"></span>`
        ).join("")
        }${htmlStr.slice(5)}`
      : htmlStr;
    return `<figure>${figcaption}${pre}${copyBtn}</figure>`;
  };
});

const copyBtn = '<button title="Copy to clipboard">⧉' +
  '<span style="display:none">Copied!</span></button>';
const titleRegex = /title=([^ ]+)/;
const insDelRegex = /(ins|del)={[^=]+}/g;

const parseInfo = (info) => {
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
