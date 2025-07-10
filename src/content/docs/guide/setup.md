---
title: "Setup: GitHub and VS Code for Web"
template: splash
---

At the moment, some parts of this guide will unfortunately only work in the Chrome browser, so I recommend continuing in that browser for the purpose of this guide. (Some parts might work on a tablet, but you would definitely want a keyboard attached.)


## Create a new GitHub repository

To make your website accessible to the whole internet, you'll need to store and publish it somewhere. We'll be using _GitHub Pages_ for that. If you want, you can buy and [configure a custom domain](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site) later. But by default, GitHub will publish your website for free under:

    https://your-user-name.github.io/your-repository-name/

[Create a free GitHub account](https://github.com/signup). Choose your username wisely, because it will show up in lots of places. Ideally, something relatively short that's still available.

Once you are signed into GitHub, [create a new repository](https://github.com/new). A repository is where you will store your project's files. The only field you need to change is the _Repository name_: call it something short and descriptive like `blog`, or `cooking-website`, or even the domain name of your future website (like `cooking.com`) if you have reserved one already. Then click _Create repository_.


## Visual Studio Code for the Web

Now that you're on your repository's page on GitHub:

1. press the `.` key on your computer's keyboard to open the _Visual Studio Code for the Web_ editor. Alternatively, you can go to `https://github.dev/your-user-name/your-repository-name/` (this is the same address you're already on, but instead of `github.com`, it uses `github.dev`).
2. When prompted about signing in using GitHub, click the _Allow_ button.
3. Finally, you may have to hit `enter` to select your GitHub user.

## Mastro

We'll use the _Mastro_ static site generator (SSG). Mastro is special in that it can also run as a VS Code extension in your browser. That way you don't have to install a runtime like Node.js or Deno on your computer, and you don't have to mess around with the terminal and command line.

Install the following two VS Code extensions:

- [Mastro](https://marketplace.visualstudio.com/items?itemName=mastro.mastro-vscode-extension), and
- [FAST Tagged Template Literals](https://marketplace.visualstudio.com/items?itemName=ms-fast.fast-tagged-templates) to properly highlight HTML code inside JavaScript templates.

![](../../../assets/vscode-extensions.png)

In the _Activity Bar_ on the left, click on the _Extensions_ icon (looks like four blocks with the top-right one flying away). First, search for `mastro static` (it should be the first search result, the one with the picture of a chef) and click _Install_. Click _Trust Publisher & Install_ when prompted. Then do the same for the `fast-tagged-templates` extension.

Done? Congrats, you're all set up now! You can switch back to the _Explorer_ view (the topmost icon in the activity bar on the left) to finally write some HTML.
