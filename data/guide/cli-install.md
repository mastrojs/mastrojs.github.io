---
title: "Mastro as a server on the command line"
---

With **static site generation (SSG)**, the whole website is generated upfront.
On the other hand, when on-demand rendering or **server-side-rendering (SSR)**, the HTML is generated each time on every request by the server. This comes at the cost of running a server, but enables you to send different pages to different users. When paired with a database like PostgreSQL (and perhaps a query builder like [Kysely](https://kysely.dev/)), Mastro can even serve as a full-stack framework.

In this chapter, you will open a **command line interface** (CLI for short), and install Mastro as a development server on your laptop.


## Different ways to run Mastro

Here's a table listing the various ways you can run Mastro, with links to more infos.

- Either in your **browser** (using _VS Code for Web_), or by using the **command line**.
- And either **locally** (meaning on your laptop) to work on your site, or on a **prod**uction system in some data center (so users can see your live website).

|                     | Locally           | Production static site       | Production server       |
|---------------------|-------------------|------------------------------|-------------------------|
| **In your browser** | [Setup][vsLocal]  | [Publish][vsProd]            | n/a                     |
| **Command line**    | [Setup][cliLocal] | [Publish via CI/CD][cliProd] | [Deploy server][server] |

[try]: https://vscode.dev/github/mastrojs/template-basic
[vsLocal]: /guide/setup/
[cliLocal]: /guide/cli-install/#setup-local-development-server
[vsProd]: /guide/publish-website/
[cliProd]: /docs/deploy/#deploy-static-site
[server]: /docs/deploy/#deploy-server


## Setup local development server

To preview your website in a browser while you work on it, let's start a local development server.

1.  [Open a terminal application](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#how_do_you_access_the_terminal) on your computer, which will provide you with a command-line interface (CLI). [VSCode](https://code.visualstudio.com) has a terminal built in: to open it, select `View` -> `Terminal` in the menu. Alternatively, your OS has a terminal app pre-installed: on macOS under `/Applications/Utilities/Terminal`, on Windows you can use PowerShell, or for additional compatibility with Linux servers [use WSL](https://learn.microsoft.com/en-us/windows/wsl/).

2.  [Install pnpm](https://pnpm.io/installation#using-a-standalone-script) by copy and pasting the following into your terminal:

    ```sh
    curl -fsSL https://get.pnpm.io | sh -
    ```

    then hit enter.

3. Install Node.js with `pnpm runtime set node lts -g`

4.  [Navigate to the folder](https://developer.mozilla.org/en-US/docs/Learn_web_development/Getting_started/Environment_setup/Command_line#navigation_on_the_command_line) where you want to create your new project folder in, e.g. type:

    ```sh
    cd Desktop
    ```

    and hit enter.

5.  Then type (or copy-paste):

    ```sh
    pnpm create @mastrojs/mastro@latest
    ```

    and hit enter. This Mastro initalization script will ask you for a folder name for your new project. Enter for example `mastro-test` and hit enter (we're using a dash, because folder names with spaces are a bit of a pain on the command-line).

6.  Then it will tell you to `cd mastro-test`, and from there you can enter:

    ```sh
    pnpm run start
    ```

    This will start your server! You can see the dummy page it's serving by opening the following URL in your web browser: <a rel="nofollow" href="http://localhost:8000">http://localhost:8000</a> (The `8000` is the _port_. If you'd want to run multiple servers on the same machine, each would need to use a different port.)

    To stop the server again, switch back to the terminal and press `Ctrl-C` on your keyboard.

To edit the files in the newly created folder, you'll want to [install Visual Studio Code](https://code.visualstudio.com/) on your computer (or a similar code editor) and open the newly created project folder in it (`File` -> `Open Folder…` and choose your `mastro-test` folder).

Check out the contents of the generated folder. It's a bare-bones Mastro project, but now with:

- a `package.json` file, which specifies the Mastro version to use, and what script is run if you type `pnpm run start` or `pnpm run generate`,
- the `pnpm-lock.yaml` file, which remembers exactly which version of each package was used,
- the `server.ts` file, which is executed to start up the server (here you might add customizations like middleware), and
- the file in the `routes/` folder is now called `index.server.ts` instead of `index.server.js`, because it's [TypeScript](https://www.typescriptlang.org/) – JavaScript with type annotations. This allows `pnpm run check` to find certain problems in your code even without running it.

Congrats, you're all set now to work locally on your project.

## Deploy to production

But since your laptop is not always running and connected to the internet, if you want other people on the internet to be able to see it, you need a server in some data center to host your production website.

To deploy your website to production (either by statically generating it, or by running a server in production), see the [Mastro deployment docs](/docs/deploy/).

Usually, this involves committing your changes to the Git version control system on your computer, then pushing the commits to the GitHub server, and from there your code will be automatically published to a production web server.

:::tip
## Version control with Git

Just changing your project's files on your computer will not change them on GitHub. To commit and push your changes, you can either:

- continue to use the [_Source Control_ view](/guide/publish-website/#save-changes-and-publish-to-the-web) built into VS Code,
- install a GUI like [GitHub Desktop](https://github.com/apps/desktop) or [Git Up](https://gitup.co/), or
- use `git` on the command line, see e.g. this [cheat sheet](https://git-scm.com/cheat-sheet).

Regardless of which interface for Git you use, in the long run it pays off to learn the [right mental model for Git](https://mb21.github.io/blog/2023/12/13/right-mental-model-for-git.html).
:::

In the next chapter, let's look at some fun things you can do with a server.
