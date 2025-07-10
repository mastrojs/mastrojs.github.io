---
title: About HTTP, forms and REST APIs
next: false
---

During this whole guide so far, you've been using Mastro as a static site generator: when you hit the "Generate" button, it creates the html files, which GitHub Pages exposes to the web somehow. But how? What actually happens when you hit enter in your web browser after typing in some URL like `https://mastrojs.github.io/guide/`?

Broadly speaking, your browser makes a request to a server, and that server sends back the HTML. A server is ultimately a computer that usually sits in a data center, and is running a program that answers these requests. Confusingly, that program is also called a server.


## Anatomy of a URL

Let's take a closer look at the above URL. It consists of three parts:

1. `https` (known as the _scheme_) tells us that we will use the HTTP protocol to talk to the server (actually HTTPS – HTTP but securely encrypted).
2. `mastrojs.github.io` is the _host_ part of the URL: it identifies which server on the internet to send the request to. It consists of three parts in turn:
    - `.io` is the top-level domain (the most famous TLD is `.com`)
    - `github.io` is known as the domain
    - `mastrojs` is the subdomain (the most common subdomain is `www`)
3. `/guide/` is the _path_ – it tells the server which page we'd like to see.

Actually, there can be a few more things in a [URL](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL):

![full URL](https://developer.mozilla.org/en-US/docs/Learn_web_development/Howto/Web_mechanics/What_is_a_URL/mdn-url-all.png)

We'll get to the _port_ and the _parameters_ later. The _anchor_ is the only part of the URL that's not sent to the server, it merely allows the browser to scroll directly to the element with the `id` specified in the anchor (sometimes also known as a hash). You can see it in action when clicking a link in the table of contents of a larger Wikipedia article, for example.


## An HTTP request and response

Now, to actually send a message over the internet to that specific server, the browser needs to know the server's IP address, which is a long number that's hard for humans to remember. To find it, the browser does a lookup in the so-called Domain Name System (DNS). If you want your website to be availlable under a custom domain (instead of a subdomain of github.io), you need to pay a registrar, like Hover, to register it in the Domain Name System. (I wouldn't recomend GoDaddy, which features some dark UI patterns.)

The HTTP request that your browser (aka the client) sends to the server when you hit enter might look something like this:

```http
GET /guide/ HTTP/1.1
Host: mastrojs.github.io
User-Agent: Mozilla/5.0 (Mac OS X 10.15) Firefox/139.0
Accept: text/html
Accept-Language: en-GB
```

It's a HTTP `GET` request for the `/guide/` page, using version `1.1` of the `HTTP` protocol. The `Host` HTTP header field mentions the server's hostname, the `User-Agent` header identifies the browser making the request: in this case Mozilla Firefox on Mac OS X. The last two headers let the server know that we'd like the response to be HTML, and preferably in English as spoken in Great Britain.

If all goes well, the server answers with an HTTP response. It starts with the response headers, followed by an empty empty line, followed by the response body containing the HTML. Thus it might start as follows:

```http
HTTP/1.1 200 OK
content-type: text/html
last-modified: Mon, 23 Jun 2025 13:07:45 GMT
content-length: 6172

<!doctype html>
<html lang="en">
```

Notice the `200 OK` on the first line? `200` is the HTTP response status code for "OK" – meaning the server understood the request and managed to send a response. Apart from success, [status codes](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Status) fall into three classes:

- `3xx` (like `301` or `303`) are [redirects](https://developer.mozilla.org/en-US/docs/Web/HTTP/guide/Redirections).
- `4xx` means something went wrong and the server thinks it's the client's fault. The most common one is `404 Not Found`, which means the server does not have the page which the client requested.
- `5xx` means the server ran into some kind of problem when trying to answer. Perhaps it was overloaded or crashed due to a programming error.

As you can see, loading an actual website over the internet is way more complex than opening a static HTML file stored on your laptop's harddisk. It's a dynamic process, involving a sort of negotiation between the client (usually the browser) and the server, and can lead to different results depending on the systems currently online and how they're configured.


## Setup for your local server

To get some hands-on time, start your own server and run it locally (meaning on your laptop):

1.  [Open a terminal application](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#how_do_you_access_the_terminal) on your computer, which will provide you with a command-line interface (CLI). On macOS, the pre-installed terminal app can be found under `/Applications/Utilities/Terminal`. On Windows, you first need to install [WSL](https://learn.microsoft.com/en-us/windows/wsl/).

2.  [Install Deno](https://docs.deno.com/runtime/getting_started/installation/) – a JavaScript runtime similar to Node.js. The easiest way is by copy-pasting the following into your terminal:

        curl -fsSL https://deno.land/install.sh | sh

    and hit enter.

3.  [Navigate to the folder](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#navigation_on_the_command_line) where you want to create your new project folder in, for example type:

        cd Desktop

    and hit enter.

4.  Then type (or copy-paste):

        deno run --allow-write jsr:@mastrojs/mastro@0.0.7/init

    and hit enter. This Mastro initalization script will ask you for a folder name for your new server project. Enter e.g. `test-server` and hit enter (Folder names with spaces are a bit of a pain on the command-line).

5.  Then it will tell you to `cd test-server`, and from there you can enter:

        deno task start

    This will start your server! You can see the dummy page it's serving by opening the following URL in your web browser: http://localhost:8000 (The `8000` is the _port_. If you'd want to run multiple web servers on the same machine, each would need to use a different port.)

    To stop the server again, switch back to the terminal and press `Ctrl-C` on your keyboard.

Check out the contents of the generated folder. It's a bare-bones Mastro project, but now:

- with a `deno.json` file, which specifies the Mastro version to use, and what happens if you type `deno task start` or `deno task generate`,
- the `deno.lock` file, which remembers exactly which version of each package was used, and
- the file in the `routes/` folder is now called `index.server.ts` instead of `index.server.js`, because it's [TypeScript](https://www.typescriptlang.org/) – JavaScript with potential type annotations. This allows `deno check` to find certain problems in your code even without running it.

To edit the files in the `test-server` folder, you'll want to [install Visual Studio Code](https://code.visualstudio.com/) on your computer.


## An HTML form

Clicking a link on a web page causes the browser to make a HTTP `GET` request to the URL specified in the link's `src` attribute and render the response. But did you know there was another way to do that? It's actually the default behaviour of HTML forms. Try it:

```ts title=routes/index.server.ts ins={9-12}
import { html, htmlToResponse } from "mastro";

export const GET = () =>
  htmlToResponse(
    html`
      <!doctype html>
      <title>test-server</title>

      <form action="https://www.google.com/search">
        <input name="q">
        <button>Search</button>
      </form>
    `
  );
```

A `<button>` placed inside a `<form>` element will submit the form when clicked (to override that default, you'd have to write `<button type="button">`.

When you enter `hello world` in the text input and submit the form, the browser will make a `GET` request to `https://www.google.com/search?q=hello+world` and navigate there. The part of the URL after the `?` contains the _query parameters_ (see image above). In our case, we have only one parameter, named `q`, with a value of `hello world` (note that certain characters like spaces need to be encoded in the URL).

Putting all the form's `input` values as query parameters in the URL of a `GET` request is one way to submit it. However, it's not very private (URLs are often recorded in server logs and are easily copy-pasted), and there are limits to how long a URL can be. That's why forms support a second method: submitting with an HTTP `POST` request, where the inputs are transmitted as part of the request body.

Let's also change the `action` attribute of the form, so that it submits to the URL we're already on, instead of Google. That way, our server can handle the submission with a second function that we export from the same routes file – this time called `POST`.

```ts title=routes/index.server.ts
import { html, htmlToResponse } from "mastro";

export const GET = () =>
  htmlToResponse(
    html`
      <!doctype html>
      <title>Guestbook</title>

      <form method="POST" action=".">
        <label>
          Your name
          <input name="name">
        </label>
        <p>
          <button>Sign Guestbook</button>
        </p>
      </form>
    `
  );

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  return htmlToResponse(
    html`
      <!doctype html>
      <title>Thanks!</title>

      <p>Hey ${name}</p>
      <p>Thanks for signing!</p>
    `
  );
}
```

Note the [label](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/label) element, which tells the user what they're expected to enter in the `input` field. It's important (e.g. for visually impaired users) that you use a proper `label`, and not just display some text somewhere, which e.g. screen readers are not able to associate with the `input`. To test whether it's correct, click the label: the text field should then receive focus.

To let TypeScript know that we're expecting the `req` argument to be of type `Request`, we write `req: Request` (which would not be valid in JavaScript). That way, TypeScript can help us check whether we're using `req` in a correct way. (Try writing e.g. `req.form()` instead of `req.formData()` and VS Code will underline it red.)

Try it out in your browser! If you open the network tab of your developer tools and then submit the form, you will see the `POST` request. Clicking on it reveals a trove of information about the HTTP request and response.

Of course, usually you'd want to not just display the submitted text, but perhaps send it as an email, or save it to a database.


## A mock database

Installing a real database, like PostgreSQL, is out of scope for this guide. However, we can quickly add a mock database: simply storing guestbook entries in a variable on our server. Thus beware, every time you restart the server, all data will be lost!

```ts title=routes/index.server.ts ins={3-4,11-15,31-43}
import { html, htmlToResponse } from "mastro";

const guestbook = ["Peter"];

export const GET = () =>
  htmlToResponse(
    html`
      <!doctype html>
      <title>Guestbook</title>

      <h1>Guestbook</h1>
      <ul>
        ${guestbook.map((entry) => html`<li>${entry}</li>`)}
      </ul>

      <form method="POST" action=".">
        <label>
          Your name
          <input name="name">
        </label>
        <p>
          <button>Sign Guestbook</button>
        </p>
      </form>
    `
  );

export const POST = async (req: Request) => {
  const formData = await req.formData();
  const name = formData.get("name")?.toString();
  if (name) {
    guestbook.push(name);
    return Response.redirect(req.url);
  } else {
    return htmlToResponse(
      html`
        <!doctype html>
        <title>Guestbook</title>
        <p>Please enter a name!</p>
        <p><a href=".">← Try again</a></p>
      `
    );
  }
};
```

If our server receives a `name`, we redirect the user back to the `GET` version of the page. You can see in the network tab of your browser's dev tools how it first does a `POST`, which returns a `302` redirect with a `Location` response header. Then the browser does a separate `GET` request to the URL that was indicated in the `Location`.

If our server does not receive a `name`, we display an error page. Note that modern browsers support [`<input required>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Attributes/required) for more immediate feedback. But we can never trust the client to do input validation. A user might have an outdated browser that ignores the `required` attribute, or they could just write a few lines of code to manually send us an HTTP request with invalid data. Thus we must always validate incoming data on the server before using it (e.g. before saving it to a database). For simple data, a few if/else statements usually suffice, while for complex JSON data, this is usually done with a [schema library](https://standardschema.dev#what-schema-libraries-implement-the-spec).

Note that both `Response.redirect` and `htmlToResponse` create a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. In fact, `htmlToResponse(body)` is little more than:

```ts
new Response(body, { headers: { "Content-Type": "text/html" } })
```


## Client-side fetching a REST API

As you've just seen, plain old HTML forms can get you a long way – all without requiring any fragile client-side JavaScript. However, if you really need to avoid that page reload, here's how.

We start with the [initial reactive to-do list app](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) and move the script to its own file: `routes/todo-list.client.ts`. This time, instead of saving the to-dos in `localStorage`, we want to save them to a (mock) database on the server. To make HTTP requests to the server without doing a full page reload, we use the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) function.

It's a handful of files, so best if you check them out [on GitHub](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server), or [download the mastro repo as a zip](https://github.com/mastrojs/mastro/archive/refs/heads/main.zip) and open the `examples/todo-list-server/` folder in VS Code.

The folder structure looks as follows:

- 📂 `models/`
  - `todo.ts` – the mock database
- 📂 `routes/`
  - 📂 `todo/`
    - `[id].server.ts` – API route for a single todo
    - `index.server.ts` – API route for the whole collection
  - `index.server.ts` – HTML page
  - `todo-list.client.ts` – client-side JavaScript
- `deno.json`

An API (Application Programming Interface), is an interface exposed by one program (in our case the server), intended for another program (in our case our JavaScript client). While a website sends HTML over HTTP, a web API usually sends [JSON](https://developer.mozilla.org/en-US/docs/Glossary/JSON) over HTTP.

It's a common need to expose the same basic operations over an API. Usually you want to let the client create, read, update and delete things in the server's database. These operations are known by their initials as CRUD. They map pretty well to the following HTTP methods:

- **C**reate: `POST /todo` to have the server create a new todo and assign it an id, or `PUT /todo/7` if the client comes up with the id (this will replace the todo with id=7 if it already exists).
- **R**ead: `GET /todo` (to get all todos), or `GET /todo/7` to get only the todo with id=7.
- **U**pdate: `PATCH /todo/7` to update some fields of the todo with id=7.
- **D**elete: `DELETE /todo/7` to delete the todo with id=7.

These are not only conventions that everybody who knows HTTP will be familiar with. There is also the added benefit that clients, the server, as well as proxies (servers that sit in-between the two), know these HTTP methods and their semantics. For example, results to a `GET` request can be cached in the browser, or in a proxy like a CDN. If the cache is still fresh, no need to bother the origin server. However, for the other methods mentiond above, this wouldn't work: updates and deletions need to reach the origin server, otherwise they didn't really happen.

Similarly, all methods except `POST` are [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent) – doing a request once must have the same effect as doing the same request several times. Meaning, if the client is not sure whether the request reached the server (perhaps the network connection is bad and the request timed out), then the client can safely retry the same request. If both requests happen to reach the server, as long as they are idempotent, no harm is done (e.g. the second `PUT /todo/7` overwrites the first one). However, with a non-idempotent request like `POST /todo`, if both the original and retry reach the server, two todos are created instead of one. Crucially, it's the server's responsibility to make sure the exposed API actually adheres to these semantics defined by HTTP.

While not the [full definition of REST](https://mb21.github.io/api-explorer/a-web-based-tool-to-semi-automatically-import-data-from-generic-rest-apis.html#rest), an HTTP API that works according to these principles is often called a REST API. There are a few more [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), but the ones mentioned above are by far the most common ones. Also, there is nothing restricting REST APIs to CRUD operations. A route can in principle expose any kind of operation. One example of a complex operation exposed over HTTP that we've seen before is `GET https://www.google.com/search?q=hello`.

In our sample todo app, we load the existing todos not through the REST API, but embed them in the initial HTML. Fetching them with JavaScript in a separate HTTP request, after the initial HTML page is loaded, would be much slower (but yes, if you see a loading spinner on a website, that's what they're doing). This also means that there was no need to create a `GET` API route to fetch all todos. But you can still create it! If your product had a separate iOS or Android app, that app might need that API. If it works, you should see the todos as JSON in your browser under http://localhost:8000/todo. (Be sure to add some todos after the server is restarted.)

In our todo app, we optimistically update the GUI before we know whether the update reached the server. This provides for a snappy user experience. However, if the request fails, we roll back the GUI to the state before. To see that behaviour in action, load the page in your browser, then in the terminal stop your server with `Ctrl-C`, then submit a new todo in the browser. You should see the GUI quickly flashing back to the original state. However, currently we don't display any error message, which is not optimal.

This highlights a common pitfall when developing richt client-side apps (usually SPAs): loading states (e.g. to display a loading spinner), error handling and timeouts need to be explicitly handled in your JavaScript. This gives you more control, but also more ways to screw up. On the other hand, the browser gives you all of this for free when you develop a multi-page app (even with forms) – through a GUI which that browser's users will be familiar with.
