---
title: Web application architecture and the write-read-boundary
---

## Dataflow and the write-read boundary

If we look at how the data flows through applications in production systems, it typically passes through some (or all) of the following steps:

<div class="diagram">

- Database<br>(or .md files, or external service with API)
- Build step<br>(e.g. CI/CD runner)
- Web server<br>(code + perhaps in-memory cache)
- CDN<br>(cache + perhaps edge compute)
- Browser<br>(browser cache + perhaps client-side JS)

</div>

It's a long path from the data source to the user's browser. In each step, the data is transformed by some code, or cached, or both. In his book [Designing Data-Intensive Applications](https://dataintensive.net), Martin Kleppmann calls the path from source until the data is stored for eventually being read out, the _write-path_. Whenever the data changes, it is eagerly pushed down the write-path. Only once a user request comes in, the data is read from there and lazily pulled out – that path from the cache to the user's browser he calls the _read-path_.

The further down in the chain you push the data, the more steps you pre-compute. That means you have more work upfront, but less work once the request comes in, also resulting in a faster response.

Let’s call the place where the write-path and read-path meet the _write-read boundary_. Changing your architecture and moving that boundary around leads to very different performance characteristics. Let’s look at a few examples.

## Static site on CDN

The dataflow for a statically generated site deployed with GitHub Pages, like we did in the beginning, looks as follows:

1. Source: Markdown files directly in the repo
2. Build step running in GitHub Actions
3. Deploy to GitHub’s CDN
4. Browser (GitHub Pages sets `Cache-Control` headers with time-to-live of 10 minutes)

If the user visited the page already within the last 10 minutes, it will still be in their browser cache and can be read from there. In that case, the write-read boundary is the browser cache. If it’s not cached there, the browser will download it from the CDN. In that case the write-read boundary is the CDN cache.

Either way, the write-read boundary is very close to the user. That’s why the website is very fast – at the cost of having to statically pre-compute the whole page ahead of time.

## Server-rendered page with database

The Dataflow of a page served by a typical PHP or Ruby on Rails website (or if we had used a real database in the previous chapter) is as follows:

1. Source: SQL database
2. Web server merging the data with a template
3. Browser

This is the other extreme, where the normal case for pages is that the write-read boundary is at the very top: the database. It's nice that nothing needs to be pre-computed, and every page can be dynamically tailored to the user making the request. But it also means that every request has to go all the way to the central database and back. This may not only be slow, but also puts a lot of stress on your servers if you have hundreds of thousands of requests coming in per second.

To speed things up, you can move the write-read boundary close to the user. If you are okay with the tradeoffs, using the HTTP `Cache-Control` header to leverage the browser cache (and potentially a CDN) is a good first step.

What a lot of companies end up doing as their business grows, and their website receives more and more traffic, is to add more web servers (horizontal scaling). But having a central database as a single source of truth then often requires them to take load off that database by adding caches further down, thereby moving the write-read boundary closer to the user. Typically, they either add an in-memory cache on each web server, or a distributed cache like Redis that can be shared across all the web servers, or both.

## Alternative architectures

The static site case, and the server with a central database, are just the two most common web application architectures. But there's a lot more that can be done, for example with different kinds of databases (e.g. distributed databases, key-value stores, etc.), with queues (e.g. Event Sourcing), or with moving the computation itself to the CDN (known as "edge computing") – each with its own different sets of trade-offs.
