---
title: "Install Mastro on the command line"
---

In the previous chapter, you learned how loading a web page into the browser (also known as the client) involves making a request to a server over the HTTP protocol. The server then sends back a HTTP response containing the HTML.

In this chapter, we'll install Mastro as a development server on your laptop using the command line. This setup can be used to later deploy a statically generated site (like we've done so far with the VS Code extension), as well as using Mastro as a server web framework doing on-demand server-side rendering.

Running a server means that the HTML is generated on every request by the server, instead of beforehand as when you generate a static site. This comes at the cost of running a server, but enables you to send different pages to different users. When paired with a database like PostgreSQL (and perhaps a query builder like [Kysely](https://kysely.dev/)), Mastro can even serve as a full-stack framework.


## Different ways to run Mastro

Here's a table listing the various ways you can run Mastro. Either locally (meaning on your laptop or desktop), or on a production system in some data center, to host your live website. And either using _VS Code for Web_ in your browser, or by installing things and using the command line.

|                 | Local development                                                               | Prod static site                                                                              | Prod server                                                                |
|-----------------|---------------------------------------------------------------------------------|-----------------------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| VS Code for Web | [Setup in-browser](/guide/setup/)                                               | [Publish static site](/guide/publish-website/)                                                | -                                                                          |
| Command line    | [Setup local server](/guide/cli-install/#setup-local-development-server) | [Deploy static site via CI/CD](/guide/cli-deploy-production/#deploy-static-site-with-ci%2Fcd) | [Deploy server](/guide/cli-deploy-production/#deploy-server-to-production) |

## Setup local development server

To preview your website in a browser, while you work on it, start a local development server.

1.  [Open a terminal application](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#how_do_you_access_the_terminal) on your computer, which will provide you with a command-line interface (CLI). On macOS, the pre-installed terminal app can be found under `/Applications/Utilities/Terminal`. On Windows, you can try PowerShell, or for additional compatibility [use WSL](https://learn.microsoft.com/en-us/windows/wsl/).

2.  [Install Deno](https://docs.deno.com/runtime/getting_started/installation/) – a JavaScript runtime without a web browser, similar to Node.js. The easiest way is by copy-pasting the following into your terminal:

    ```sh
    curl -fsSL https://deno.land/install.sh | sh
    ```

    and hit enter.

3.  [Navigate to the folder](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#navigation_on_the_command_line) where you want to create your new project folder in, for example type:

    ```sh
    cd Desktop
    ```

    and hit enter.

4.  Then type (or copy-paste):

    ```sh
    deno run -A jsr:@mastrojs/mastro@0.3.2/init
    ```

    and hit enter. This Mastro initalization script will ask you for a folder name for your new server project. Enter for example `test-server` and hit enter (folder names with spaces are a bit of a pain on the command-line).

5.  Then it will tell you to `cd test-server`, and from there you can enter:

    ```sh
    deno task start
    ```

    This will start your server! You can see the dummy page it's serving by opening the following URL in your web browser: [http://localhost:8000](http://localhost:8000) (The `8000` is the _port_. If you'd want to run multiple web servers on the same machine, each would need to use a different port.)

    To stop the server again, switch back to the terminal and press `Ctrl-C` on your keyboard.

To edit the files in the newly created folder, you'll want to [install Visual Studio Code](https://code.visualstudio.com/) on your computer (or a similar code editor) and open the newly created project folder in it.

Check out the contents of the generated folder. It's a bare-bones Mastro project, but now:

- with a `deno.json` file, which specifies the Mastro version to use, and what happens if you type `deno task start` or `deno task generate`,
- the `deno.lock` file, which remembers exactly which version of each package was used,
- the `server.ts` file, which is executed to start up the server (here you might add customizations like middleware), and
- the file in the `routes/` folder is now called `index.server.ts` instead of `index.server.js`, because it's [TypeScript](https://www.typescriptlang.org/) – JavaScript with type annotations. This allows `deno check` to find certain problems in your code even without running it.

Congrats, you're all set now to work locally on your project.

:::tip
## Version control with Git

Just changing your project's files on your computer will not change them on GitHub. To commit and push your changes, you can either:

- continue to use the [_Source Control_ view](/guide/publish-website/#save-changes-and-publish-to-the-web) built into VS Code,
- install a GUI like [GitHub Desktop](https://github.com/apps/desktop) or [Git Up](https://gitup.co/), or
- use `git` on the command line, see e.g. this [cheat sheet](https://git-scm.com/cheat-sheet).

Either way, in the long run it pays off to make the [right mental model for Git](https://mb21.github.io/blog/2023/12/13/right-mental-model-for-git.html).
:::
