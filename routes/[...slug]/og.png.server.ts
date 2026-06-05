import { serveMarkdownFolder } from "@mastrojs/markdown";
import { readFile } from "@mastrojs/mastro";
import { renderImage } from "@mastrojs/og-image";
import { pageTitlePrefix } from "../[...slug].server.ts";

const fontFile = await readFile("./helpers/Roboto-Bold.ttf");
const chefIcon = await readFile("./helpers/ogChef.png");

export const GET = (req: Request) => {
  const url = new URL(req.url);
  url.pathname = url.pathname.slice(0, -6); // slice off "og.png"
  if (url.pathname === "/blog/") {
    return image(
      "Blog",
      "Posting about the web and the simplest web framework and site generator yet.",
    );
  } else {
    return mdFolder.GET(new Request(url));
  }
};

export const getStaticPaths = async () => {
  const paths = await mdFolder.getStaticPaths();
  paths.push("/blog/");
  return paths.map((path) => path + "og.png");
};

const mdFolder = serveMarkdownFolder({ folder: "data" }, ({ meta }, req) => {
  const { pathname } = new URL(req.url);
  const prefix = pageTitlePrefix(pathname);
  const text = meta.metaTitle || meta.title || "";
  return image(prefix, text);
});

const image = (prefix: string, text: string) =>
  renderImage(text, {
    fontFile,
    fontSize: 50,
    paddingTop: 300,
    background: (ctx, canvas) => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = "black";
      ctx.font = "100px DefaultFont";
      ctx.fillText("Mastro" + (prefix ? ` ${prefix}` : ""), 100, 200);
      // deno-lint-ignore no-explicit-any
      ctx.drawImage(canvas.decodeImage(chefIcon) as any, 60 * prefix?.length + 450, 92);
    },
  })
