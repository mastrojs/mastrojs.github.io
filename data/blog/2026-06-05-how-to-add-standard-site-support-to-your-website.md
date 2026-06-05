---
title: How to easily add Standard.site support to your website
description: "No need to store rkeys in your YAML frontmatter – just derive them from your existing URL paths."
date: 2026-06-05
author: Mauro Bieg
authorLink: https://github.com/mb21
---

Since [Bluesky added support for Standard.site](https://atproto.com/blog/standard-site-bluesky-timeline), everyone with a blog seems to be racing to roll out an implementation. That’s awesome, and yet another example of how [ATproto](https://atproto.com/) feels like one of the more exciting things happening in tech right now.

## What ATmosphere?

For a bit of background, see e.g. [Mat Marquis’s post on Standard.site](https://wil.to/posts/standard-site/) and Steve Klabnik’s [How Does BlueSky Work?](https://steveklabnik.com/writing/how-does-bluesky-work/)

The TL;DR is that you can think of _the ATmosphere_ as a big distributed database, which is partially mirrored a few times via relays. Anybody with an account on a PDS (Personal Data Server – Bluesky being the biggest example) can make HTTP requests to it and read and write records in the database. A set of evolving, shared lexicons make sure your data remains portable and you’re not being locked in. The latest such lexicon to reach critical mass is [Standard.site](https://standard.site/) – it’s a standardized way to express metadata about publications and documents (e.g. blogs and their posts).

One interesting way that some people use this is to use the ATmosphere as the backend database for their website.


## Uploading blog posts

But most people already have their posts in a traditional database (e.g. via a CMS), or have a static site with Markdown files. How can you ensure that whenever you create a new blog post (or change an existing one), the corresponding records in the Atmosphere are created (or updated)?

An ATproto record in the `site.standard.document` _collection_ has a URI like this:

```
"at://" DID "/site.standard.document/" rkey
```

The [DID](https://atproto.com/specs/did) (Decentralized Identifier) uniquely identifies your user, and the [rkey](https://atproto.com/specs/record-key) (record key) uniquely identifies the specific document in the collection.

When creating a new document, the obvious approach (that most people currently seem to be following) is to push the data and let the PDS server auto-generate an rkey – which usually will be a TID (Timestamp Identifier).

But in order for things to be verified, you need to add your record’s AT-URI to the HTML of your blog post’s web page with:

```js
<link rel="site.standard.document"
  href={`at://${did}/site.standard.document/${rkey}`}>
```

Which means that if your rkey is a TID, you need to store it somewhere after it’s generated – e.g. in your CMS’s database, or in the YAML frontmatter of your markdown files.

While this is fine, it can be a bit annoying. Especially for a website without a database, it makes things a bit hard to automate. If you set up your CI/CD pipeline to push to the ATmosphere, do you then have it create a new commit with the modified markdown frontmatter?


## Deriving the rkey from the URL path

An alternative approach, which I first saw [proposed by Kuba Suder](https://bsky.app/profile/mackuba.eu/post/3mn5hqmvlts2w), is to derive the rkey from the URL path of the web page. This is what I just implemented in the new [@mastrojs/atproto](https://github.com/mastrojs/atproto) package.

Since rkeys cannot contain slashes and other special characters, e.g. the rkey for the document at `https://mastrojs.github.io/blog/2026-05-23-is-AI-causing-a-repeat-of-frontends-lost-decade/` becomes `blog-2026-05-23-is-AI-causing-a-repeat-of-frontends-lost-decade`. Then, in the code generating the HTML, we simply re-derive it using the `rkeyFromPath` function from `@mastrojs/atproto`:

```js
<link rel="site.standard.document"
  href={`at://${agent.did}/site.standard.document/${rkeyFromPath(doc.path)}`}>
```

This does mean however, that you cannot change the URL of your post after you’ve published it. But I suppose you shouldn’t be doing that anyway. (I’m [working on](https://github.com/mastrojs/atproto/issues/2) relaxing that limitation a bit.)


## Running the script

Finally, we package everything up in a nice declarative way. You simply add a script to your codebase with something like the following:

```ts
import { readMarkdownFiles } from "@mastrojs/markdown";
import { createOrUpdateStandardSite, CredentialSession } from "@mastrojs/atproto";

const publication = {
  url: new URL("https://example.com/news/"),
  name: "Peter's News",
};

const posts = await readMarkdownFiles("data/posts/*.md");
const docs = posts.map((p) => ({
  title: p.meta.title!,
  publishedAt: new Date(p.meta.date!),
  // this path will be appended to publication.url to get the full URL:
  path: p.path.slice("data/posts/".length, -3) + "/",
}));

const session = new CredentialSession(new URL("https://bsky.social"));
await session.login({
  identifier: "your.bsky.social",
  password: process.env.ATPROTO_PASSWORD,
});

await createOrUpdateStandardSite(session, publication, docs);
```

Whenever you run your script, it will fetch the existing records from your PDS, diff them against your current input, update the existing ones, and upload any new records. Regardless of whether your run it manually, or in your CI/CD pipeline.


## Does it work?

The [Standard.schema validator](https://site-validator.fly.dev) seems to be fine with this approach. The ATproto docs call this kind of rkey a [Record Key Type: `any`](https://atproto.com/specs/record-key#record-key-type-any). And indeed, try posting a link to this blog post on Bluesky, and you should see the shiny “View publication” button appear!

If you want the same for your blog, go ahead and use the [@mastrojs/atproto](https://github.com/mastrojs/atproto) package. Bug reports and contributions welcome. Happy publishing to the ATmosphere!
