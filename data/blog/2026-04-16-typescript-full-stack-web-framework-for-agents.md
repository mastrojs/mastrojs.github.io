---
title: TypeScript full-stack web framework for agents and humans
date: 2026-04-16
author: Mauro Bieg
---

I would be lying if I said the [Mastro web framework](/) was designed from the ground up for AI agents. It was designed for humans, and to be as simple and minimal as possible, while still offering a great DX (developer experience). But it turns out, these properties make it exceptionally well-suited for AI agents as well.

The whole [source code of Mastro](https://github.com/mastrojs/mastro/tree/main/src) is just ~800 lines of TypeScript, which easily fits into an LLM’s context (or a human’s). And just like types prevent humans from making stupid mistakes, they do the same for LLMs.

To say that AI in general, and agentic coding in particular, are controversial topics may be an understatement. I’m not here to tell you what to think about AI. Personally, I see a number of downsides, but also some potential. LLMs can produce a lot of slop and terrible code. But when used properly, they can also be a big help, especially [when learning](https://htmx.org/essays/yes-and/). I have hopes for local models, but as of today, they’re not quite where Claude Code and Codex seem to be.


## Agentic coding a website

The best way to get to know something new is usually to just try it out. Always wanted to create or overhaul your personal website or blog? Now is the time! Or just create a silly dummy website!

Create a [new Mastro project](/docs/getting-started/) with:

```sh
pnpm create @mastrojs/mastro
```

The following `AGENTS.md` file worked quite well for me:

```md title=AGENTS.md
We're using the Mastro web framework to build a statically generated site.

- Use web search with `site:mastrojs.github.io` to look up Mastro docs.
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
    in [components](components/) and if so
    [which approach they prefer](https://mastrojs.github.io/blog/2026-05-26-component-scoped-css-without-build-step/)
- Only use [client-side JavaScript](https://mastrojs.github.io/guide/interactivity-with-javascript-in-the-browser/)
  if absolutely necessary. If so, use `<script type="module">`.
```

Note: if you’re using Claude, make sure you also have a file:

```md title=CLAUDE.md
@AGENTS.md
```

And if you're not using Chrome for anything important (that you wouldn't be comfortable sharing with Anthropic), you can install the [Claude Chrome extension](https://claude.com/claude-for-chrome). Then you can tell it for example:

```sh
@browser go to localhost:8000 and check for discrepancies
```


## How did it go?

Does that setup work for you? What did you change in your `AGENTS.md` file? Let us know [on Bluesky](https://bsky.app/profile/mastrojs.bsky.social) or [GitHub](https://github.com/mastrojs/mastro/discussions/categories/general)!
