---
title: Client-side vs server-side JavaScript, static site vs server, SPA vs MPA
---

Now that you got a taste of HTML and CSS, let's talk about JavaScript. It's the third language that the browser understands.

But nowadays, the browser isn't the only place JavaScript runs anymore. In this chapter, we quickly go through the mumbo jumbo that describes where and how people run JavaScript. In the next chapter, you'll then get to write some JavaScript yourself.


## Client-side vs server-side JavaScript

JavaScript can be useful to add some interactivity to a page loaded in a web browser. Although ideally, the basic functionality of a page should be usable even if the JavaScript is still loading, or fails to execute – a concept known as [progressive enhancement](https://developer.mozilla.org/en-US/docs/Glossary/Progressive_Enhancement).

Since a browser is also known as a _client_, JavaScript that runs in the user's browser is known as _client-side JavaScript_. It is best used sparingly. Although unfortunately, some websites load millions of lines of JavaScript into the browser. Client-side JavaScript frameworks like React run the program to generate the HTML right in the browser of your user – every time the user loads the page.

This may make sense for an app like Google Docs, Figma, or Visual Studio Code. Or perhaps even for an interactive dashboard, used only by a small number of internal people that you know will be on fast machines on a fast network, or will load it once and then keep it open for hours. But for most websites, it just makes everything slow for little reason – especially on mobile phones, with their [limited computing power and slow networks](https://infrequently.org/series/performance-inequality/).

In recent years, frameworks like React have added "server-side rendering" modes. But even there, the page is still "hydrated" on the client, and even "React Server Components" are [reconciled](https://nextjs.org/docs/14/app/building-your-application/rendering/server-components) on the client. All in all, a lot of additional complexity, for a tiny gain in performance.

:::tip
## Test and improve your website's performance

- [WebPageTest](https://www.webpagetest.org)
- [PageSpeed Insights](https://pagespeed.web.dev/) and the "Lighthouse" tab in Chrome's dev tools
- SpeedCurve's [Web Performance Guide](https://www.speedcurve.com/web-performance-guide/)
:::


## Static site generation vs running a server

However, JavaScript is a general-purpose programming language like any other. Nowadays, using e.g. Node.js or Deno, you can run JavaScript also on your server or laptop, generate the HTML there, and only send that to your user's browser – just like people have done with PHP or Ruby for ages. This is generally known as _server-side JavaScript_ – regardless of whether you do static site generation or run a server. The important part is that unlike client-side JavaScript, it doesn't run in the user's browser.
With the exception of the [JavaScript intro](/guide/javascript/), and [one later chapter](/guide/interactivity-with-javascript-in-the-browser/), we'll be exclusively using server-side JavaScript in this guide.

In the first half, we'll be using Mastro as a _static site generator_ – i.e. running the JavaScript ahead of time, to pregenerate all pages of the website. This means the website will be very fast, and doesn't require you to run a server, which you might have to harden against load spikes or attacks.

In later chapters of this guide, we'll use Mastro as a _web server_, which will run the JavaScript to generate the page each time a request comes in. This is sometimes called _server-side rendering_. While more complex to operate, it gives you the ability to return a potentially different page each time a URL is visited.


## SPA vs MPA

Instead of doing all the work on the server, client-side JavaScript frameworks do it in the user's browser. A lot of them even take that approach so far, that when a user clicks a link, the website takes control of loading the next page away from the browser, and reimplements the functionality in JavaScript. This approach is called a Single-Page-App (SPA), and just recently [peaked in popularity](https://nolanlawson.com/2022/05/21/the-balance-has-shifted-away-from-spas/).

Their theory is that the client-side JavaScript can do a better job at page navigation than the browser. While this may still be the right approach for highly interactive apps like Figma, for almost all websites, loading and executing that additional JavaScript just makes things slower and more complex – especially if navigating to a new page needs to load data from the server anyway.

And browsers have not stood still. Nowadays, you can get equally smooth page transitions by adding [two lines of CSS](https://webkit.org/blog/16967/two-lines-of-cross-document-view-transitions-code-you-can-use-on-every-website-today/) to your Multi-Page-App (MPA).
