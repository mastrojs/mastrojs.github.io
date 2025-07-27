---
title: Images
---

## Images

Now that you have your basic blog up and running on a live website, let's add some images.

Put the original image file, with as high resolution as possible, in `data/posts/2024-01-31-second-post-image-1.jpg`. Then add the following script to `scripts/images.js`, which will convert all your blog images to compressed, lower-resolution versions, so that your website loads quickly:

```js
import { transformImgFiles } from 'mastro'

await transformImgFiles('data/posts/*', 'routes/posts/*', { width: 1000 })
```

This will transform and resize all image files from the `posts/` folder to be 1000px wide, and write the output files to `routes/posts/`.

To make sure this also happens when you publish your static site, change the `build` script in `package.json` to:

    deno task mastro:run:images && deno task build

TODO:
- during development: should we watch the folder? run it on startup?
- alternatively: should the interface be a [transform](https://www.11ty.dev/docs/transforms/) instead of a script? then we could run it also [on-request in dev mode](https://www.11ty.dev/docs/plugins/image/#optimize-images-on-request).



Design space:
- where to place original image: `routes/myImage.server.jpg` or `data/myImage.jpg`
- url of transformed image: `myImage.width=300.webp`
- how `<img` HTML is created:
  - by post-processing generated HTML: e.g. transforming all images or only with certain class
  - by calling a `<Image` component
- which images are transformed:
  - eagerly (prerender): those matched in the source folder. but then how do you know the transform options? you need to have the user run a script.
  - lazily (on request): those referenced from the HTML: then for ssr, we would need a precompile script that finds all places in the source that uses the image, even if behind if condition. so you need to analyze source code.

but either way, we're only talking about build-time images. you cannot have end-user enter a url to an image in a CMS and then resize that image on-demand. that would be out-of-scope.

config that specifies a declarative mapping which we can use to pre-render all images in folder, or lookup on-request in dev mode:
  `transformImgs("data/posts/**/*.jpg", { blogportrait: {width: 400, srcset: ["2x"] } })`
input html: `<img class="blogportrait" src="myImage.jpg">`
output html: `<img class="blogportrait" width="150" src="myImage.hash.webp" ...`
