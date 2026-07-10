import { html } from "@mastrojs/mastro";

export const Newsletter = () =>
  html`
    <br>
    <div class="tip text-center">
      <h2>Stay updated 👨‍🍳</h2>
      <p>
        Follow us on <a href="https://bsky.app/profile/mastrojs.bsky.social"><strong>Bluesky</strong></a>,
        or add our <a href="/blog/"><strong>blog</strong></a> to your RSS reader
        (<a href="/feed.xml">feed link</a>).
      </p>
    </div>
  `;
