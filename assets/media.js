/* =====================================================================
   HOTELWAY STUDIOS — MEDIA BOARD
   =====================================================================
   This ONE file controls every photo and video on the site.
   You never need to touch the HTML to change imagery.

   TO CHANGE A PHOTO
     1. Drop the new file into the assets/ folder.
     2. Point the matching entry below at the new filename.
     3. Save. Refresh the page. Done.

   TO ADD A VIDEO / REEL ANYWHERE A PHOTO GOES
     Use  video: true  on the entry, e.g.
       { src: "assets/my-reel.mp4", video: true, poster: "assets/still.jpg",
         title: "In Motion", meta: "Arrival · 15s" }
     (poster is optional — it's the frame shown while the video loads)

   PREVIEW EVERYTHING AT ONCE
     Open admin.html locally — it shows every slot on this board.
     (admin.html is never published; see .vercelignore)

   PUBLISH
     Commit + push to GitHub → Vercel deploys automatically.
   ===================================================================== */

window.SITE_MEDIA = {

  /* ── COVER PAGE — the drifting card deck on index.html ──────────────
     Cards appear in this order. Keep 8–12 for a nice drift.
     A { comingSoon: "..." } entry renders as the blank teaser card.   */
  coverDeck: [
    { src: "assets/own-IMG_0556.jpg",  alt: "Old-town lane with archway bridges, looking up" },
    { src: "assets/own-IMG_9404.jpg",  alt: "Restaurant bay window with white linen and wine glasses" },
    { src: "assets/own-IMG_1637.jpg",  alt: "Plastered lounge with beamed ceiling and sun shafts" },
    { src: "assets/own-IMG_4435.jpg",  alt: "Golden-hour patio under a sea-grape tree" },
    { src: "assets/own-IMG_1681.jpg",  alt: "Ochre wall and weathered green table with fruit above the sea" },
    { comingSoon: "no. 07<br>first location study<br>&mdash; coming soon &mdash;" },
    { src: "assets/own-IMG_4831.jpg",  alt: "Sun setting over the harbor, pier in silhouette" },
    { src: "assets/own-IMG_1678.jpg",  alt: "Vine-covered pergola terrace overlooking the sea" },
    { src: "assets/own-IMG_1679.jpg",  alt: "Stone villa and pool at golden hour" },
    { src: "assets/own-IMG_1680.jpg",  alt: "Stone window framing the sea at sunset" },
  ],

  /* ── SELECTED WORK — the grid on studio.html ────────────────────────
     wide: true makes a tile span two columns (use for landscape-ish
     hero moments; roughly one wide tile per row of three).            */
  workGrid: [
    { src: "assets/own-IMG_9404.jpg", wide: true,
      alt: "Restaurant bay window, white linen and wine glasses in late light",
      title: "The Table", meta: "White Linen · Window Light · Evening" },
    { src: "assets/own-IMG_0556.jpg",
      alt: "Old-town lane with archway bridges, looking up",
      title: "Arrival", meta: "Old Town · Archways · First Walk" },
    { src: "assets/own-IMG_1681.jpg",
      alt: "Ochre wall, weathered green table with fruit and spring water above a deep blue sea",
      title: "Morning", meta: "Fruit · Spring Water · Sea Air" },
    { src: "assets/own-IMG_4435.jpg",
      alt: "Golden-hour patio under a sea-grape tree, string light glowing",
      title: "Golden Hour", meta: "Patio · String Lights · Last Sun" },
    { src: "assets/own-IMG_1637.jpg",
      alt: "Plastered lounge with beamed ceiling and afternoon sun shafts",
      title: "Common Spaces", meta: "Plaster · Beams · Afternoon Sun" },
    { src: "assets/own-IMG_4831.jpg",
      alt: "Sun setting over the harbor, pier in silhouette",
      title: "Nightfall", meta: "Harbor · Sundown · Hush" },
    { src: "assets/own-IMG_1678.jpg", wide: true,
      alt: "Vine-covered pergola terrace with a writing desk overlooking the sea",
      title: "The View", meta: "What You Wake Up To" },
  ],

  /* ── IN MOTION — the phone-framed reel on studio.html ─────────────── */
  reel: { src: "assets/own-reel.mp4", poster: "assets/own-reel-poster.jpg" },

  /* ── HERO BAND — the full-width video under the studio.html hero ──── */
  heroBand: {
    src: "assets/band-waves.mp4", poster: "assets/band-waves-poster.jpg",
    captionLeft: "Location study — the Aegean", captionRight: "Shot by the studio",
  },

  /* ── PORTFOLIO PAGE — the series on portfolio.html ──────────────────
     Each block is one display section. Add a new block to add a new
     series; add items (photos or videos) as your portfolio grows.     */
  portfolio: [
    {
      eyebrow: "Series 01",
      heading: "By the water.",
      lede: "Pools at golden hour, cliff paths, the harbor going quiet — the edges of a stay where the day slows down.",
      items: [
        { src: "assets/own-IMG_1679.jpg", alt: "Stone villa and pool at golden hour",
          title: "The Pool", meta: "Stone · Golden Hour" },
        { src: "assets/own-IMG_4432.jpg", alt: "Cliff path over clear turquoise water, weathered branch in the foreground",
          title: "The Cove", meta: "Cliff Path · Clear Water" },
        { src: "assets/own-IMG_4831.jpg", alt: "Sun setting over the harbor, pier in silhouette",
          title: "Last Light", meta: "Harbor · Sundown" },
        { src: "assets/own-IMG_1680.jpg", alt: "Stone window framing the sea at sunset",
          title: "The Window", meta: "Stone Frame · Open Sea" },
      ],
    },
    {
      eyebrow: "Series 02",
      heading: "At the table.",
      lede: "Meals from the guest's side of the plate — first courses, window seats, and slow mornings that taste like the place.",
      items: [
        { src: "assets/own-IMG_9404.jpg", alt: "Restaurant bay window with white linen and wine glasses",
          title: "Table for Two", meta: "Bay Window · White Linen" },
        { src: "assets/own-IMG_5019.jpg", alt: "Seafood rice and seared fish in cast iron, juice in a stem glass",
          title: "First Course", meta: "Cast Iron · Citrus · Sea Air" },
        { src: "assets/own-IMG_1681.jpg", alt: "Ochre wall and weathered green table with fruit above the sea",
          title: "Morning", meta: "Fruit · Spring Water" },
      ],
    },
    {
      eyebrow: "Series 03",
      heading: "Slow wanders.",
      lede: "The walk between — lanes, courtyards, and the small architecture of being somewhere else.",
      items: [
        { src: "assets/own-IMG_0556.jpg", alt: "Old-town lane with archway bridges, looking up",
          title: "The Lane", meta: "Archways · Looking Up" },
        { src: "assets/own-IMG_4544.jpg", alt: "Bougainvillea spilling over a wall at dusk",
          title: "Bougainvillea", meta: "Dusk · First Bloom" },
        { src: "assets/own-IMG_4435.jpg", alt: "Golden-hour patio under a sea-grape tree",
          title: "The Patio", meta: "String Lights · Last Sun" },
        { src: "assets/own-IMG_1637.jpg", alt: "Plastered lounge with beamed ceiling and sun shafts",
          title: "Inside", meta: "Plaster · Beams" },
      ],
    },
  ],
};
