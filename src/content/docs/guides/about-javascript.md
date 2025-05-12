---
title: A word about JavaScript
template: splash
---

Now that we've covered why we need HTML and CSS, let's quickly talk about JavaScript. It's the third language that the browser understands, and best used sparingly to add interactivy to a page.

Although unfortunately, some websites load millions of lines of JavaScript into the browser. Since a browser is also known as a _client_, this is known as client-side JavaScript. In fact, client-side JavaScript frameworks like React compute the whole page in the browser of your user every time they load the page. This may be required for an app like Google Docs or Visual Studio Code. But for most websites, it just makes everything slow for no good reason – especially on mobile phones, with their limited computing power and slow networks.

However, not all JavaScript is bad JavaScript. Afterall, it's a general-purpose programming language like any other. Nowadays, you can run JavaScript also on your server or laptop to generate HTML, and only send that to your user's browser – just like people have done with PHP or Ruby for ages. This is known as server-side JavaScript and it's what we'll be doing primarily in this guide.

We'll use the _Mastro_ static site generator, which gives you enough to get started quickly, without adding too many layers of complexity between the code you write and the HTML and CSS that is generated at the end.

Usually, you would have to install a JavaScript runtime (like _Node.js_ or _Deno_) and the static site generator on your computer. But Mastro is special in that it can also run as a VS Code extension in your browser. That's what we'll set up in the next chapter. That way you don't have to install anything on your computer, and don't have to mess around with the terminal and command line.
