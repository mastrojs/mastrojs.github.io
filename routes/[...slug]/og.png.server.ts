import { serveMarkdownFolder } from "@mastrojs/markdown";
import { readFile } from "@mastrojs/mastro";
import { renderImage } from "@mastrojs/og-image";
import { pageTitle } from "../[...slug].server.ts";
import { schema } from "../../helpers/markdown.ts";

const fontFile = await readFile("./helpers/Roboto-Bold.ttf");
const chefIcon = await readFile("./helpers/ogChef.png");

export const GET = (req: Request) => {
  const url = new URL(req.url);
  url.pathname = url.pathname.slice(0, -6); // slice off "og.png"
  if (url.pathname === "/blog/") {
    return ogImage(
      "Blog",
      "About the web and the simplest web framework and site generator yet.",
    );
  }
  return mdFolder.GET(new Request(url));
};

export const getStaticPaths = async () => {
  const paths = await mdFolder.getStaticPaths();
  paths.push("/blog/");
  return paths.map((path) => path + "og.png");
};

const mdFolder = serveMarkdownFolder({ folder: "data", schema }, ({ meta }, req) => {
  const { pathname } = new URL(req.url);
  const text = pathname === "/" ? meta.title : (meta.metaTitle || meta.title);
  return ogImage(pageTitle(pathname), text);
});

const ogImage = (titleSuffix: string, text: string) =>
  renderImage(text, {
    fontFile,
    fontSize: 50,
    paddingTop: 300,
    background: (ctx, canvas) => {
      ctx.fillStyle = "white";
      ctx.fillRect(0, 0, 1200, 630);
      ctx.fillStyle = "black";
      ctx.font = "100px DefaultFont";
      ctx.fillText("Mastro" + (titleSuffix ? ` ${titleSuffix}` : ""), 100, 200);
      // deno-lint-ignore no-explicit-any
      ctx.drawImage(canvas.decodeImage(chefIcon) as any, 60 * titleSuffix?.length + 450, 92);
    },
  })
