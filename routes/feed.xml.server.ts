import { html, htmlToResponse } from "mastro";

const baseUrl = "https://mastrojs.github.io/";

export const GET = async () => {
  const feed = html`<?xml version="1.0" encoding="utf-8"?>
    <feed xmlns="http://www.w3.org/2005/Atom">
      <title>Mastro</title>
      <subtitle>
        Updates about the web framework and static site generator, as well as the Mastro Guide.
      </subtitle>
      <link rel="self" href="${baseUrl}feed.xml" />
      <updated>2025-09-10T18:00:00Z</updated>
      <author>
        <name>Mauro Bieg</name>
      </author>
      <id>${baseUrl}</id>
    </feed>
  `;

  const res = await htmlToResponse(feed);
  res.headers.set("Content-Type", "application/atom+xml");
  return res;
};
