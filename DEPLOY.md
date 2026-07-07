# Deploying Hotelway Studios

## ⚡ Fastest launch (5 min, free forever, free subdomain)

The site is 100% ready to serve — no build step. Two equally good paths:

**Path A — Netlify Drop (2 min, no git):** app.netlify.com → sign up free →
"Deploy manually" → drag the `hotelway-studios` folder in. Live instantly at
`hotelway-studios.netlify.app` (rename the site in Site settings → change
site name). Re-drag the folder to update.

**Path B — Vercel + GitHub (5 min, auto-deploys forever):** the original plan
below — push to a private GitHub repo, import in Vercel, live at
`hotelway-studios.vercel.app`, and every future `git push` updates the site.
Do this one when you want the private-edit → publish workflow.

Either way the domain is free and permanent. (A custom domain like
`hotelway.studio` remains a later, ~$12/yr upgrade — it also fixes the
gmail-address optics and unlocks the OG preview image.)

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

## Forms — Formspree setup (~3 min, free tier: 50 submissions/mo forever)

Both forms (cover-page "Join" line and inquire.html) are wired for Formspree
and fall back to opening a pre-filled email until you add your form IDs.

1. formspree.io → Sign up with hotelwaystudios@gmail.com (free plan).
2. Create two forms in the dashboard: name one `early-access`, one `inquiries`.
   Each gets an ID like `mqkrzabc` (visible in the form's URL/integration tab).
3. Paste the IDs into the code:
   - `index.html` → `const JOIN_ENDPOINT = 'https://formspree.io/f/YOUR_JOIN_FORM_ID'`
   - `inquire.html` → `const INQUIRY_ENDPOINT = 'https://formspree.io/f/YOUR_INQUIRY_FORM_ID'`
4. Submit each form once and click the confirmation email Formspree sends.

Submissions then arrive at hotelwaystudios@gmail.com with the visitor's
address as reply-to, and inquiries are also stored in the Formspree dashboard.

## Gmail — auto-sort inquiries + auto-reply (~5 min, in Gmail settings)

Auto-sort into a folder:
1. Gmail → Settings → Filters → Create new filter.
2. From: `noreply@formspree.io`, Subject: `Hotelway inquiry` → Create filter →
   "Apply label: Inquiries" (create the label) + "Never send to Spam".
3. Repeat with Subject: `early access` → label "Early Access".

Auto-response ("message received, we'll get back to you"):
1. Gmail → Settings → Advanced → enable **Templates**.
2. Compose a reply ("Thank you — your inquiry has reached Hotelway Studios.
   We'll get back to you within two business days."), then ⋮ → Templates →
   Save draft as template.
3. Create another filter on Subject: `Hotelway inquiry` → "Send template".
   Note: Gmail sends the template to the *reply-to* (the visitor), which is
   exactly what you want here.

The site itself already confirms on-screen ("Sent — thank you") the moment
the form goes through, so the auto-reply is a nice-to-have, not load-bearing.

## Before first publish

- [x] Contact email → hotelwaystudios@gmail.com
- [x] Instagram → @hotelwaystudios
- [ ] Replace work-grid gradient placeholders with real stills as shoots
      happen (each tile: swap `<div class="ph ph-N"></div>` for
      `<img src="assets/....jpg" alt="...">`)
