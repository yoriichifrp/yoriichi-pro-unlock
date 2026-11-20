import express from 'express';
import { db } from '../db.js';
import { rateLimit } from '../auth.js';
import { clean, isEmail, publicOrder } from '../util.js';

const router = express.Router();

const supportLimiter = rateLimit({ windowMs: 60 * 60_000, max: 8, key: 'support' });

router.get('/catalog', (_req, res) => {
  const categories = [...db.state.categories]
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((category) => ({
      ...category,
      services: db.state.services
        .filter((service) => service.category === category.slug)
        .map((service) => ({
          code: service.code,
          name: service.name,
          desc_es: service.desc_es,
          desc_en: service.desc_en,
          status: service.status,
          price_usd: service.price_usd,
          delivery_es: service.delivery_es,
          delivery_en: service.delivery_en,
        })),
    }));
  res.json({ categories, updatedAt: db.state.meta.updatedAt });
});

router.get('/tools', (_req, res) => {
  res.json({ tools: db.state.tools });
});

router.get('/payments', (_req, res) => {
  const methods = [...db.state.paymentMethods]
    .sort((a, b) => (a.sort || 0) - (b.sort || 0))
    .map((method) => ({
      code: method.code,
      name: method.name,
      kind: method.kind,
      status: method.status,
      instructions_es: method.status === 'active' ? method.instructions_es || null : null,
      instructions_en: method.status === 'active' ? method.instructions_en || null : null,
    }));
  res.json({ methods, configured: methods.some((method) => method.status === 'active') });
});

router.get('/settings', (_req, res) => {
  res.json({
    announcement_es: db.state.settings.announcement_es || null,
    announcement_en: db.state.settings.announcement_en || null,
    contact: {
      whatsapp: '+18299729672',
      telegram: '+18299729672',
      email: 'yoriichifrp09@gmail.com',
    },
  });
});

router.get('/orders/track/:code', (req, res) => {
  const order = db.findOrder(req.params.code);
  if (!order) return res.status(404).json({ error: 'order_not_found' });
  res.json({ order: publicOrder(order) });
});

router.post('/support', supportLimiter, (req, res) => {
  const name = clean(req.body?.name, 80);
  const email = clean(req.body?.email, 160).toLowerCase();
  const channel = clean(req.body?.channel, 20) || 'web';
  const subject = clean(req.body?.subject, 120);
  const message = clean(req.body?.message, 4000);

  if (name.length < 2) return res.status(400).json({ error: 'invalid_name' });
  if (!isEmail(email)) return res.status(400).json({ error: 'invalid_email' });
  if (subject.length < 3) return res.status(400).json({ error: 'invalid_subject' });
  if (message.length < 10) return res.status(400).json({ error: 'invalid_message' });

  const record = {
    id: db.id(),
    name,
    email,
    channel,
    subject,
    message,
    status: 'open',
    createdAt: new Date().toISOString(),
  };
  db.state.messages.push(record);
  db.save();
  res.status(201).json({ ok: true, ticket: record.id.slice(0, 8).toUpperCase() });
});

export default router;
