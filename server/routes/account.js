import express from 'express';
import { db } from '../db.js';
import { requireAuth } from '../auth.js';
import {
  ORDER_STATUSES,
  appendEvent,
  clean,
  publicOrder,
  uniqueOrderCode,
} from '../util.js';

const router = express.Router();

router.use(requireAuth);

router.get('/orders', (req, res) => {
  const orders = db.state.orders
    .filter((order) => order.userId === req.user.id)
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(publicOrder);
  res.json({ orders });
});

router.get('/orders/:code', (req, res) => {
  const order = db.findOrder(req.params.code);
  if (!order || (order.userId !== req.user.id && req.user.role !== 'admin')) {
    return res.status(404).json({ error: 'order_not_found' });
  }
  res.json({ order: publicOrder(order) });
});

router.post('/orders', (req, res) => {
  const kind = req.body?.kind === 'rental' ? 'rental' : 'service';
  const referenceCode = clean(req.body?.serviceCode, 80);
  const brand = clean(req.body?.brand, 60);
  const model = clean(req.body?.model, 80);
  const imei = clean(req.body?.imei, 32);
  const notes = clean(req.body?.notes, 1200);
  const paymentMethodCode = clean(req.body?.paymentMethod, 40) || null;
  const days = Number(req.body?.days);

  const reference = kind === 'rental' ? db.findTool(referenceCode) : db.findService(referenceCode);
  if (!reference) return res.status(400).json({ error: 'unknown_reference' });
  if (!brand || !model) return res.status(400).json({ error: 'device_required' });
  if (imei && !/^[0-9]{6,20}$/.test(imei)) return res.status(400).json({ error: 'invalid_imei' });

  let paymentMethod = null;
  if (paymentMethodCode) {
    const method = db.findPaymentMethod(paymentMethodCode);
    if (!method) return res.status(400).json({ error: 'unknown_payment_method' });
    paymentMethod = method.code;
  }

  const rentalDays = kind === 'rental' ? Math.min(Math.max(Number.isFinite(days) ? Math.round(days) : 1, 1), 30) : null;
  const now = new Date().toISOString();
  const order = {
    id: db.id(),
    code: uniqueOrderCode((code) => Boolean(db.findOrder(code))),
    userId: req.user.id,
    userName: req.user.name,
    userEmail: req.user.email,
    kind,
    serviceCode: reference.code,
    serviceName: reference.name,
    device: { brand, model, imei: imei || null, notes: notes || null, days: rentalDays },
    paymentMethod,
    paymentStatus: 'not_configured',
    amountUsd: reference.price_usd ?? null,
    status: 'received',
    adminNote: null,
    events: [],
    createdAt: now,
    updatedAt: now,
  };
  appendEvent(
    order,
    'received',
    reference.status === 'preparing'
      ? 'Solicitud recibida. Servicio en preparación: se confirmará alcance y tarifa antes de cualquier pago.'
      : 'Solicitud recibida.',
    req.user.email,
  );
  db.state.orders.push(order);
  db.save();
  res.status(201).json({ order: publicOrder(order) });
});

router.post('/orders/:code/cancel', (req, res) => {
  const order = db.findOrder(req.params.code);
  if (!order || order.userId !== req.user.id) return res.status(404).json({ error: 'order_not_found' });
  if (!['received', 'quoted'].includes(order.status)) {
    return res.status(409).json({ error: 'cancel_not_allowed' });
  }
  order.status = 'cancelled';
  appendEvent(order, 'cancelled', 'Cancelado por el cliente.', req.user.email);
  db.save();
  res.json({ order: publicOrder(order) });
});

router.get('/summary', (req, res) => {
  const mine = db.state.orders.filter((order) => order.userId === req.user.id);
  const byStatus = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = mine.filter((order) => order.status === status).length;
    return acc;
  }, {});
  res.json({
    total: mine.length,
    byStatus,
    credits: req.user.credits ?? 0,
    lastOrderAt: mine.length ? mine.map((order) => order.createdAt).sort().at(-1) : null,
  });
});

export default router;
