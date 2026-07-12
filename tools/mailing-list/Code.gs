/**
 * HOTELWAY STUDIOS — mailing list + inquiries backend (Google Apps Script)
 * =========================================================================
 * Paste this whole file into Extensions → Apps Script of the
 * "Hotelway — early access" Google Sheet, then Deploy → New deployment →
 * Web app (Execute as: Me · Who has access: Anyone). Full setup steps in
 * DEPLOY.md → "Mailing list + welcome email workflow".
 *
 * One web app URL serves both site forms:
 *   - cover JOIN form posts { email }            → Subscribers tab + welcome email (within seconds)
 *   - inquire.html posts   { name, email, ... }  → Inquiries tab + notification to your inbox
 *
 * PRIVACY / LEAST-PRIVILEGE: this script uses MailApp (send-only — it is
 * technically incapable of reading mail) and, via appsscript.json, limits
 * its Sheets access to THIS spreadsheet only. The authorization prompt
 * should ask exactly two things: "Send email as you" and access to the
 * spreadsheet this script is installed in. If it asks to READ your email,
 * the manifest step in DEPLOY.md was skipped.
 *
 * Sending quota on a free Gmail account: ~100 emails/day — plenty here.
 */

const OWNER_EMAIL = 'hotelwaystudios@gmail.com';
const NOREPLY = 'hotelwaystudios+noreply@gmail.com'; // same inbox; the +noreply lets a Gmail filter catch replies
const SITE = 'https://hotelway-studios.vercel.app';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    if (data.message) {
      handleInquiry({
        name: clip(data.name, 120),
        email: clip(data.email, 254).trim(),
        phone: clip(data.phone, 60),
        message: clip(data.message, 4000),
      });
    } else if (data.email) {
      handleSubscribe(clip(data.email, 254).trim());
    }
  } catch (err) {
    // Log, never throw — the site treats any response as delivered.
    console.error(err);
  }
  return ContentService.createTextOutput('ok');
}

/* Server-side input bounds: coerce to string and cap length. The site's own
   forms stay well under these; anything longer is a direct/abusive POST. */
function clip(v, max) {
  return String(v == null ? '' : v).slice(0, max);
}

/* Sheets treats cell values starting with = + - @ as formulas — prefix a
   quote so hostile form input can never execute in the spreadsheet. */
