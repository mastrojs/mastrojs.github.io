---
title: Web application architecture and the write-read boundary
---

If we look at how the data flows through applications in production systems, it typically passes through some (or all) of the following steps:

<div class="diagram">

- <span>a.</span> Database<br>(or .md files, or external service with API)
- <span>b.</span> Build step<br>(e.g. CI/CD runner)
- <span>c.</span> Web server<br>(code + perhaps in-memory cache)
- <span>d.</span> CDN<br>(cache + perhaps edge compute)
- <span>e.</span> Browser<br>(browser cache + perhaps client-side JS)

</div>

It's a long path from the data source to the user's browser. In each step, the data is transformed by some code, or cached, or both. In his book [Designing Data-Intensive Applications](https://dataintensive.net), Martin Kleppmann calls the path from source until the data is stored the _write-path_. Whenever the data changes, it is eagerly pushed down the write-path. Only once a user request comes in, the data is read from there and lazily pulled out – that path from the cache to the user's browser he calls the _read-path_.

The further down in the chain you push the data, the more steps you pre-compute. That means you have more work upfront, but less work once the request comes in, also resulting in a faster response.

Let’s call the place where the write-path and read-path meet the _write-read boundary_. Changing your architecture and moving that boundary around leads to very different performance characteristics. Let’s look at a few examples.


## Static site on CDN

The dataflow for a statically generated site deployed with GitHub Pages, like we did in the beginning, looks as follows:

<div class="diagram">

- <span>a.</span> Source: Markdown files directly in the repo
- <span>b.</span> Build step running in GitHub Actions
- <span>d.</span> Deploy to GitHub’s CDN
- <span>e.</span> Browser (GitHub Pages sets `Cache-Control` headers with time-to-live of 10 mins)

</div>

If the user visited the page already within the last 10 minutes, it will still be in their browser cache and can be read from there. In that case, the write-read boundary is the browser cache. If it’s not cached there, the browser will download it from the CDN. In that case the write-read boundary is the CDN cache.

Either way, the write-read boundary is very close to the user. That’s why the website is very fast – at the cost of having to statically pre-compute the whole page ahead of time.


## Server-rendered page with database

The dataflow of a page served by a typical PHP or Ruby on Rails website is as follows:

<div class="diagram">

- <span>a.</span> Source: SQL database
- <span>c.</span> Web server merging the data with a template
- <span>e.</span> Browser

</div>

If we had used a real database in the [guestbook example](/guide/forms-and-rest-apis/#a-mock-database), it would also have been an example of this architecture.

While static site generation is one extreme, this is the other extreme. The write-read boundary is at the very top: the database. It's nice that nothing needs to be pre-computed, and every page can be dynamically tailored to the user making the request. But it also means that every request has to go all the way to the central database and back, which is not quite as fast as a static site served from a CDN. And while not a problem for most websites, if you have hundreds of thousands of requests coming in per second, it will put a lot of stress on your servers.

To speed things up, you may have to move the write-read boundary closer to the user. If you are okay with the tradeoffs (e.g. people sometimes seeing slightly outdated content), a good first step is using the HTTP `Cache-Control` header to leverage the browser cache (and potentially a CDN).

Additionally, what a lot of companies end up doing as their business grows, and their website receives more and more traffic, is to add more web servers (horizontal scaling). As for the central database – the single source of truth – you can get away with buying a faster server (vertical scaling) for some time, but at some point you'll have to take load off that database by adding caches further down, thereby moving the write-read boundary closer to the user. Typically, this is either done with an in-memory cache on each web server, or a distributed cache like Redis that can be shared across all the web servers, or both.


## Client-side JS frontend with API server backend

Let's look at an architecture that is a mix of the two previously discussed.

You still have a web server that's talking to a central database, but instead of returning HTML, this time it just returns JSON data over a REST API (or GraphQL, or tRPC, or whatever is hip nowadays). This is the so-called backend. For the frontend, because you want to build a highly interactive app, you move all the templates and GUI-logic into the browser, possibly even doing an [SPA](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#spa-vs-mpa). Because this entails a lot of JavaScript, you then usually need a [bundler](/guide/bundling-assets/#bundling).

While you're usually sacrificing initial page load speed with this architecture, you hope that users get smoother and quicker interactions later on. For company-internal tools, or other apps that users tend to open once and then keep open for a relatively long time, this may be the right trade-off.

<div class="diagram">
<div>

<div>
Backend: API server

- <span>a.</span> Source: database
- <span>c.</span> Web server handling auth, returning JSON
</div>

<div>
Frontend: Client-side app

- <span>b.</span> CI/CD build step to bundle JavaScript
- <span>d.</span> Static files on CDN
</div>

</div>

- <span>e.</span> Browser: client-side app merging the data with a template
</div>

The [guestbook example with REST API](/guide/forms-and-rest-apis/#client-side-fetching-a-rest-api) was a simplified example of this architecture: we used an in-memory mock database, and we didn't have a build step to bundle our client-side JavaScript.

Larger companies sometimes favour this architecture, as splitting out the backend to its own service allows a separate team to work on that (with all the pros and cons _that_ entails), and the REST API may also be used with other frontends like native mobile apps for iOS and Android.

For the backend, the write-read boundary is again the database. For the frontend, it's the CDN where the static files are hosted. If you want to speed things up, you again need to move the write-read boundary closer to the user. A very powerful way to do so, is to store some (or all) of the data the user is working with, directly in their browser using [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/Using_the_Web_Storage_API) or [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API). However, since browsers may delete stored data, and because users may want to sync data between different devices, this almost always comes with the added complexity of having to keep the server and client data sets somehow in sync – even with the client sometimes going offline.


## Alternative architectures

The three cases discussed are probably the most common web application architectures. But there's a lot more that can be done, for example with different kinds of databases (e.g. distributed databases, key-value stores, etc.), with queues (e.g. Event Sourcing), with Sync Engines, or with moving the computation itself to the CDN (known as "edge computing") – each with its own different sets of trade-offs.

But usually it's best to start simple, and only once your project experiences growing pains, change your architecture to specifically address those issues.
