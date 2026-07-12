# Hotelway Studios — Project Handoff

Complete context for continuing this project in a fresh conversation.
Last updated: July 10, 2026.

## Who / what this is

Rachel is building **Hotelway Studios**, a
faceless, POV-driven hospitality content studio based in NYC. The studio
sells cinematic photo + short-form vertical video (Reels/TikTok) to hotels,
boutique properties, and Airbnbs — guest-experience storytelling with no
faces, no talking, no voiceover.

Constraints: she works a 70+ hr/week day job and can shoot roughly one
weekend per month. Goal: build a credible portfolio, then pitch hotels for
comped stays and paid collaborations. Stated pitch target was "Hyatt Place
Tallinn, March 2026" — that date passed, so the working assumption is
**March 2027** (unconfirmed; re-anchor the pitch timeline when she confirms).

Studio contact: **hotelwaystudios@gmail.com** · Instagram **@hotelwaystudios**.
Availability line **"Now booking — autumn 2026"** was removed from the
studio footer (her ask, July 10 2026) but still appears on the cover-page
corner, the contact-section lede, and the "Inquire for Autumn '26" split-panel
button — re-anchor or remove those when she says so.

## Repo layout (this folder is a git repo, ~15 commits)

| File | What it is |
|---|---|
| `index.html` | Entrance/cover page: auto-drifting 3D coverflow deck (timer-driven, NOT rAF — see gotchas), touch/mouse drag scrubbing, early-access email capture, links into the studio |
| `studio.html` | Main site: hero → video band → ethos quote → work grid (+ VIEW MORE → portfolio.html) → In Motion (phone-framed reel) → visual direction → services → why POV → dark "Beyond the room" split panel → process → packages → FAQ → about → contact → footer |
| `portfolio.html` | Branch portfolio page ("Slow Living. One Photo At A Time.") — series sections rendered from media.js, ends with "Continuously building." + back-to-studio/contact buttons |
| `assets/media.js` | **THE media manifest** — every photo/video slot on the site (cover deck, work grid, reel, hero band, portfolio series) is defined here; the pages render from it. To change imagery, edit only this file. Supports `video: true` entries everywhere |
| `admin.html` | Her local media board: previews every media.js slot with filenames + how-to-edit instructions. In git but **excluded from deploys** via `.vercelignore` |
| `.vercelignore` | Keeps `admin.html`, `*.md` (incl. this file), and `tools/` out of the public deployment |
| `inquire.html` | Standalone inquiry form (name / email / optional phone / message) with an on-page "Sent — thank you" state |
| `PLAYBOOK.md` | Content strategy: 9-beat "complete stay" shot-list arc, 3-weekend portfolio plan, three reel templates with beat timing, credibility do/don't, hotel pitch email skeleton + timeline |
| `DEPLOY.md` | Launch instructions (Netlify Drop fast path + GitHub/Vercel), Formspree form setup, Gmail auto-label + auto-reply recipe |
| `tools/make_teaser.py` | Python generator for the original 3s illustrated teaser video (PIL + imageio; venv needed) |
| `assets/` | All imagery; see licensing below |
| `.claude/launch.json` (in parent `content/` folder) | Static preview server config (python http.server, autoPort) |

## Design system

**Palette — "Limonaia" (her explicit pick, Italian-garden brief):**
- Ivory `#FBF7EB` (page bg, `--linen`)
- Parchment `#F2EBD5` (`--linen-deep`, alt sections)
- Cream `#FFFDF4` (`--cream`)
- Stone `#B5AC8B` / soft stone `#DCD3B4`
- Foliage green `#5A6B4D` (favicon field; deep accents) + leaf `#AEBB8B`, leaf-soft `#E0E4C8` (direction section bg)
- Lemon `#EAD98C`
- **Sun gold `#B98A2F` = the single accent** (`--gold`): button hovers, tags, numerals, FAQ marks
- Ink `#2C2F26` (green-black)

**Type:** Cormorant Garamond (serif, headlines/wordmark) + Inter 300/400
(sans, body/labels). Letterspaced uppercase eyebrows. Quiet-luxury spacing.

**Voice:** experience-first, modeled on L'Aube hotel branding. The ethos
line is *"A guest never remembers the room. They remember how it felt to be
in it."* Headline italics are plain ink — do NOT add color highlights to
headings (her explicit note). Copy sells feeling, not features: "travelers
don't book square footage — they book a feeling."

**Brand rules:** no faces anywhere (site imagery included), no influencer
tone, no fake client claims. Early work is labeled honestly as a mix of
studio-shot location work + licensed reference frames.

## Imagery & licensing (assets/)

- `own-IMG_*.jpg` — **Rachel's own photos**, and as of July 10, 2026 the
  site imagery is **100% hers**. First batch (from HEIC via `sips`): 1637
  plaster lounge, 1678 pergola sea desk, 1679 stone villa pool (has small
  figures), 1680 stone window sunset, 1681 ochre table + sea. Second batch
  (from raw `IMG_*.JPG` drops via PIL `exif_transpose` — **always bake EXIF
  rotation**, iPhone files carry orientation flags): 0556 old-town lane
  archways, 4432 cliff cove, 4435 golden-hour patio, 4544 bougainvillea dusk,
  4831 harbor sunset, 5019 POV dinner (hands visible, no faces — on-brand),
  9404 restaurant bay window. Raw `*.JPG`/`*.jpeg` are gitignored; web
  versions are 1350×1800 q74.