function cellSafe(v) {
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

/* Drop rapid repeats (same key) without touching the sheet. */
function throttled(key, seconds) {
  const cache = CacheService.getScriptCache();
  if (cache.get(key)) return true;
  cache.put(key, '1', seconds);
  return false;
}

/* Hard daily ceiling on outbound email so an abusive loop against the
   public URL can't burn the whole Gmail quota (~100/day on free Gmail). */
function underDailyCap() {
  const props = PropertiesService.getScriptProperties();
  const today = new Date().toDateString();
  const rec = JSON.parse(props.getProperty('sendCount') || '{}');
  if (rec.day !== today) { rec.day = today; rec.n = 0; }
  if (rec.n >= 60) return false;
  rec.n += 1;
  props.setProperty('sendCount', JSON.stringify(rec));
  return true;
}

/* ── JOIN: record + welcome email ─────────────────────────────────── */

function handleSubscribe(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  if (throttled('sub:' + email.toLowerCase(), 60)) return;
  // Dedupe: don't re-add or re-welcome an address that's already on the list.
  if (isSubscribed(email)) return;
  const s = sheetTab('Subscribers', ['date', 'email', 'welcome email']);
  s.appendRow([new Date(), cellSafe(email), '…']);
  const row = s.getLastRow();
  if (!underDailyCap()) {
    s.getRange(row, 3).setValue('skipped — daily send cap reached');
    return;
  }
  try {
    sendWelcome(email);
    s.getRange(row, 3).setValue('sent ' + new Date().toLocaleString());
  } catch (err) {
    s.getRange(row, 3).setValue('FAILED — ' + err);
  }
}

function sendWelcome(to) {
  const subject = 'You’re on the list — Hotelway Studios';

  const plain =
`Thank you for joining the Hotelway Studios community! As new location studies and client stories go live, you'll hear it here first.

Take another look:
The studio — ${SITE}/studio.html
The archive — ${SITE}/portfolio.html

If you have a project in mind — a property, a stay, a collaboration — the fastest way to reach us is the inquiry form: ${SITE}/inquire.html. We will respond within two to three business days.

Yours,
Hotelway Studios
New York · @hotelwaystudios — https://instagram.com/hotelwaystudios

This address sends notes but isn't monitored — for anything that needs an answer, please use the inquiry form above.`;

  const html = `
  <div style="background:#FBF7EB;padding:40px 20px">
    <div style="max-width:520px;margin:0 auto;background:#FFFDF4;border:1px solid #DCD3B4;padding:44px 40px;color:#2C2F26;font-family:Georgia,'Times New Roman',serif;line-height:1.7">
      <div style="letter-spacing:0.28em;text-transform:uppercase;font-size:13px;margin-bottom:26px">Hotelway&nbsp;Studios</div>
      <div style="font-size:24px;font-style:italic;margin-bottom:22px">You&rsquo;re on the list.</div>
      <p style="margin:0 0 16px;font-size:15px">Thank you for joining the Hotelway Studios community! As new location studies and client stories go live, you&rsquo;ll hear it here first.</p>
      <p style="margin:0 0 16px;font-size:15px">Take another look &mdash;
        <a href="${SITE}/studio.html" style="color:#B98A2F">the studio</a> &middot;
        <a href="${SITE}/portfolio.html" style="color:#B98A2F">the archive</a>.</p>
      <p style="margin:0 0 26px;font-size:15px">If you have a project in mind &mdash; a property, a stay, a collaboration &mdash; the fastest way to reach us is the <a href="${SITE}/inquire.html" style="color:#B98A2F">inquiry form</a>. We will respond within two to three business days.</p>
      <p style="margin:0;font-size:15px;font-style:italic">Yours,<br>Hotelway Studios</p>
      <div style="margin-top:30px;padding-top:18px;border-top:1px solid #F2EBD5;font-size:12px;color:#6A6D57;letter-spacing:0.06em">
        New York &middot; <a href="https://instagram.com/hotelwaystudios" style="color:#B98A2F;text-decoration:none">@hotelwaystudios</a><br><br>
        This address sends notes but isn&rsquo;t monitored &mdash; for anything that needs an answer, please use the
        <a href="${SITE}/inquire.html" style="color:#B98A2F">inquiry form</a>.
      </div>
    </div>
  </div>`;

  // MailApp, not GmailApp: send-only permission, cannot read any mail.
  MailApp.sendEmail(to, subject, plain, {
    htmlBody: html,
    name: 'Hotelway Studios',
    replyTo: NOREPLY,
  });
}

/* ── INQUIRIES: record + notify your real inbox ───────────────────── */

function handleInquiry(d) {
  // Throttle repeats per address (double-clicks, retried no-cors POSTs,
  // scripted loops) — one inquiry per address per 2 minutes.
  const key = (d.email || 'anonymous').toLowerCase();
  if (throttled('inq:' + key, 120)) return;
  const s = sheetTab('Inquiries', ['date', 'name', 'email', 'phone', 'message', 'notified']);
  s.appendRow([new Date(), cellSafe(d.name), cellSafe(d.email), cellSafe(d.phone), cellSafe(d.message), '…']);
  const row = s.getLastRow();
  if (!underDailyCap()) {
    s.getRange(row, 6).setValue('skipped — daily send cap reached (check the sheet for the inquiry)');
  } else {
    try {
      MailApp.sendEmail(
        OWNER_EMAIL,
        'Hotelway inquiry — ' + (d.name || d.email || 'website'),
        `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\n\n${d.message}\n\n— sent from the website inquiry form; reply to this email to answer them directly.`,
        { replyTo: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email) ? d.email : OWNER_EMAIL, name: 'Hotelway Website' }
      );
      s.getRange(row, 6).setValue('sent ' + new Date().toLocaleString());
    } catch (err) {
      s.getRange(row, 6).setValue('FAILED — ' + err);
    }
  }
  // Everyone who inquires also joins the subscriber list (quietly — the
  // welcome email is for Join signups; inquirers get a personal reply).
  if (d.email) addSubscriberSilently(d.email.trim());
}

function addSubscriberSilently(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || isSubscribed(email)) return;
  sheetTab('Subscribers', ['date', 'email', 'welcome email'])
    .appendRow([new Date(), cellSafe(email), 'added via inquiry — no welcome sent']);
}

/* ── helpers ──────────────────────────────────────────────────────── */

function isSubscribed(email) {
  const s = sheetTab('Subscribers', ['date', 'email', 'welcome email']);
  if (s.getLastRow() < 2) return false;
  return s.getRange(2, 2, s.getLastRow() - 1, 1).getValues().flat()
    .map(String).map(v => v.toLowerCase()).includes(email.toLowerCase());
}

function sheetTab(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(headers);
    s.setFrozenRows(1);
  } else if (!s.getRange(1, headers.length).getValue()) {
    // Top up header row when new columns are added in a later version.
    s.getRange(1, 1, 1, headers.length).setValues([headers]);
  }
  return s;
}

/** Run this once from the editor (▶ Run) to authorize Gmail + Sheets
 *  and send yourself a test welcome email. */
function testWelcome() {
  sendWelcome(OWNER_EMAIL);
}
