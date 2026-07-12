/**
 * Edge gate for the online media board.
 * Requests to /admin.html (and /admin) pass only with a valid signed
 * session cookie minted by /api/login. No secret configured, no cookie,
 * bad signature, or expired session ⇒ redirect to the login page.
 * Fails CLOSED: without ADMIN_SESSION_SECRET nothing can validate.
 */
export const config = { matcher: ['/admin.html', '/admin'] };

const enc = (s) => new TextEncoder().encode(s);

async function hasValidSession(req) {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) return false;

  const cookies = req.headers.get('cookie') || '';
  const match = cookies.match(/(?:^|;\s*)hw_admin=([^;]+)/);
  if (!match) return false;

  const [expStr, sig] = match[1].split('.');
  if (!expStr || !sig) return false;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || Date.now() > exp) return false;

  const key = await crypto.subtle.importKey(
    'raw', enc(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']
  );
  const mac = new Uint8Array(await crypto.subtle.sign('HMAC', key, enc(expStr)));
  const expected = [...mac].map((b) => b.toString(16).padStart(2, '0')).join('');

  // Constant-time comparison.
  if (expected.length !== sig.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
  return diff === 0;
}

export default async function middleware(req) {
  if (await hasValidSession(req)) return; // fall through to the static file
  return Response.redirect(new URL('/admin-login.html', req.url), 302);
}
