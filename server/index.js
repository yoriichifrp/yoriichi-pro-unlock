import express from 'express';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db } from './db.js';
import { hashPassword, optionalAuth } from './auth.js';
import authRoutes from './routes/auth.js';
import publicRoutes from './routes/public.js';
import accountRoutes from './routes/account.js';
import adminRoutes from './routes/admin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 8080;
const HOST = '0.0.0.0';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(express.json({ limit: '96kb' }));

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      "img-src 'self' data: https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "script-src 'self'",
      "connect-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
    ].join('; '),
  );
  next();
});

app.use(optionalAuth);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, service: 'yoriichi-pro-unlock', time: new Date().toISOString() });
});

app.use('/api/auth', authRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/account', accountRoutes);
app.use('/api/admin', adminRoutes);

app.use('/api', (_req, res) => res.status(404).json({ error: 'not_found' }));

app.use(
  express.static(DIST, {
    index: false,
    maxAge: '1h',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('index.html')) res.setHeader('Cache-Control', 'no-cache');
    },
  }),
);

app.get(/^(?!\/api).*/, (_req, res) => {
  const indexFile = path.join(DIST, 'index.html');
  if (fs.existsSync(indexFile)) return res.sendFile(indexFile);
  return res
    .status(503)
    .type('text/plain')
    .send('Interfaz no compilada. Ejecuta "npm run build" o usa "npm run dev".');
});

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, _next) => {
  console.error('[server] error no controlado:', error?.message);
  res.status(500).json({ error: 'internal_error' });
});

function bootstrapAdmin() {
  const adminEmail = String(process.env.ADMIN_EMAIL || '').trim().toLowerCase();
  const adminPassword = String(process.env.ADMIN_PASSWORD || '');
  const existingAdmin = db.state.users.find((user) => user.role === 'admin');

  if (adminEmail && adminPassword.length >= 8) {
    const user = db.findUserByEmail(adminEmail);
    if (user) {
      user.role = 'admin';
      user.status = 'active';
      user.passwordHash = hashPassword(adminPassword);
      user.isDemoAdmin = false;
    } else {
      db.state.users.push({
        id: db.id(),
        name: 'Administrador',
        email: adminEmail,
        country: null,
        role: 'admin',
        status: 'active',
        credits: 0,
        passwordHash: hashPassword(adminPassword),
        createdAt: new Date().toISOString(),
        isDemoAdmin: false,
      });
    }
    db.save();
    console.log(`[bootstrap] administrador configurado desde variables de entorno: ${adminEmail}`);
    return;
  }

  if (!existingAdmin) {
    db.state.users.push({
      id: db.id(),
      name: 'Administrador YORIICHI',
      email: 'admin@yoriichi.pro',
      country: null,
      role: 'admin',
      status: 'active',
      credits: 0,
      passwordHash: hashPassword('Yoriichi#2026'),
      createdAt: new Date().toISOString(),
      isDemoAdmin: true,
    });
    db.save();
    console.log('[bootstrap] administrador de demostración creado (admin@yoriichi.pro). Configura ADMIN_EMAIL y ADMIN_PASSWORD.');
  }
}

bootstrapAdmin();

app.listen(PORT, HOST, () => {
  console.log(`YORIICHI PRO UNLOCK escuchando en http://${HOST}:${PORT}`);
});
