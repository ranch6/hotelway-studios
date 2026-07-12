/** Clears the media-board session cookie and returns to the studio. */
export default function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('Set-Cookie', 'hw_admin=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0');
  res.writeHead(302, { Location: '/studio.html' });
  res.end();
}
