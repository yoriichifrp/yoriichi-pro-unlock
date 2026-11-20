/**
 * Autenticación de YORIICHI PRO UNLOCK.
 *
 * - Contraseñas con scrypt + sal aleatoria (comparación en tiempo constante).
 * - Sesión en cookie HttpOnly firmada con HMAC-SHA256 (sin dependencias externas).
 * - Limitador de intentos en memoria para login y registro.
 */
import crypto from 'node:crypto';
import { db } from './db.js';

export const SESSION_COOKIE = 'ypu_session';
export const SESSION_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 días

const SCRYPT_KEYLEN = 64;

export function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const derived = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

export function verifyPassword(password, stored) {
  if (typeof stored !== 'string') return false;
  const [scheme, salt, expected] = stored.split('$');
  if (scheme !== 'scrypt' || !salt || !expected) return false;
  const derived = crypto.scryptSync(String(password), salt, SCRYPT_KEYLEN);
  const expectedBuffer = Buffer.from(expected, 'hex');
  if (expectedBuffer.length !== derived.length) return false;
  return crypto.timingSafeEqual(derived, expectedBuffer);
}

function secret() {
  return process.env.SESSION_SECRET || db.state.settings.sessionSecret;
}

const b64url = (value) => Buffer.from(value).toString('base64url');

export function signToken(user) {
  const payload = b64url(
    JSON.stringify({ sub: user.id, role: user.role, exp: Date.now() + SESSION_TTL_MS }),
  );
  const signature = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
}

export function verifyToken(token) {
  if (typeof token !== 'string' || !token.includes('.')) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = crypto.createHmac('sha256', secret()).update(payload).digest('base64url');
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!data?.sub || typeof data.exp !== 'number' || data.exp < Date.now()) return null;
    return data;
  } catch {
    return null;
  }
}

export function parseCookies(header = '') {
  return header.split(';').reduce((acc, part) => {
    const index = part.indexOf('=');
    if (index > 0) acc[part.slice(0, index).trim()] = decodeURIComponent(part.slice(index + 1).trim());
    return acc;
  }, {});
}

function isHttps(req) {
  return req.secure || String(req.headers['x-forwarded-proto'] || '').split(',')[0] === 'https';
}

export function setSessionCookie(req, res, user) {
  res.cookie(SESSION_COOKIE, signToken(user), {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps(req),
    path: '/',
    maxAge: SESSION_TTL_MS,
  });
}

export function clearSessionCookie(req, res) {
  res.clearCookie(SESSION_COOKIE, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isHttps(req),
    path: '/',
  });
}

export function publicUser(user) {
  if (!user) return null;
  const { passwordHash, ...safe } = user;
  return {
    id: safe.id,
    name: safe.name,
    email: safe.email,
    role: safe.role,
    credits: safe.credits ?? 0,
    status: safe.status || 'active',
    country: safe.country || null,
    createdAt: safe.createdAt,
  };
}

export function optionalAuth(req, _res, next) {
  const token = parseCookies(req.headers.cookie || '')[SESSION_COOKIE];
  const data = verifyToken(token);
  req.user = data ? db.findUserById(data.sub) : null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'auth_required' });
  if (req.user.status === 'suspended') return res.status(403).json({ error: 'account_suspended' });
  return next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) return res.status(401).json({ error: 'auth_required' });
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'admin_required' });
  return next();
}

/** Limitador simple por IP para endpoints sensibles. */
export function rateLimit({ windowMs = 60_000, max = 12, key = 'default' } = {}) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const identity = `${key}:${req.ip}`;
    const entry = hits.get(identity);
    if (!entry || entry.resetAt < now) {
      hits.set(identity, { count: 1, resetAt: now + windowMs });
      return next();
    }
    entry.count += 1;
    if (entry.count > max) {
      const retry = Math.ceil((entry.resetAt - now) / 1000);
      res.set('Retry-After', String(retry));
      return res.status(429).json({ error: 'rate_limited', retryAfter: retry });
    }
    return next();
  };
}

export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
