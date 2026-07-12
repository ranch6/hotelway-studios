/** Clears the media-board session cookie and returns to the studio.
 *  POST-only so a cross-site GET (e.g. <img src=…/api/logout>) can't force
 *  a logged-in admin out. The board's "Log out" control posts a form. */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  res.setHeader('Set-Cookie', 'hw_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  res.writeHead(302, { Location: '/studio.html' });
  res.end();
}
