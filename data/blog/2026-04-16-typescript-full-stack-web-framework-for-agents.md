---
title: TypeScript full-stack web framework for agents and humans
date: 2026-04-16
---

I would be lying if I said the [Mastro web framework](/) was designed from the ground up for AI agents. It was designed for humans, and to be as simple and minimal as possible, while still offering a great DX (developer experience). But it turns out, these properties make it exceptionally well-suited for AI agents as well.

The whole [source code of Mastro](https://github.com/mastrojs/mastro/tree/main/src) is just ~700 lines of TypeScript, which easily fits into an LLM’s context (or a human’s). And just like types prevent humans from making stupid mistakes, they do the same for LLMs.

To say that AI is a controversial topic may be an understatement. I’m not here to tell you what to think about AI. Personally, I see a number of downsides, but also some potential. LLMs can produce a lot of slop and terrible code. But when used properly, they can also be a big help, especially [when learning](https://htmx.org/essays/yes-and/). I have hopes for local models, but as of today, they’re not quite where Claude Code, Cursor and GitHub Copilot seem to be.


## Let's try it

The best way to get to know something new is usually to just try it out. Always wanted to create or overhaul your personal website or blog? Or just do a silly dummy project!

Create a [new Mastro project](/#powerful-for-experienced-developers) with:

```sh
pnpm create @mastrojs/mastro
```

And add the following `AGENTS.md` file:

```md title=AGENTS.md
We're using the Mastro web framework to build a statically generated site.

- To look up Mastro docs, use web search on
  `https://api.github.com/repos/mastrojs/mastrojs.github.io/contents/data/docs`
- Use web search with `site:developer.mozilla.org` to look up web platform
  features. Use the APIs if they're "Baseline Widely available".
- Write semantic HTML.
- CSS
  - Never add inline CSS
  - Avoid adding classes if you can use HTML element selectors
  - Use a [two-layer approach](https://theadminbar.com/semantics-and-primitives-color-system/)
    for CSS variables (primitives like `--blue: #0000ff`,
    and semantics like `--link-color: var(--blue)`).
  - Ask the user whether they want to only have a single global
    [styles.css](routes/styles.css) file (good for smaller projects),
    or whether they want to colocate CSS files with their HTML
    in [components](components/) and [bundle the CSS](https://mastrojs.github.io/guide/bundling-assets/#bundling-css).
- Only use [client-side JavaScript](https://mastrojs.github.io/guide/interactivity-with-javascript-in-the-browser/)
  if absolutely necessary. If so, use `<script type="module">`.
```

Note: if you’re using Claude, make sure you also have a file:

```md title=CLAUDE.md
@AGENTS.md
```

And if you're not using Chrome for anything important (that you wouldn't be comfortable sharing with Anthropic), install the [Claude Chrome extension](https://claude.com/claude-for-chrome). Then you can tell it for example:

```sh
@browser go to localhost:8000 and check for discrepancies
```


## How did it go?

Does that setup work for you? What did you change in your `AGENTS.md` file? Let us know [on Bluesky](https://bsky.app/profile/mastrojs.bsky.social) or [GitHub](https://github.com/mastrojs/mastro/discussions/categories/general)!
