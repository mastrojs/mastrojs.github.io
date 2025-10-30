import { html } from "@mastrojs/mastro";

export const Newsletter = () =>
  html`
    <br>
    <div class="tip">
      <h2>Stay in touch</h2>

      <ul>
        <li>Follow us on <a href="https://bsky.app/profile/mastrojs.bsky.social"><strong>Bluesky</strong></a>,</li>
        <li>add the <a href="/feed.xml"><strong>feed</strong></a> of our <a href="/blog/"><strong>blog</strong></a> to your RSS reader (we knew you were that kind of person), or</li>
        <li>subscribe to our very infrequently sent out:</li>
      </ul>

      <form
        method="POST"
        action="https://c2ecc26e.sibforms.com/serve/MUIFAD_vtneGYJG8_MLAfsUhwF_2RQmd6y4Rj3eascwtZpK6CVk43q-j6SzQCPtkHUgqSqT_8RdwLmW9yztUMNOCBGtctsVIyJHpDj-ILKLT2nZLFBZdi29kdPggNR_vAZa_TE_V9RTM2v2IECorWtcOgVQ_7c3nH1bob8aAnkFMpYAqdK9kUwZmMIMtuZ0EG8nPzvlPcidVGEzU"
      >
        <label>
          Email newsletter
          <input type="email" id="EMAIL" name="EMAIL" required>
        </label>
        <p><button class="-secondary">Get notified</button></p>
      </form>
    </div>
  `;
