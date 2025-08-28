---
title: "Setup Mastro as a server"
---

In the previous chapter, you learned how loading a web page into the browser (also known as the client) involves making a request to a server over the HTTP protocol. The server then sends back a HTTP response containing the HTML.

In this chapter, you'll be using Mastro as a server web framework instead of as a [static site generator](/guide/why-html-css/#you-want-to-build-a-website%3F). This means that the HTML is generated on every request by the server, instead of beforehand when you generate the site. This comes at the cost of running a server, but enables you to send different pages to different users. When paired with a database like PostgreSQL (and perhaps a query builder like [Kysely](https://kysely.dev/)), Mastro can even serve as a full-stack framework.

Finally, you can also use the Mastro server on the command-line as a local development server, to preview your static site in a real browser instead of the [preview pane inside VS Code](/guide/setup/).


## Setup a local server

Start your own server and run it locally. _Local_ means on your laptop (or desktop), as opposed to in some data center:

1.  [Open a terminal application](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#how_do_you_access_the_terminal) on your computer, which will provide you with a command-line interface (CLI). On macOS, the pre-installed terminal app can be found under `/Applications/Utilities/Terminal`. On Windows, you need to [install WSL](https://learn.microsoft.com/en-us/windows/wsl/) first.

2.  [Install Deno](https://docs.deno.com/runtime/getting_started/installation/) – a JavaScript runtime without a web browser, similar to Node.js. The easiest way is by copy-pasting the following into your terminal:

        curl -fsSL https://deno.land/install.sh | sh

    and hit enter.

3.  [Navigate to the folder](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#navigation_on_the_command_line) where you want to create your new project folder in, for example type:

        cd Desktop

    and hit enter.

4.  Then type (or copy-paste):

        deno run -A jsr:@mastrojs/mastro@0.1.3/init

    and hit enter. This Mastro initalization script will ask you for a folder name for your new server project. Enter for example `test-server` and hit enter (folder names with spaces are a bit of a pain on the command-line).

5.  Then it will tell you to `cd test-server`, and from there you can enter:

        deno task start

    This will start your server! You can see the dummy page it's serving by opening the following URL in your web browser: [http://localhost:8000](http://localhost:8000) (The `8000` is the _port_. If you'd want to run multiple web servers on the same machine, each would need to use a different port.)

    To stop the server again, switch back to the terminal and press `Ctrl-C` on your keyboard.

Check out the contents of the generated folder. It's a bare-bones Mastro project, but now:

- with a `deno.json` file, which specifies the Mastro version to use, and what happens if you type `deno task start` or `deno task generate`,
- the `deno.lock` file, which remembers exactly which version of each package was used, and
- the file in the `routes/` folder is now called `index.server.ts` instead of `index.server.js`, because it's [TypeScript](https://www.typescriptlang.org/) – JavaScript with potential type annotations. This allows `deno check` to find certain problems in your code even without running it.

To edit the files in the newly created folder, you'll want to [install Visual Studio Code](https://code.visualstudio.com/) on your computer (or a similar code editor) and open that folder in it.


## Deploying the server to production

Since your laptop is not always running and connected to the internet, you need a production server in some data center to deploy your dynamic website to. While GitHub Pages only supports statically generated websites, you can use for example Deno Deploy: see [deploy server to production](https://github.com/mastrojs/mastro#deploy-server-to-production).
