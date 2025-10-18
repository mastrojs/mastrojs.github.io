import { html } from "@mastrojs/mastro";

export const Newsletter = () =>
  html`
    <br>
    <div class="tip">
      <h2>Stay in touch</h2>

      <p>
        Want to know about new major versions of Mastro, or new chapters of the
        <a href="/guide/">guide</a>? Follow us on
        <a href="https://bsky.app/profile/mastrojs.bsky.social">Bluesky</a>,
        or subscribe to our <a href="/feed.xml">Atom feed</a> or newsletter:
      </p>

      <form
        method="POST"
        action="https://c2ecc26e.sibforms.com/serve/MUIFAD_vtneGYJG8_MLAfsUhwF_2RQmd6y4Rj3eascwtZpK6CVk43q-j6SzQCPtkHUgqSqT_8RdwLmW9yztUMNOCBGtctsVIyJHpDj-ILKLT2nZLFBZdi29kdPggNR_vAZa_TE_V9RTM2v2IECorWtcOgVQ_7c3nH1bob8aAnkFMpYAqdK9kUwZmMIMtuZ0EG8nPzvlPcidVGEzU"
      >
        <label>
          Email
          <input type="email" id="EMAIL" name="EMAIL" required>
        </label>
        <p><button class="-secondary">Get notified</button></p>
      </form>
    </div>
  `;
