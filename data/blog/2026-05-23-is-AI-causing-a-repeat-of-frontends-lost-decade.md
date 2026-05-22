---
title: "Is AI causing a repeat of Frontend’s Lost Decade?"
description: "AI is doing to programming what framework-brain did to the frontend before. Deskilling, or just working at a higher level of abstraction?"
date: 2026-05-23
author: Mauro Bieg
authorLink: https://github.com/mb21
---

**What AI is doing to the jobs of programmers feels very familiar to a lot of us frontend developers – because it has happened to us before.**

Let’s first look at the transformation of the frontend and agentic coding through the lens of _deskilling_, and then look at both changes through the lens of _a higher level of abstraction_. Finally, we’ll look at previous changes, like the advent of copy-pasta from Stack Overflow, and how the Bauhaus movement reacted to rising industrialization.


## Deskilling

Just like AI is deskilling programming now, JavaScript frameworks have deskilled frontend development in the last decade. As someone who started with HTML/CSS and a bit of PHP, later did Ruby on Rails, and then was frontend team lead of a major Swiss newspaper (Next.js at the time), I've seen the transformation first-hand. And no need to take my word for it! I’m [not the first](https://ohhelloana.blog/overthinking-ai/) to [say so](https://www.baldurbjarnason.com/2024/the-deskilling-of-web-dev-is-harming-us-all/). Alex Russell called it [Frontend's Lost Decade](https://www.youtube.com/watch?v=7ge8iwaNNAw).

What is deskilling? [From Wikipedia](https://en.wikipedia.org/wiki/Deskilling):

> Deskilling is the process by which skilled labor within an industry or economy is eliminated by the introduction of technologies operated by semi- or unskilled workers. This results in cost savings [...] and reduces barriers to entry, weakening the bargaining power of [workers].

Let’s see how this applies to the frontend, and then to agentic coding.

### The deskilling of the frontend

A lot of programmers may not know this, but frontend used to be a highly specialized skill, requiring knowledge of semantic HTML, CSS, the differences of various browsers, accessibility, progressive enhancement, network performance, interface design and user testing – to just name a few. To distinguish what they’re doing from what “frontend” has become, practitioners of this arcane art nowadays often refer to it as the “front of the frontend”.

The _deskilling of the frontend_ was the introduction of frameworks and other tooling that treats the browser as a mere compilation target – just like any other app runtime (e.g. JVM or iOS). Then you can just load in [the monstrosity that is a Shadcn radio button](https://paulmakeswebsites.com/writing/shadcn-radio-button/), and don’t need to understand the underlying HTML, any subtleties involving different browsers, page load performance, and accessibility.

As the Wikipedia quote above points out, this “results in cost savings” for businesses, since they then can easily put any general programmer to work on the frontend. Often, a “full-stack developer” is unfortunately not somebody who deeply understands the frontend _and_ the backend, but a generalist who just knows enough to wrangle a JavaScript framework to do both. This allows businesses to easily [switch programmers around between different projects](https://www.seangoedecke.com/seeing-like-a-software-company/). The same generalist can even also do native apps with React Native and Electron! To finish the Wikipedia quote: this “reduces barriers to entry” (which is something I’ve always cherished), but it also “weakens the bargaining power of workers”.

### AI is deskilling programming

What’s currently happening to programmers more generally seems very similar to what web developers in particular have been going through already. The skilled job of writing code manually is being “eliminated by the introduction of technologies, operated by semi- or unskilled workers.”

We still don’t know exactly what skillset the workers wrangling agentic AI will need to have at the end of this transformation, and at what price point we’ll arrive at – for both labour, and for local and remote LLMs. But it is already clear now, that businesses absolutely will use this technology for cost savings and weakening of the bargaining power of workers.

### A profound sense of loss

Just like artisans and craftsmen that were replaced by assembly line workers more than a century ago, we feel a profound sense of loss. We grieve that a skill, that we spent half a lifetime honing, is not being valued by the market anymore. And we’re saddened that the new process results in lower quality work, and that a lot of people just don’t seem to care.


## Operating at a higher level of abstraction

An alternative way to look at “deskilling” is of course to argue that this is just increasing efficiency using automation. And what engineer doesn’t like automating things? It’s a big part of our job after all!

In this framing, the new technology introduced simply works on a higher level of abstraction, allowing the person operating it to focus on the bigger picture, without having to bother about unimportant details. But exactly which details are deemed “unimportant” is a very consequential and sometimes subjective decision. And eventually, the details [always leak through](https://www.joelonsoftware.com/2002/11/11/the-law-of-leaky-abstractions/).


### “Modern” frontend: a tower of leaky abstractions

It’s common for an abstraction to come at a cost of performance. But since computers are very fast nowadays, we were often willing to trade some runtime performance for increased developer productivity (garbage collection is one example). And for high-powered servers under moderate load, this is a very sensible tradeoff. But mobile phones on slow networks are a different beast.

By using a heavy client-side JavaScript framework like React, and a lot of packages from that ecosystem, you’re abstracting over things [like accessibility](https://gbbns.co/journal/accessibility-problem-isnt-design/), and [performance on lower-end phones, or on slow networks](https://infrequently.org/series/performance-inequality/). In effect, you’re choosing not to think about those things, and you’re choosing not to care about them.

### Agentic coding: an undeterministic abstraction

By using agentic AI to code a feature or fix a bug, you’re describing the change at a higher level of abstraction, writing fewer words than writing all code by hand. The AI will fill in the details you omitted by looking at its training data and surrounding context – sometimes guessing well, other times not. Whether you find this useful or not depends to a large degree on your opinions on what’s important when coding.

But compared to previous abstractions in programming, agentic coding is a very leaky abstraction. It’s not deterministic like a compiler, and slight variations in input or model can give very different results. That has led people to compare AI to “junior engineers”, since those are also not deterministic. But one difference is of course that people are capable of learning, without you having to endlessly tweak their AGENTS.md or SKILL.md files.

### LLMs as an extension of copy-pasta from Stack Overflow

As such, the best analogy for using LLMs I’ve found so far is how a Google search used to behave. It was a skill all of us had to learn at some point: choosing just the right keywords, so that the right forum post (and later Stack Overflow post) would surface on the first Google results page. Just like prompting an LLM, in order to return the right assemblage of its training data, a fuzzy web search is a lookup in a very high-dimensional space. And just like with LLMs, the lookup used to be very sensitive to slight variations of wording, and changes to Google’s search index.

In recent years, among other things, Google has changed the search to normalize entered terms much more aggressively. For people who were not versed in the dark art of Google-fu, this made the search much easier to use. But for those of us that had acquired that skill, it made Google search much less powerful. Specialized keywords used to bring us directly to an answer. Now they get normalized to a synonym, or to a closely associated word, and we land on a more generic page.

But the advent of Google, and later Stack Overflow, irreversibly changed programming. Instead of reading the f***ing manual, programmers could now just blindly copy & paste answers from Stack Overflow, and surprisingly often got something that kind of worked. Seen through this lens, LLMs are just a continuation of the same trend: tools and abstractions that make people that know what they’re doing slightly faster, and enable people who don’t really know what they’re doing to arrive at something that often kind of works. And you know what? That’s great!

But we shouldn’t fool ourselves: at some point the abstraction will leak. And then somebody has to invest the time to actually deeply understand what’s going on – and fix it. Just like we taught junior programmers to read and understand the Stack Overflow answer before using it, now we need to teach people to read and understand the stuff the LLM spits out, and to understand how it fits into the existing codebase.


## Does quality matter?

Unfortunately, some programmers never progressed to the stage of trying to really understand the Stack Overflow answer. Why bother if it works? And while not publicly acknowledged, a lot of companies were actually happy with this approach. What’s different now is that companies go out of their way to publicly proclaim how much AI they’re using, without even pretending to look at the output.

While there are definitely [valid use-cases for LLMs](https://htmx.org/essays/yes-and/), there are also lots of new ways to mess up your code, and to mess up your organization’s communication and processes. This seems especially challenging to figure out as a team. Just like with code review, there are widely [differing views on how to use and integrate LLMs](https://ky.fyi/posts/ai-burnout) into our workflows (if at all). And if the team is not aligned on what things they value, this can really throw a wrench in the works.

It’s also a sad fact of life that a lot of companies are doing very well, even though they’re churning out abysmal software. Despite what we programmers would like to believe, business success and software quality are very rarely correlated. Usually, other factors simply dominate. Often, software projects are treated as black boxes, known to fail about as often as they succeed, and are derisked in various ways (in the worst case, a different team will have another go at it).

And it’s been the same for frontend development. Unfortunately, a terrible website has a relatively small impact on the bottom line. Does a slow website and lots of cookie banners hurt conversion? Sure, but that effect is relatively small compared to other factors like brand loyalty and pricing. And all the competitors have slow websites as well! Besides, nobody was ever fired for choosing React.

Does that mean we should stop caring about our users and about our craft? No. But it does mean that it’s become even harder to find a job where you’re allowed to do so. Hopefully, the pendulum will swing back a bit, once the hype has blown over, and we’ve a better understanding what tasks LLMs are actually a good fit for and what not. But it’s safe to say that our profession will not be the same as before.


## The Bauhaus movement

What did previous generations of craftspeople do when everyday goods and buildings suddenly could be mass-produced by industrial processes? One reaction was to copy the style of old, and make the industry crank out widgets and buildings that at least looked like they were handcrafted.

Countering this trend of [historicism](https://en.wikipedia.org/wiki/Historicism), an alternative approach was developed by the [Bauhaus movement](https://en.wikipedia.org/wiki/Bauhaus) of the early 20th century. Instead of pitting factory workers against craftspeople, their stated goal was to have them work together, and redevelop the arts and crafts with industrial manufacturing processes in mind. The Bauhaus urged designers to go back into the workshops, and work with the materials themselves. Still with the goal of arriving at designs that would then be mass produced. But always keeping the end user and mind, and deeply caring about them. Modern industrial design, as exemplified by Dieter Rams and Johnathan Ive, can trace its roots straight back to the Bauhaus.


## Caring about quality and the user

How can we translate this line of thinking to software?

Software sits somewhere in-between craft on one hand (the program we write gets shipped “as is” to our users, without first going through a manufacturing step), and industrial design on the other hand (we ship the same thing to potentially thousands of users, who we never get to see interacting with our product).

The need for being able to write code by hand is clear. Just like industrial designers need to know the materials their products will be made of, a web designer needs to be intimately familiar with HTML and CSS.

While it’s great that tools like Google, Stack Overflow, [ready-to-use libraries](https://jessitron.com/2020/08/04/back-when-software-was-a-craft/), and now LLMs are making things easier for beginners, this also means that the natural barrier to get anything working at all is continuously being lowered.

While there is a high barrier to entry to a field, it’s difficult to find absolutely terrible pieces of work. Once a craftsman was taught how to build a wooden chair, they invariable were also taught how to not do a terrible job at it.

The industrialization enabled lots of cheap plastic products, designed by people who didn’t take the time to think how they would be used and by whom – yet good industrial design is still a thing. The invention of the word processor enabled lots of terribly formatted documents – yet typography and graphic design still exist. And software like Wix and Next.js enabled the creation of lots of websites that load terribly slow and are not accessible – yet there are still practitioners of the front of the frontend out there. Likewise, AI is enabling lots of AI slop – but this doesn’t mean we don’t still need people who know what they’re doing, and who care about what they’re doing.


## How will it shake out?

But like in other industries, doing things properly will become an ever smaller slice of the pie. But because it’s now easier and cheaper to do so, the size of the pie will continue to grow. It’s very hard to say at this point in time whether the absolute number of people, being payed to do things well, will increase or decrease. If you ask me, there are way too many poorly designed plastic products out there. And it’s a sad fact that designing new type faces is not a sustainable full-time job anymore. But at the same time, there is still so much great work being done in all those domains.

And you know what? Sometimes churning out a quick prototype or MVP is the right thing to do. If you don’t have product-market-fit yet, quick iteration and learning is more important than future-proofing everything. But you need to know what you’re trying to learn, and how you validate those learnings. And when the time has come, it’s usually better to take a step back and do things right from the start (e.g. [good performance is very hard to add to a badly architected frontend later](https://calendar.perfplanet.com/2025/fast-by-default/)).

For any part of the system, you need to know what tradeoffs you’re making, and then decide whether you should buy a service, use an open source library, have an LLM churn it out, or write it yourself. When the hype has died down, the industry will realize it’s just one more tool in the toolbox. But until then, we’re going to see a lot of ugly things: ugly code, broken communications, and awful layoffs under the guise of AI.
