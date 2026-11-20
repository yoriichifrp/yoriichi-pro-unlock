import express from 'express';
import { db } from '../db.js';
import {
  EMAIL_RE,
  clearSessionCookie,
  hashPassword,
  optionalAuth,
  publicUser,
  rateLimit,
  requireAuth,
  setSessionCookie,
  verifyPassword,
} from '../auth.js';
import { clean } from '../util.js';

const router = express.Router();

const authLimiter = rateLimit({ windowMs: 10 * 60_000, max: 20, key: 'auth' });

router.get('/me', optionalAuth, (req, res) => {
  res.json({ user: publicUser(req.user) });
});

router.post('/register', authLimiter, (req, res) => {
  const name = clean(req.body?.name, 80);
  const email = clean(req.body?.email, 160).toLowerCase();
  const password = String(req.body?.password || '');
  const country = clean(req.body?.country, 60) || null;

  if (name.length < 2) return res.status(400).json({ error: 'invalid_name' });
  if (!EMAIL_RE.test(email)) return res.status(400).json({ error: 'invalid_email' });
  if (password.length < 8) return res.status(400).json({ error: 'weak_password' });
  if (db.findUserByEmail(email)) return res.status(409).json({ error: 'email_taken' });

  const user = {
    id: db.id(),
    name,
    email,
    country,
    role: 'client',
    status: 'active',
    credits: 0,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
  };
  db.state.users.push(user);
  db.save();
  setSessionCookie(req, res, user);
  res.status(201).json({ user: publicUser(user) });
});

router.post('/login', authLimiter, (req, res) => {
  const email = clean(req.body?.email, 160).toLowerCase();
  const password = String(req.body?.password || '');
  const user = db.findUserByEmail(email);

  if (!user || !verifyPassword(password, user.passwordHash)) {
    return res.status(401).json({ error: 'invalid_credentials' });
  }
  if (user.status === 'suspended') return res.status(403).json({ error: 'account_suspended' });

  user.lastLoginAt = new Date().toISOString();
  db.save();
  setSessionCookie(req, res, user);
  res.json({ user: publicUser(user) });
});

router.post('/logout', (req, res) => {
  clearSessionCookie(req, res);
  res.json({ ok: true });
});

router.patch('/password', requireAuth, (req, res) => {
  const currentPassword = String(req.body?.currentPassword || '');
  const newPassword = String(req.body?.newPassword || '');
  if (!verifyPassword(currentPassword, req.user.passwordHash)) {
    return res.status(400).json({ error: 'invalid_current_password' });
  }
  if (newPassword.length < 8) return res.status(400).json({ error: 'weak_password' });
  req.user.passwordHash = hashPassword(newPassword);
  req.user.isDemoAdmin = false;
  db.save();
  res.json({ ok: true });
});

router.patch('/profile', requireAuth, (req, res) => {
  const name = clean(req.body?.name, 80);
  const country = clean(req.body?.country, 60) || null;
  if (name.length < 2) return res.status(400).json({ error: 'invalid_name' });
  req.user.name = name;
  req.user.country = country;
  db.save();
  res.json({ user: publicUser(req.user) });
});

export default router;
