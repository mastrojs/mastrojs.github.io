---
title: Client-side vs server-side JavaScript, static site vs server, SPA vs MPA
---

JavaScript started out as a language to write small scripts and run them inside the browser. But nowadays, the browser isn't the only place anymore where you can run JavaScript.


## Client-side vs server-side JavaScript

Since a browser is also known as a _client_, JavaScript that runs in the user's browser is known as _client-side JavaScript_. This can be useful to add some interactivity to a page loaded in a web browser.

Although ideally, the basic functionality of a page should be usable even if the JavaScript is still loading, or fails to execute at all – perhaps because the user just entered a tunnel with their mobile phone, or are using an older browser, or perhaps because the developer made a small programming error causing the JavaScript to crash. This concept of making a website first work under suboptimal conditions, and rely on more advanced tech like client-side JavaScript only for enhancements, is known as [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement). You may also have heard of the closely related concept of [graceful degradation](https://developer.mozilla.org/en-US/docs/Glossary/Graceful_degradation).

Client-side JavaScript is best used sparingly. Although unfortunately, some websites download millions of lines of JavaScript every time you open them. Client-side JavaScript frameworks like React run the program to generate the HTML right in the browser – every time you open the page.

This may make sense for an app like Google Docs, Figma, or Visual Studio Code. Or perhaps even for an interactive dashboard, used only by a small number of internal people that you know will be on fast machines on a fast network, or will load it once and then keep it open for hours. But for most websites, it just makes everything slow for little reason – especially on mobile phones, with their [limited computing power and slow networks](https://infrequently.org/series/performance-inequality/).

In recent years, frameworks like React have added "server-side rendering" modes. But even there, the page is still "hydrated" on the client, and even "React Server Components" are [reconciled](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components) on the client. All in all, a lot of additional complexity, for a tiny gain in performance.

:::tip
## Test and improve your website's performance

- [WebPageTest](https://www.webpagetest.org)
- [PageSpeed Insights](https://pagespeed.web.dev/) and the "Lighthouse" tab in Chrome's dev tools
- SpeedCurve's [Web Performance Guide](https://www.speedcurve.com/web-performance-guide/)
:::


However, JavaScript is a general-purpose programming language like any other. Nowadays, using e.g. Node.js or Deno, you can run JavaScript also on your server or laptop, generate the HTML there, and only send that to your user's browser – just like people have done with other general-purpose programming languages like PHP, Ruby or Python for ages.

This is generally known as _server-side JavaScript_ – regardless of whether you do static site generation or run a server. The important part is that unlike client-side JavaScript, it doesn't run in the user's browser.
We'll only be using server-side JavaScript in the next couple of chapters of this guide.


## Static site generation vs running a server

In the first half of this guide, we'll be using Mastro as a _static site generator_ – i.e. running the JavaScript ahead of time, to pregenerate all pages of the website. This means the website will be very fast, and doesn't require you to run a server, which you might have to harden against load spikes or attacks.

In later chapters of this guide, we'll use Mastro as a _web server_, which will run the JavaScript to generate a page each time a user visits the page. (Some people call this _server-side rendering_ or _SSR_.) While more complex to operate, running a server gives you the ability to return a potentially different page each time it is visited.

We'll again look at the [various ways to run Mastro later](/guide/cli-install/#different-ways-to-run-mastro).


## SPA vs MPA

As mentioned above, instead of doing all the work on the server, client-side JavaScript frameworks do it in the user's browser. A lot of them even take that approach so far, that when a user clicks a link, the website takes control of loading the next page away from the browser, and reimplements the functionality in JavaScript. (In that case you won't see a request of type "Document" aka "HTML" in your browser's network dev tools.) This approach is called a Single-Page-App (SPA), and just recently [peaked in popularity](https://nolanlawson.com/2022/05/21/the-balance-has-shifted-away-from-spas/).

Their theory is that the client-side JavaScript can do a better job at page navigation than the browser. While this may still be the right approach for highly interactive apps like Figma, for almost all websites, loading and executing that additional JavaScript just makes things slower and more complex – especially if navigating to a new page needs to load data from the server anyway.

:::tip
## Buttery smooth navigation in MPAs

Browsers have really stepped up their game regarding page navigation.

- Using [cross-document view transitions](https://developer.mozilla.org/en-US/docs/Web/API/View_Transitions_API/Using#basic_mpa_view_transition), you can get page transitions, as smooth as in any SPA, by adding [two lines of CSS](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/) to your MPA. They are implemented in Chrome and Safari (and Firefox has signalled intent to ship).
- [Back/forward cache](https://web.dev/articles/bfcache) is implemented in all browsers. This means for example that unless you break the bfcache, an infinite-loading list added with client-side JavaScript will still be there on browser back navigation in your MPA.
- [Speculation Rules API](https://developer.mozilla.org/en-US/docs/Web/API/Speculation_Rules_API) allows you to instruct the browser to preload entire pages a user might navigate to.
:::
