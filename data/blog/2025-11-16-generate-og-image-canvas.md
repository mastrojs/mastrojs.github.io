---
title: "How to generate og:images from text with Canvas"
description: "Use the web-standard Canvas API to render text to PNG – without spinning up a whole web browser."
date: 2025-11-16
author: Mauro Bieg
---

**Use the web-standard Canvas API to render text to PNG – without spinning up a whole web browser. Here's how we implemented this approach in [`@mastrojs/og-image`](https://jsr.io/@mastrojs/og-image).**

A few weeks ago, Scott Jehl posted about the [pain of generating Open Graph images](https://scottjehl.com/posts/open-graph/): those images you link to with an `og:image` meta tag from your HTML, which are then displayed on social media or messenger apps when somebody shares a link to that page. (Side-note: a single `<meta property="og:image"` tag, together with the standard `<title>` and `<meta name="description"`, is kind of [enough](https://getoutofmyhead.dev/link-preview-meta-tags/).)

Most tools that generate those preview PNGs download and launch a full-blown web browser to take a screenshot of some HTML and CSS that you wrote. While that works, I've had something lighter in mind. All I wanted, was to render the title of the page on a nice-looking background. That sounded doable with the [standard Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/). Since we don't actually have a browser running when we statically generte our website (d'uh), I used [canvaskit-wasm](https://www.npmjs.com/package/canvaskit-wasm), which emulates a `<canvas>` in Node.js or Deno.

Now we just have to call [fillText(text, x, y)](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/fillText) and we're done, right? Not quite. `fillText` only ever prints a single line of text. What we want is to start a new line when there's no more horizontal space. We need to call `fillText` again with as much of the remaining text as fits on the next line (and with a y-coordinate of one line-height more than before). And then we continue doing that until we have no more text. If that sounds suspiciously like a layout algorithm to you, you would be right. We even added support for [soft hyphens](https://en.wikipedia.org/wiki/Soft_hyphen): if the word doesn't fit, but contains at least one soft hyphen, we will hyphenate at the right place. But since we didn't feel like shipping hyphenation dictionaries, you'll need to supply your own soft hyphens to the input.

Feel free to look at the [source code](https://github.com/mastrojs/og-image/). That whole text layouting part is in the `util.ts` file.

Next up was publishing it as the [@mastrojs/og-image package](https://jsr.io/@mastrojs/og-image). There you can also see usage examples. The single exported function takes a bunch of options like font, color and padding, to get you started. But in typical Mastro fashion, the API is more powerful than it seems at first glance: using `background`, you can supply your own function to draw the background image using the standard Canvas API. If you come up with a nice background generating function, please share it on [GitHub Discussions](https://github.com/mastrojs/mastro/discussions/categories/show-and-tell). That would be almost like a theme gallery!

Last step for me was to use the package for this very website: for this blog, Mastro docs, and the guide. Running `deno task generate` to generate the whole static site, including rasterizing and writing to disk the 42 `og.png` files, takes 2.6 seconds on my MacBook Air M2. Without the image generation, it was 0.6 seconds. I'm not sure how long it takes to spin up a browser and take screenshots, but pretty sure it's longer.

Don't forget to share this post on social media to actually see our glorious, generated image 🤓 If on Bluesky, please mention us with [@mastrojs.bsky.social](https://bsky.app/profile/mastrojs.bsky.social)!