- `own-reel.mp4` — **her footage**: 3 clips stitched (taverna arrival →
  Santorini sunset path → sea view), ~8s 1080×1920 vertical; plays in the
  In Motion phone frame. **Gotcha:** iPhone MOVs store a landscape sensor
  buffer plus a ±90° displaymatrix rotation flag. An earlier stitch copied
  that flag onto the already-upright output, so browsers spun the reel
  sideways — fixed July 10, 2026 by stripping the flag losslessly
  (`ffmpeg -display_rotation 0 -i in.mp4 -c copy out.mp4`). When
  re-stitching from raw MOVs, always check the output with
  `ffmpeg -i file 2>&1 | grep -i rotation` — it should report none.
- `band-waves.mp4` — **her footage**: Aegean waves loop, hero band video.
- Raw originals (`*.heic`, `*.MOV`) stay on disk but are **gitignored**.
- Old Unsplash interim frames (`work-*.jpg`, `deck-room.jpg`,
  `split-sunset.jpg`) are **deleted from the repo** (July 12, 2026).
- **Asset protection (July 12, 2026):** all deployed images are re-encoded
  with zero EXIF (no device/GPS/date), capped at 1200px, q70, with a baked
  "© HOTELWAY STUDIOS" corner watermark; both videos are re-encoded with
  the same watermark and `-map_metadata -1`. `assets/protect.js` (loaded by
  all three public pages) blocks right-click save / drag-out / long-press.
  Honest scope: screenshots and the network tab can't be stopped — the
  watermark + web resolution are the real protection. Full-res clean
  originals live only on her machine (raws gitignored; pre-watermark web
  versions in the session scratchpad backup). Re-generate via PIL/ffmpeg
  when adding new photos — never deploy an image without this pass.
- **Gotcha:** when deleting assets, grep both pages for dangling references
  first — a July 10 commit once left six broken `<img>`s behind. With
  media.js this is now a single-file check (admin.html shows any misses).

## Functionality status (all verified in browser)

- Cover deck drifts, drag-scrubs (pointer events), pauses on hover,
  suppresses accidental clicks after drags, respects reduced motion.
- All in-page nav uses a smooth-scroll + verify-arrival fallback (some
  embedded viewers freeze smooth scrolling); hash-on-load links work.
- Scroll reveals use a position-sweep (IntersectionObserver was unreliable).
- Lightbox on work tiles (click to expand, Esc/click closes).
- Videos: autoplay muted loop playsinline + JS play() nudge.
- Forms: cover JOIN + inquire.html POST to **Formspree — form IDs are still
  placeholders** (`YOUR_JOIN_FORM_ID` / `YOUR_INQUIRY_FORM_ID` in the two
  files); until set, they gracefully fall back to pre-filled mailto. Setup
  steps in DEPLOY.md.
- Favicon (foliage arch) + OG tags on all pages; og:image is a TODO pending
  a real domain.

## Outstanding — only account-gated items (she must do these)

1. ~~**Launch**~~ **DONE (July 10, 2026)**: live at
   **https://hotelway-studios.vercel.app** — GitHub `ranch6/hotelway-studios`
   + Vercel push-to-publish; pushing `main` deploys production automatically
   (SSH auth works on her machine).
2. **Formspree**: create 2 free forms, paste IDs into index.html + inquire.html.
3. **Gmail**: filters to auto-label Formspree mail + template auto-reply
   (recipe in DEPLOY.md).
4. Later: custom domain (~$12/yr) → fixes gmail-address optics, enables
   og:image, professional email.

## Working preferences (learned)

- Execute with creative direction; don't ask permission for reversible work.
  Use AskUserQuestion only for genuine taste decisions (she picked Limonaia
  from 4 mocked-up palettes).
- She pastes screenshots as references — chat images can't be extracted;
  find closest free matches or ask her to drop files into `assets/`
  (she now does this: HEIC/MOV drops).
- Be honest on-site about interim/licensed imagery; she accepted that framing.
- No color highlights on headlines. Quiet > loud, always.
- Verify in the preview browser before claiming done; the embedded preview
  freezes rAF/smooth-scroll/video-playback — code defensively (timers,
  arrival checks, play() nudges) and don't mistake those env quirks for bugs.

## Local dev

Serve statically from the parent folder config: preview runs
`python3 -m http.server ${PORT:-4173} --directory hotelway-studios`.
Python venv with pillow/imageio/imageio-ffmpeg lives in the session
scratchpad (rebuild with `python3 -m venv venv && pip install pillow
imageio imageio-ffmpeg` if needed; ffmpeg binary comes from imageio-ffmpeg).

## Related

- `../harmony-tool/` — her local browser toolkit (video trim/grade/captions/
  crops via MediaRecorder). Editing pipeline for real reels.
- Persistent agent memory also tracks this project
  (`hotelway-studios-project` in the auto-memory directory).
