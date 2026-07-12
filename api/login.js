/**
 * Login validation for the online media board.
 *
 * POST { password } ⇒ 200 + signed HttpOnly session cookie (8h), or 401.
 * Security properties:
 *  - secrets come only from env (ADMIN_PASSWORD, ADMIN_SESSION_SECRET);
 *    nothing is hardcoded and missing config fails closed with 503
 *  - schema-validated input: JSON object, password must be a string,
 *    1–256 chars; anything else is rejected before comparison
 *  - constant-time comparison over fixed-length SHA-256 digests
 *  - uniform 401 body + randomized delay on any failure (no oracle for
 *    "wrong length" vs "wrong password")
 *  - best-effort per-IP rate limit (in-memory; serverless instances are
 *    ephemeral so this only slows a burst on a warm instance — the
 *    randomized delay and password entropy are the real defense)
 *  - errors are caught and sanitized; no stack/path detail in responses
 */
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const SESSION_HOURS = 8;
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 20;
const attempts = new Map(); // ip -> { n, windowStart } (per warm instance)

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method !== 'POST') return res.status(405).json({ ok: false });

    const password = process.env.ADMIN_PASSWORD;
    const secret = process.env.ADMIN_SESSION_SECRET;
    if (!password || !secret) return res.status(503).json({ ok: false, error: 'not configured' });

    // Vercel sets x-real-ip to the true client IP (not client-spoofable).
    // Fall back to the LAST hop of x-forwarded-for — the platform appends
    // the real IP, so the rightmost value is the trustworthy one; taking
    // the leftmost would let a client forge the header. Still best-effort
    // (per-warm-instance state); the random delay + password entropy are
    // the real defenses.
    const xff = String(req.headers['x-forwarded-for'] || '').split(',');
    const ip = String(req.headers['x-real-ip'] || xff[xff.length - 1] || 'unknown').trim() || 'unknown';
    const now = Date.now();
    const rec = attempts.get(ip) || { n: 0, windowStart: now };
    if (now - rec.windowStart > WINDOW_MS) { rec.n = 0; rec.windowStart = now; }
    if (rec.n >= MAX_ATTEMPTS) return fail(res, 429);

    // Schema validation: object body, string password, bounded length.
    let supplied = '';
    try {
      const body = typeof req.body === 'object' && req.body !== null
        ? req.body
        : JSON.parse(String(req.body || '{}'));
      supplied = typeof body.password === 'string' ? body.password : '';
    } catch { supplied = ''; }
    if (supplied.length < 1 || supplied.length > 256) {
      rec.n += 1; attempts.set(ip, rec);
      return fail(res);
    }

    const a = createHash('sha256').update(supplied, 'utf8').digest();
    const b = createHash('sha256').update(password, 'utf8').digest();
    if (!timingSafeEqual(a, b)) {
      rec.n += 1; attempts.set(ip, rec);
      return fail(res);
    }

    attempts.delete(ip);
    const exp = String(now + SESSION_HOURS * 60 * 60 * 1000);
    const sig = createHmac('sha256', secret).update(exp).digest('hex');
    res.setHeader(
      'Set-Cookie',
      `hw_admin=${exp}.${sig}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${SESSION_HOURS * 3600}`
    );
    return res.status(200).json({ ok: true });
  } catch {
    // Sanitized: never echo error details to the client.
    return res.status(500).json({ ok: false });
  }
}

async function fail(res, status = 401) {
  await new Promise((r) => setTimeout(r, 400 + Math.floor(Math.random() * 400)));
  return res.status(status).json({ ok: false });
}
