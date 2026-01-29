import { serveMarkdownFolder } from "@mastrojs/markdown";
import { readFile } from "@mastrojs/mastro";
import { renderImage } from "@mastrojs/og-image";
import { pageTitlePrefix } from "../[...slug].server.ts";

const fontFile = await readFile("./helpers/Roboto-Bold.ttf");
const chefIcon = await readFile("./helpers/ogChef.png");

export const GET = (req: Request) => {
  const url = new URL(req.url);
  url.pathname = url.pathname.slice(0, -6); // slice off "og.png"
  return mdFolder.GET(new Request(url));
};

export const getStaticPaths = async () => {
  const paths = await mdFolder.getStaticPaths();
  return paths.map((path) => path + "og.png");
};

const mdFolder = serveMarkdownFolder({ folder: "data" }, ({ meta }, req) => {
  const { pathname } = new URL(req.url);
  const prefix = pageTitlePrefix(pathname);
  const text = "Mastro\n\n" + (prefix ? `${prefix}: ` : "") + (meta.metaTitle || meta.title);
  return renderImage(text, {
    fontFile,
    background: (ctx, canvas) => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1200, 630);
      // deno-lint-ignore no-explicit-any
      ctx.drawImage(canvas.decodeImage(chefIcon) as any, 335, 100);
    },
  });
});
