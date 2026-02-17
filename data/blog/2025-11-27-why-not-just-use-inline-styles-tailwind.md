---
title: Why not just use <del>inline styles</del> Tailwind?
titleIsHtml: true
metaTitle: Why not just use Tailwind (or inline styles)?
date: 2025-11-27
author: Mauro Bieg
---

**Are WYSIWYG word processors, inline styles, and Tailwind conceptually the same? How to make the best use of modern CSS and HTML elements? And what do we actually gain by adding abstractions like style names and components, and what do we lose?**

There are many different ways to render text to pixels using a computer. Let’s go through some! We'll start with the lower level ones (closer to the hardware, or at least to the characters), and then subsequently add more and more abstractions, also known as adding _levels of indirection_.


## Direct control

If you’ve ever changed the font-size and font-family of individual words or paragraphs of text in a [WYSIWYG](https://en.wikipedia.org/wiki/WYSIWYG) word processor like Microsoft Word, you’re familiar with this approach to layouting.

In web development, we’ve also had several iterations of this same basic and direct interface:

- the deprecated [HTML font element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/font) `<font size="7">Hi</font>`
- CSS inline styles `<span style="font-size: 20px">Hi</span>`,
- Tailwind: `<span class="text-xl">Hi</span>`

The nice thing about it is that it gives you direct and immediate control over the text you’re looking at right now. The not so nice thing about it is that if you’re not careful, it  quickly leads to an inconsistent mess of different styles.


## Reusable styles

To solve these inconsistencies, we add our first abstraction; our first level on indirection: we give names to different styles that we then reuse in different places. This ensures all those places look the same. If we change the style, all places that use will automatically change.

In desktop publishing software like Adobe Indesign, you set up character- and paragraph-styles. In LaTeX you add a bunch of macros. For the web, CSS was invented as a solution for this very problem – to replace the `<font>` tag. In web development circles, this idea is known as the “separation of concerns” – where you separate between content (written in semantic HTML), and layout/styling (written in CSS).


## Reusable components

But people kept building ever more complicated websites, and chunks of HTML were repeated in various places, but slightly inconsistent. So we added another level of indirection: components (or in older templating systems called _includes_ or _partials_) – blocks of several HTML elements that you can reuse in multiple places. (Conceptually similar to a function that you can call in multiple places.)

It’s a powerful, and often very useful, abstraction. In fact, it’s so powerful that people started to use it everywhere for everything. And since everything was a component now, people wondered why they still needed the abstraction that was CSS. If the only place you were using a `<h2>` tag in your whole codebase was in the `<Title>` component – then why not add the styles right there? That’s one reason why Tailwind is so popular.

And to be fair, if everything is a component, then why not? But should everything be a component? Do I need a `<Button>` component if I have a perfectly good `<button>` HTML element? The answer is, as always, it depends. Perhaps if it’s a very, very complicated button, with lots of different variants. But didn’t we want a consistent layout?

The one gripe I have with components is that they are usually a build-time abstraction: you don’t see them anymore in the browser’s dev tools element inspector. Unless you use web components, but then you have to deal with the shadow DOM, which is its own, hard to penetrate, level of indirection. Or unless you use your framework’s custom developer tools extension, but there you usually don’t see the HTML elements anymore, _only_ your components.


## Modern HTML and CSS

Meanwhile, HTML and CSS have not stood still. There are plenty more semantic HTML elements nowadays (like `<main>`, `<header>`, `<footer>`, `<section>`, `<search>`, etc.), and you can style them with [attribute selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Attribute_selectors), [parent selectors](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/:has), and [much more](https://mastrojs.github.io/guide/css/#want-to-learn-more-css%3F). But to use those effectively, you need to be aware of exactly what HTML elements you have on your page, and how they’re nested. And if you overuse components, that abstraction makes it harder to see directly in your code what HTML you'll have in your browser.

To be clear, I’m not saying you should never use components. But I’d recommend going with the least powerful abstraction that still solves your problem. And more often than not, this is semantic HTML with a little bit of CSS. Indeed, there is a danger with CSS that you can get yourself into a mess if you don't restrict yourself enough. Since CSS is so powerful, sometimes you have to be mindful of every character. It pays off to adhere to a few principles like:

- Use the [direct child combinator](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Selectors/Child_combinator) `>` instead of the space wherever possible. (The space selects all children, regardless how deeply nested.)
- Don’t invent new classes for everything, but use element selectors where possible. (Read this [great piece by Heydon Pickering](https://www.smashingmagazine.com/2016/11/css-inheritance-cascade-global-scope-new-old-worst-best-friends/) for elaboration of this point.)
- Take a bit of time to set up a few [CSS variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties), then restrict yourself to using those instead of magic numbers for spacing and sizes.

And sure, maybe you’ll need to factor out a few things to reusable components once your website grows. And you may even want to place their CSS file in the same folder as the component, and use the name of the component as a class. (In HTML5, class attributes are case-sensitive. So one way to mark your classes as “tied to a component” is to uppercase them.) But that doesn't mean you need a bundler or baroque build step: if you have many CSS files and are worried about performance, you can just [concatenate them](https://mastrojs.github.io/guide/bundling-assets/#bundling-css).


## Data and reusable templates

On another front, long before there was any talk about components, people wanted to reuse the same content on different pages. Possibly the simplest example is to reuse the titles of your blog posts on the index page of your blog. It would be annoying having to keep the index page and the detail pages manually in sync by always updating both, when you change the title of a blog post.

Thus, another level of indirection was introduced. Instead of having plain HTML files, you have some kind of separate data format: either a database, or maybe just plain markdown and YAML or JSON files.

As with any of the levels of indirection we’ve been talking about here, this especially shines for _high-volume_ productions (i.e. your website has lots of content). And you want all that content to be laid out _consistently_.

Jeff Eaton has a [wonderful slide deck about CMSes](https://aarhus24.boye-co.com/wp-content/uploads/2024/01/CMS-Kickoff-2024-Buried-In-Blocks.pdf) with this grid in it:

|               | low volume     | high volume              |
|---------------|----------------|--------------------------|
| consistent    | piece of cake  | structure, templates, APIs |
| unpredictable | custom design, development | here be dragons |

If you’re doing _low volume, unpredictable_ stuff, all these levels of indirection might only get in your way. Why separate content and layout, and why reuse styles, if you only have a handful of things to style anyway? Then you might be better off just using a graphical tool like Webflow, or slapping those inline-styles or [Tailwind classes](https://dev.to/toboreeee/its-almost-2026-why-are-we-still-arguing-about-css-vs-tailwind-291f) on your stuff.


## Tailwind

Did I just say Tailwind is conceptually the same as inline-styles? Yes. Tailwind’s answer to [why not just use inline styles?](https://v3.tailwindcss.com/docs/utility-first#why-not-just-use-inline-styles) says something about a "predefined design system" (which you can easily set up with CSS variables as well), and about responsive/hover/focus (which are trivial in plain CSS). But they don’t seem to disagree with the claim that at least conceptually, Tailwind is equivalent to inline styles.

What Tailwind unfortunately does impose is a build step, which is another giant level of indirection – especially since it's not a simple transform, but comes with a lot of logic and non-standard CSS keywords like `@theme` and `@utility`. And if you inspect an element in your browser's developer tools to debug something, you'll have to understand all that indirection as well.

But there are plenty of utility-class CSS frameworks out there that don't require a build step, if that's what you're after. Whether the elimination of unused CSS is worth the build step is for you to decide. But I wouldn’t sweat the CSS size too much. Consider how big your HTML payload is anyway with all those utility classes, static CSS usually has fairly long cache live-times set, and finally both compress well over gzip/brotli.


## Levels of indirection

What’s the take-away of all this? You may have heard this [quote](https://en.wikipedia.org/wiki/Fundamental_theorem_of_software_engineering):

> We can solve any problem by introducing an extra level of indirection – except the problem of having too many levels of indirection.

The difficulty is knowing in which situation you find yourself today.
