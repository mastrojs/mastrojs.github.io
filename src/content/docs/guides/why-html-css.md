---
title: "Motivation: Why learn HTML/CSS?"
template: splash
---

In this chapter, we quickly go over your options when choosing the tool to build your website with, why HTML and CSS are still key, and why a _static site generator_ like _Mastro_ is one of the easiest ways to get started with HTML and CSS.


## You want to build a website?

The following are your four major options. Starting with those giving you the least control, and ending with what's giving you the most control and capabilities:

1. Use an **off-the-shelf service** like Wix or Canva (which produce horribly bloated websites that load slow on mobile phones – it's kind of the fast food of website builders), or Webflow (which is better in terms of output quality). These get you started really quickly and are okay for throw-away websites, but they lock you in and it's basically impossible to switch away from them without redoing your website.

2. Use a **traditional CMS** like WordPress, which is at least [in theory](https://arstechnica.com/tech-policy/2024/10/automattic-demanded-web-host-pay-32m-annually-for-using-wordpress-trademark/) open source, giving you the option to move your website to a different host later on, if you should choose to do so. WordPress has a huge ecosystem of third-party plugins and themes that you can install and configure without learning any HTML, CSS or other programming language. But their quality varies wildly, and it's often hard to get them to do _exactly_ what you want if you have specific needs (either in terms of functionality or design). And worst of all, you're the one that needs to keep all the plugins updated to avoid security vulnerabilities (which happen semi-regularly), unless you want somebody to hack into your web server.

3. Use a **static site generator** such as Jekyll, which doesn't require you to run a server. With static site generators, the entire website is generated ahead of time, and then served to your website visitors from a CDN, which is what services like Netlify or GitHub Pages offer you for free (if you have a modest number of visitors). While there usually are some ready-made templates, these tools give you the full power to write your own HTML and CSS, giving you full control over the design and layout of the page.

4. Use a **full-stack framework** (like Ruby on Rails, Django or Laravel), which in addition to HTML and CSS, require knowledge of the programming language they're using (Ruby, Python or PHP, respecitvely). Because they server-side render your site, they also require a server and a database. If you're not sure, you probably [don't need a full-stack framework](https://mb21.github.io/blog/2023/09/18/building-a-modern-website-ssg-vs-ssr-spa-vs-mpa-svelte-vs-solid.html#static-site-generation-ssg-vs-server-side-rendering-ssr).


## Why learn HTML and CSS when there are easier ways to build a website?

In the end, your web browser (Safari, Firefox or Chrome) only understands three languages: HTML, CSS and JavaScript. HTML is for text and structure, CSS for looks and styles, and JavaScript for interactivity (should you need that).

All four options above send HTML and CSS to the browser. But the way they go about it is very different. It's up to you to choose the right tool for the job.

But if you want to end up with a truly great website, that loads fast even on mobile phones, and that looks exactly as you want to, then you should take a couple of hours to learn the formats in which your website ultimately will arrive in the browser: HTML and CSS. And the easiest way to get started with that is option 3: using a static site generator. So that's what we'll do in this guide.
