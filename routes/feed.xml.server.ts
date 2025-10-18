import { atomResponse } from "@mastrojs/feed";

const baseUrl = "https://mastrojs.github.io/";
const updated = new Date("2025-09-10");

export const GET = () =>
  atomResponse({
    title: "Mastro",
    subtitle: "Updates about the web framework and static site generator, as well as the Mastro Guide.",
    id: new URL(baseUrl),
    linkSelf: new URL("feed.xml", baseUrl),
    updated,
    author: {
      name: "Mauro Bieg"
    },
    entries: [],
  });
