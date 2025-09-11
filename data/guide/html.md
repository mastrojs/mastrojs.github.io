---
title: Introducing HTML
---

In this chapter, you build your very first page.


## Your first website

The simplest website is a single HTML file. In Mastro, each file in the `routes/` folder results in one or more files publicly accessible on your website.

1. If you've started from the template repository, delete all files in the `components` and `routes` folders by right-clicking each file individually, then select "Delete Permanently". Don't worry, we'll add them again in later chapters of this guide. If you want, you can also edit the `README.md` file.

2. Create a new file `routes/index.html`: with the `routes` folder selected, click the leftmost of the four small icons at the top (a sheet of paper with a plus icon in it), type `index.html`, and hit enter.

3. The file opens on the right. Type (or copy-and-paste) the following HTML in it:

    ```html title=routes/index.html
    <!doctype html>
    <html>
      <head>
        <title>My website</title>
      </head>
      <body>
        Hello world!
      </body>
    </html>
    ```

Hit `Ctrl-Shift-P` (Windows or Linux) or `Command-Shift-P` (Mac), type `mastro`, and when the "mastro: Preview and Generate Website" item appears, hit enter.

<details>
  <summary>Using Firefox?</summary>

  In Firefox, this keyboard shortcut unfortunately opens a new incognito window. Instead, you need to hit `Ctrl-P` (Windows or Linux) or `Command-P` (Mac) and type `>mastro` (note the `>`).
</details>

This opens the _Mastro preview pane_ in a new tab to the right, displaying your `index.html` file, just like it would show in a web browser tab. Note how the text in the `<title>` is shown as the tab name, just like it would be in a browser's tab. The `body` is the part of the HTML file that is visible as the page itself.


## Content first

When creating a new page, always start with the HTML. It's the foundation. Later you can add CSS to make it look nice, and maybe JavaScript to make it interactive. But always start with the content. Let's add some:

```html title=routes/index.html
<!doctype html>
<html>
  <head>
    <title>My website</title>
  </head>
  <body>
    <h1>Common HTML elements</h1>
    <p>
      Let's go through the most important HTML elements to
      structure your content:
    </p>

    <h2>Paragraphs</h2>
    <p>The p element marks a paragraph of text.</p>

    <h2>Headings</h2>
    <p>
      At the very top of the body, we have the heading of this page
      in an h1 element. This is what search engines (like Google)
      and screen readers (used by visually impaired readers) look for
      when they want to know what the page's title is. Therefore, you
      should only ever have one h1 element on any given page.
    </p>
    <p>
      The h2 element is a sub-heading. HTML has h1 up to h6 elements,
      to mark progressively deeper nested sub-headings. You should
      use those to mark the structure of your page. All headings
      together should act like a table of contents for your page.
    </p>

    <h2>Lists</h2>
    <p>
      Let's add an ordered list
      (meaning the list markers will be numbers):
    <p>
    <ol>
      <li>list item one</li>
      <li>list item two</li>
      <li>list item three</li>
    </ol>
    <p>
      and an unordered list
      (the list markers will be bullet points):
    <p>
    <ul>
      <li>list item one</li>
      <li>list item two</li>
      <li>list item three</li>
    </ul>

    <h2>Formatting</h2>
    <p>
      Note how all elements introduced so far cause a line-break
      before and after them? That's because they are so-called
      <a href="https://developer.mozilla.org/en-US/docs/Glossary/Block-level_content">block elements</a>.
    </p>
    <p>
      However, links (like the a element we just saw),
      <em>emphasis</em> (rendered as italics), and
      <strong>strong emphasis</strong> (rendered bold),
      are all inline elements. That means they don't cause
      any line-breaks by default.
    </p>

    <h2>An image</h2>
    <img src="chair.jpg" alt="A chair" height="300">
    <p>
      We will add an image file <code>chair.jpg</code> later.
    </p>
    <p>
      For now, note the alt attribute on the image. It is required
      and contains "alternative text" that is read to visually
      impaired readers, or shown if the image fails to load.
    </p>
    <p>
      If the image is relevant content, the alt text should
      therefore be a brief description of what's in the image.
      If the image is just decoration, you should use alt="".
    </p>
  </body>
</html>
```

Copy-and-paste that, replacing the current contents of your `index.html` file and see how the preview on the right renders it. That rendering – converting the HTML to pixels on the screen – is all done by your browser.

Notice how we've indented each HTML element that's nested with two more spaces than its parent element? While not strictly necessary, it's considered good practice to do so (some people use four spaces or tabs instead). It may seem tedious in the beginning. But if you don't do it and just add more and more text, eventually you'll lose sight of which elements are nested in which ones, and you'll curse yourself for wondering why all your text is too big, only to discover 15 minutes later that you just forgot that closing `</h2>` somewhere at the beginning, for example.

:::tip
## Want to learn more HTML?

For a more thorough introduction, I can highly recommend the [MDN guide on HTML](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Structuring_content) and the [_HTML for People_ tutorial](https://htmlforpeople.com/zero-to-internet-your-first-website/).

If you want to know how to achieve a specific thing – e.g. how to do tables in HTML – it's usually best to find the corresponding page on MDN. For example by entering `MDN HTML table` in your favourite search engine. That way you don't end up on some low-quality website with inaccurate or outdated documentation.

For a modern guide to favicons and social media / messenger app link previews, see [Get out of my \<head\>](https://getoutofmyhead.dev/).
:::


## Images on the web

Probably you've noticed that the image on our page is broken. That's because we haven't added an image file yet. You can find an image of a chair, or some other image, and add it by dragging-and-dropping it into the `routes/` folder. Make sure the name of the file is the same as what you have in the `src` attribute of the `img` element in your HTML.

Alternatively, you could also change the `src` attribute to point directly to an image somewhere on the web. However, if that third-party removes the image from their website (or moves it to a different location), your website will lose the image.

The image should not be too large for your website to load quickly – even on a slow mobile network. If it fills the whole page width, less than 500kB is usually good. For photos, JPEG images work okay. For small icons, or images with a lot of text, PNG usually works better. However, if you can figure out how to export your image in the better optimized WebP format, do that instead. Of the formats already supported in all modern browsers, WebP produces the smallest file size. One final exception: if your image is a [vector graphic](https://en.wikipedia.org/wiki/Vector_graphics), then use the SVG format. We'll get back to transforming images in a [later chapter](/guide/bundling-assets-caching/#transforming-images).

In the next chapter, you'll save and publish your work!
