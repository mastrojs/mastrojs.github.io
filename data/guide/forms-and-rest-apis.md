---
title: Forms and REST APIs
---

Now that you have a local server set up, let's see what we can do with it.

## An HTML form

Clicking a link on a web page causes the browser to make a HTTP `GET` request to the URL specified in the link's `src` attribute and render the response. But did you know there was another way to cause the browser to make a `GET` request? It's actually the default behaviour of HTML forms. Try it:

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

Let's also change the `action` attribute of the form, so that it submits to the URL we're already on, instead of Google. That way, our server can handle the submission (see previous chapter to [setup a local server](/guide/setup-mastro-cli-or-server/)). Export a second function from the same routes file, this one called `POST`:

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

Note that both `Response.redirect` and `htmlToResponse` create a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response) object. In fact, [`htmlToResponse(body)`](https://jsr.io/@mastrojs/mastro/doc/~/htmlToResponse) is little more than:

```ts
new Response(body, { headers: { "Content-Type": "text/html" } })
```


## Client-side fetching a REST API

As you've just seen, plain old HTML forms can get you a long way – all without requiring any fragile client-side JavaScript. However, if you really need to avoid that page reload, here's how.

We start with the [initial reactive to-do list app](/guide/interactivity-with-javascript-in-the-browser/#reactive-programming) and move the script to its own file: `routes/todo-list.client.ts`. The `.ts` suffix means it's a TypeScript file, and because it ends in `.client.ts`, Mastro will automatically transform it to JavaScript. This time, instead of saving the to-dos in `localStorage`, we want to save them to a (mock) database on the server. To make HTTP requests to the server without doing a full page reload, we use the [fetch](https://developer.mozilla.org/en-US/docs/Web/API/fetch) function.

It's a handful of files, so best if you check them out [on GitHub](https://github.com/mastrojs/mastro/tree/main/examples/todo-list-server). Or even better: [download the mastro repo as a zip](https://github.com/mastrojs/mastro/archive/refs/heads/main.zip) and open the `examples/todo-list-server/` folder in VS Code. In the terminal, you can `cd mastro/examples/todo-list-server/` and then `deno task start`.

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

While you can expose any kind of operation over HTTP, a common need is to let the client at least create, read, update and delete things in the server's database. These operations are known by their initials as CRUD, and are often mapped to HTTP methods as follows:

- **C**reate: `POST /todo` to have the server create a new todo and assign it an id, or `PUT /todo/7` if the client comes up with the id (this will replace the todo with id=7 if it already exists).
- **R**ead: `GET /todo` (to get all todos), or `GET /todo/7` to get only the todo with id=7.
- **U**pdate: `PATCH /todo/7` to modify the todo with id=7 in some way (for example update some fields, but perhaps not all).
- **D**elete: `DELETE /todo/7` to delete the todo with id=7.

These are not only conventions that everybody who knows HTTP will be familiar with. There is also the added benefit that clients, the server, as well as proxies (servers that sit in-between the two), know these HTTP methods and their semantics.

For example, results to a `GET` request can be cached in the browser, or in a proxy like a CDN. If the cache is still fresh, no need to bother the origin server again. However, for the other methods mentiond above, this wouldn't work: updates and deletions need to reach the origin server, otherwise they didn't really happen.

Similarly, `GET`, `PUT` and `DELETE` are defined by the HTTP specification to be [idempotent](https://developer.mozilla.org/en-US/docs/Glossary/Idempotent): doing the request once should have the same effect on the server as doing the same request multiple times (this is not guaranteed for `POST` and `PATCH`). This means that if the client is not sure whether an idempotent request reached the server (perhaps the network connection is bad and the request timed out), then the client can safely retry the same request. If both requests happen to reach the server, no harm is done (e.g. the second `PUT /todo/7` simply overwrites the first one). However, with a non-idempotent request like `POST /todo`, if both the original and retry reach the server, two todos are created instead of one. While the HTTP specification only talks about the effect on the server that the client _intended_, in practice it falls to the server to make sure the routes it exposes actually adhere to these semantics.

While not the [full definition of REST](https://mb21.github.io/api-explorer/a-web-based-tool-to-semi-automatically-import-data-from-generic-rest-apis.html#rest), an HTTP API that works according to these principles is often called a REST API. There are a few more [HTTP request methods](https://developer.mozilla.org/en-US/docs/Web/HTTP/Reference/Methods), but the ones mentioned above are by far the most common ones. Also, a REST API can in principle expose any kind of operation. One example of a complex operation exposed over HTTP that we've seen before is `GET google.com/search?q=hello`. Or you might have a route that retrieves the newest item of an inbox, and at the same time also deletes it. Since that operation is not idempotent, you certainly cannot use `GET` for it, but for example `POST /inbox/pop` would work.

In our sample todo app, we load the existing todos not through the REST API, but embed them in the initial HTML. Fetching them with JavaScript in a separate HTTP request, after the initial HTML page is loaded, would be much slower (but yes, if you see a loading spinner on a website, that's what they're doing). This also means that there was no need to create a `GET` API route to fetch all todos. But you can still create it! If your product had a separate iOS or Android app, that app might need that API. If it works, you should see the todos as JSON in your browser under http://localhost:8000/todo. (Be sure to add some todos after the server is restarted.)

In our todo app, we optimistically update the GUI before we know whether the update reached the server. This provides for a snappy user experience. However, if the request fails, we roll back the GUI to the state before. To see that behaviour in action, load the page in your browser, then in the terminal stop your server with `Ctrl-C`, then submit a new todo in the browser. You should see the GUI quickly flashing back to the original state. However, currently we don't display any error message, which is not optimal.

This highlights a common pitfall when developing rich client-side apps (usually [SPAs](/guide/client-side-vs-server-side-javascript-static-vs-ondemand-spa-vs-mpa/#spa-vs-mpa)): loading states (e.g. to display a loading spinner), error handling and timeouts need to be explicitly handled in your JavaScript. This gives you more control, but also more ways to screw up. On the other hand, the browser gives you all of this for free when you develop a multi-page app (even with forms) – through a GUI which that browser's users will be familiar with.
