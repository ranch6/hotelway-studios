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
    if (data.message) handleInquiry(data);
    else if (data.email) handleSubscribe(data.email.trim());
  } catch (err) {
    // Log, never throw — the site treats any response as delivered.
    console.error(err);
  }
  return ContentService.createTextOutput('ok');
}

/* ── JOIN: record + welcome email ─────────────────────────────────── */

function handleSubscribe(email) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const s = sheetTab('Subscribers', ['date', 'email', 'welcome email']);
  // Dedupe: don't re-add or re-welcome an address that's already on the list.
  const existing = s.getLastRow() > 1
    ? s.getRange(2, 2, s.getLastRow() - 1, 1).getValues().flat().map(String)
    : [];
  if (existing.includes(email)) return;
  s.appendRow([new Date(), email, '…']);
  const row = s.getLastRow();
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
`Hello —

Thank you for joining the Hotelway Studios early list. You're in before the doors open: as new location studies, films, and the first client stories go live, you'll hear it here first.

The studio is already open for a look:
The studio — ${SITE}/studio.html
The archive — ${SITE}/portfolio.html

If you have a project in mind — a property, a stay, a collaboration — the fastest way to reach us is the inquiry form: ${SITE}/inquire.html. We reply within two business days.

Quietly,
Hotelway Studios
New York · @hotelwaystudios

This address sends notes but isn't monitored — for anything that needs an answer, please use the inquiry form above.`;

  const html = `
  <div style="background:#FBF7EB;padding:40px 20px">
    <div style="max-width:520px;margin:0 auto;background:#FFFDF4;border:1px solid #DCD3B4;padding:44px 40px;color:#2C2F26;font-family:Georgia,'Times New Roman',serif;line-height:1.7">
      <div style="letter-spacing:0.28em;text-transform:uppercase;font-size:13px;margin-bottom:26px">Hotelway&nbsp;Studios</div>
      <div style="font-size:24px;font-style:italic;margin-bottom:22px">You&rsquo;re on the list.</div>
      <p style="margin:0 0 16px;font-size:15px">Thank you for joining the Hotelway Studios early list. You&rsquo;re in before the doors open: as new location studies, films, and the first client stories go live, you&rsquo;ll hear it here first.</p>
      <p style="margin:0 0 16px;font-size:15px">The studio is already open for a look &mdash;
        <a href="${SITE}/studio.html" style="color:#B98A2F">the studio</a> &middot;
        <a href="${SITE}/portfolio.html" style="color:#B98A2F">the archive</a>.</p>
      <p style="margin:0 0 26px;font-size:15px">If you have a project in mind &mdash; a property, a stay, a collaboration &mdash; the fastest way to reach us is the <a href="${SITE}/inquire.html" style="color:#B98A2F">inquiry form</a>. We reply within two business days.</p>
      <p style="margin:0;font-size:15px;font-style:italic">Quietly,<br>Hotelway Studios</p>
      <div style="margin-top:30px;padding-top:18px;border-top:1px solid #F2EBD5;font-size:12px;color:#6A6D57;letter-spacing:0.06em">
        New York &middot; @hotelwaystudios<br><br>
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
  const s = sheetTab('Inquiries', ['date', 'name', 'email', 'phone', 'message']);
  s.appendRow([new Date(), d.name || '', d.email || '', d.phone || '', d.message || '']);
  MailApp.sendEmail(
    OWNER_EMAIL,
    'Hotelway inquiry — ' + (d.name || d.email || 'website'),
    `Name: ${d.name || ''}\nEmail: ${d.email || ''}\nPhone: ${d.phone || ''}\n\n${d.message || ''}\n\n— sent from the website inquiry form; reply to this email to answer them directly.`,
    { replyTo: d.email || OWNER_EMAIL, name: 'Hotelway Website' }
  );
}

/* ── helpers ──────────────────────────────────────────────────────── */

function sheetTab(name, headers) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(name);
  if (!s) {
    s = ss.insertSheet(name);
    s.appendRow(headers);
    s.setFrozenRows(1);
  }
  return s;
}

/** Run this once from the editor (▶ Run) to authorize Gmail + Sheets
 *  and send yourself a test welcome email. */
function testWelcome() {
  sendWelcome(OWNER_EMAIL);
}
