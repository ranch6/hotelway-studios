# Deploying Hotelway Studios

Goal: a **public published site** + a **private working copy only you can
edit** (with Claude). The pattern: private GitHub repo → Vercel auto-deploy.
You edit locally with Claude Code (or on claude.ai/code from anywhere),
commit, push — the live site updates in ~30 seconds.

The repo is already initialized and committed locally. Remaining steps are
one-time account connections that have to happen under your logins:

## 1. Create the private GitHub repo (~2 min)

Option A — in the browser: github.com → New repository → name it
`hotelway-studios`, set **Private**, no README. Then:

```sh
cd /Users/rguan/code/personal/content/hotelway-studios
git remote add origin git@github.com:YOUR_USERNAME/hotelway-studios.git
git push -u origin main
```

Option B — install the GitHub CLI once (`brew install gh`, then `gh auth
login`) and Claude can handle repo creation and pushes for you in future
sessions.

## 2. Connect Vercel (~3 min)

vercel.com → sign in with GitHub → Add New Project → import
`hotelway-studios`. No framework, no build command — it's a static site;
Vercel serves `index.html` as-is. Every push to `main` auto-deploys.

You get a free `hotelway-studios.vercel.app` URL immediately; add a custom
domain later in Vercel → Settings → Domains (buy the domain anywhere,
~$12/yr).

(Netlify works identically if you prefer it. For a no-git quick test,
app.netlify.com/drop lets you drag the folder in — but skip it; the git
flow is what makes the private-edit/public-publish split work.)

## 3. The editing workflow after that

- **Private version:** this folder. Open Claude Code here, ask for changes,
  review in the preview panel.
- **Publish:** `git add -A && git commit -m "..." && git push` (or ask
  Claude to do it).
- **From anywhere:** claude.ai/code can connect to the GitHub repo directly,
  so you can make copy tweaks from a browser without this machine.

## Before first publish — swap the placeholders

- [ ] Contact email (`hello@hotelwaystudios.com` in index.html) → your real
      studio address
- [ ] Instagram link (`instagram.com/hotelwaystudios`) → your real handle
- [ ] Replace work-grid gradient placeholders with real stills as shoots
      happen (each tile: swap `<div class="ph ph-N"></div>` for
      `<img src="assets/....jpg" alt="...">`)
