---
title: "Setup: GitHub, VS Code and Mastro"
---

There are various [ways to run Mastro](/guide/cli-install/#different-ways-to-run-mastro), which is a general-purpose web framework and static site generator. By far the easiest way is with the Mastro _Visual Studio Code for the Web_ extension, which lets you run Mastro as a static site generator right in your browser. No need to install anything or learn how to use the command line.

:::tip
## Alternative option: command line

If you're already comfortable with the command line and prefer a local installation over _VS Code for the Web_, you can [setup Mastro on the command line](/#powerful-for-experienced-developers).

Once you've done that, you can jump to the [next chapter](/guide/html/).
:::

Since all the processing happens upfront, and the generated files are served from a CDN close to your users, a static site is extremely fast and secure.
We'll be using GitHub Pages, which hosts your static site for free.


## Create a new _GitHub_ repository

If you want, you can buy and [configure a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) later. But by default, GitHub Pages will publish your website for free under:

    https://your-user-name.github.io/your-repository-name/

1. [Create a free GitHub account](https://github.com/signup). Choose your username wisely, because it will show up in lots of places. Ideally, something relatively short that's still available.

2.  Create a new GitHub repository to store your project's files:

    - Open Mastro's [basic template repository](https://github.com/mastrojs/template-basic).
    - In the upper right, click the green button **Use this template**, and from the dropdown select **Create a new repository**.
    - Choose a repository name (something short and descriptive like `blog`, or `cooking-website`, or even the domain name of your future website), and click **Create repository**. (To deploy to GitHub Pages for free, your repo needs to be public.)


## Open _Visual Studio Code for the Web_

Now that you're on your repository's page on GitHub:

1. press the `.` key on your computer's keyboard to open the _Visual Studio Code for the Web_ editor. Alternatively, you can go to `https://github.dev/your-user-name/your-repository-name/` (this is the same address you're already on, but instead of `github.com`, it uses `github.dev`).
2. When prompted about signing in using GitHub, click the _Allow_ button.
3. To select your GitHub user, press `enter` in the small dialog that opens.

<details>
  <summary>Using Firefox?</summary>

  If you've selected "Strict" in the "Enhanced Tracking Protection" preferences, you need to temporarily disable it, in order to connect VS Code with GitHub the first time around.
</details>

See also [VS Code for the Web's browser support](https://code.visualstudio.com/docs/setup/vscode-web#_browser-support).

## Install the _Mastro_ extension

1. Click **Install** in the small dialog in the bottom right that says "Do you want to install the recommended extensions from mastro and FAST for this repository?"
2. Click **Trust Publishers & Install**
3. Close the two tabs of the just installed extensions ([Mastro](https://marketplace.visualstudio.com/items?itemName=mastro.mastro-vscode-extension) and [FAST Tagged Template Literals](https://marketplace.visualstudio.com/items?itemName=ms-fast.fast-tagged-templates)).

![](/assets/vscode-extensions.png)

Done? Congrats, you're all set up now! You can switch back to the _Explorer_ view by clicking the topmost icon ⧉ in the activity bar on the left. Now you should see your files and folders again. Next up, finally write some HTML!
