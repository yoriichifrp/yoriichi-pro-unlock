import express from 'express';
import { db } from '../db.js';
import { requireAdmin } from '../auth.js';
import { publicUser } from '../auth.js';
import {
  ORDER_STATUSES,
  PAYMENT_STATUSES,
  adminOrder,
  appendEvent,
  clean,
} from '../util.js';

const router = express.Router();
router.use(requireAdmin);

router.get('/overview', (_req, res) => {
  const orders = db.state.orders;
  const byStatus = ORDER_STATUSES.reduce((acc, status) => {
    acc[status] = orders.filter((order) => order.status === status).length;
    return acc;
  }, {});
  const configuredServices = db.state.services.filter((service) => service.status === 'available').length;
  const activePayments = db.state.paymentMethods.filter((method) => method.status === 'active').length;

  res.json({
    orders: { total: orders.length, byStatus },
    users: {
      total: db.state.users.length,
      admins: db.state.users.filter((user) => user.role === 'admin').length,
    },
    services: { total: db.state.services.length, available: configuredServices, preparing: db.state.services.length - configuredServices },
    payments: { total: db.state.paymentMethods.length, active: activePayments },
    messages: { total: db.state.messages.length, open: db.state.messages.filter((item) => item.status === 'open').length },
    suppliers: { total: db.state.suppliers.length },
    tools: { total: db.state.tools.length, available: db.state.tools.filter((tool) => tool.status === 'available').length },
    recentOrders: [...orders].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8).map(adminOrder),
  });
});

router.get('/orders', (req, res) => {
  const status = clean(req.query.status, 20);
  const orders = [...db.state.orders]
    .filter((order) => (status ? order.status === status : true))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .map(adminOrder);
  res.json({ orders });
});

router.patch('/orders/:code', (req, res) => {
  const order = db.findOrder(req.params.code);
  if (!order) return res.status(404).json({ error: 'order_not_found' });

  const { status, amountUsd, paymentStatus, adminNote } = req.body || {};
  if (status !== undefined) {
    if (!ORDER_STATUSES.includes(status)) return res.status(400).json({ error: 'invalid_status' });
    if (status !== order.status) {
      order.status = status;
      appendEvent(order, status, clean(adminNote, 400) || null, req.user.email);
    }
  }
  if (paymentStatus !== undefined) {
    if (!PAYMENT_STATUSES.includes(paymentStatus)) return res.status(400).json({ error: 'invalid_payment_status' });
    order.paymentStatus = paymentStatus;
  }
  if (amountUsd !== undefined) {
    if (amountUsd === null || amountUsd === '') order.amountUsd = null;
    else {
      const value = Number(amountUsd);
      if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'invalid_amount' });
      order.amountUsd = Math.round(value * 100) / 100;
    }
  }
  if (adminNote !== undefined) order.adminNote = clean(adminNote, 600) || null;

  order.updatedAt = new Date().toISOString();
  db.save();
  res.json({ order: adminOrder(order) });
});

router.get('/users', (_req, res) => {
  const users = db.state.users
    .map((user) => ({
      ...publicUser(user),
      orders: db.state.orders.filter((order) => order.userId === user.id).length,
    }))
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ users });
});

router.patch('/users/:id', (req, res) => {
  const user = db.findUserById(req.params.id);
  if (!user) return res.status(404).json({ error: 'user_not_found' });

  const { role, status, credits } = req.body || {};
  if (role !== undefined) {
    if (!['client', 'admin'].includes(role)) return res.status(400).json({ error: 'invalid_role' });
    if (user.id === req.user.id && role !== 'admin') return res.status(400).json({ error: 'cannot_demote_self' });
    user.role = role;
  }
  if (status !== undefined) {
    if (!['active', 'suspended'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
    if (user.id === req.user.id && status !== 'active') return res.status(400).json({ error: 'cannot_suspend_self' });
    user.status = status;
  }
  if (credits !== undefined) {
    const value = Number(credits);
    if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'invalid_credits' });
    user.credits = Math.round(value * 100) / 100;
  }
  db.save();
  res.json({ user: publicUser(user) });
});

router.get('/services', (_req, res) => {
  res.json({ services: db.state.services, categories: db.state.categories });
});

router.patch('/services/:code', (req, res) => {
  const service = db.findService(req.params.code);
  if (!service) return res.status(404).json({ error: 'service_not_found' });

  const { status, price_usd, name, desc_es, desc_en, delivery_es, delivery_en } = req.body || {};
  if (status !== undefined) {
    if (!['preparing', 'available', 'paused'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
    service.status = status;
  }
  if (price_usd !== undefined) {
    if (price_usd === null || price_usd === '') service.price_usd = null;
    else {
      const value = Number(price_usd);
      if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'invalid_price' });
      service.price_usd = Math.round(value * 100) / 100;
    }
  }
  if (name !== undefined) service.name = clean(name, 120) || service.name;
  if (desc_es !== undefined) service.desc_es = clean(desc_es, 400);
  if (desc_en !== undefined) service.desc_en = clean(desc_en, 400);
  if (delivery_es !== undefined) service.delivery_es = clean(delivery_es, 200);
  if (delivery_en !== undefined) service.delivery_en = clean(delivery_en, 200);

  db.save();
  res.json({ service });
});

router.get('/tools', (_req, res) => {
  res.json({ tools: db.state.tools });
});

router.patch('/tools/:code', (req, res) => {
  const tool = db.findTool(req.params.code);
  if (!tool) return res.status(404).json({ error: 'tool_not_found' });
  const { status, price_per_day } = req.body || {};
  if (status !== undefined) {
    if (!['preparing', 'available', 'paused'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
    tool.status = status;
    tool.availability = status === 'available' ? 'available' : 'config_pending';
  }
  if (price_per_day !== undefined) {
    if (price_per_day === null || price_per_day === '') tool.price_per_day = null;
    else {
      const value = Number(price_per_day);
      if (!Number.isFinite(value) || value < 0) return res.status(400).json({ error: 'invalid_price' });
      tool.price_per_day = Math.round(value * 100) / 100;
    }
  }
  db.save();
  res.json({ tool });
});

router.get('/payment-methods', (_req, res) => {
  res.json({ methods: db.state.paymentMethods });
});

router.patch('/payment-methods/:code', (req, res) => {
  const method = db.findPaymentMethod(req.params.code);
  if (!method) return res.status(404).json({ error: 'payment_method_not_found' });
  const { status, instructions_es, instructions_en } = req.body || {};
  if (status !== undefined) {
    if (!['config_pending', 'active', 'disabled'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
    method.status = status;
  }
  if (instructions_es !== undefined) method.instructions_es = clean(instructions_es, 600) || null;
  if (instructions_en !== undefined) method.instructions_en = clean(instructions_en, 600) || null;
  db.save();
  res.json({ method });
});

router.get('/suppliers', (_req, res) => {
  res.json({ suppliers: db.state.suppliers });
});

router.post('/suppliers', (req, res) => {
  const name = clean(req.body?.name, 120);
  if (name.length < 2) return res.status(400).json({ error: 'invalid_name' });
  const supplier = {
    id: db.id(),
    name,
    contact: clean(req.body?.contact, 160) || null,
    services: clean(req.body?.services, 300) || null,
    notes: clean(req.body?.notes, 600) || null,
    status: 'active',
    createdAt: new Date().toISOString(),
  };
  db.state.suppliers.push(supplier);
  db.save();
  res.status(201).json({ supplier });
});

router.patch('/suppliers/:id', (req, res) => {
  const supplier = db.state.suppliers.find((item) => item.id === req.params.id);
  if (!supplier) return res.status(404).json({ error: 'supplier_not_found' });
  const { name, contact, services, notes, status } = req.body || {};
  if (name !== undefined) supplier.name = clean(name, 120) || supplier.name;
  if (contact !== undefined) supplier.contact = clean(contact, 160) || null;
  if (services !== undefined) supplier.services = clean(services, 300) || null;
  if (notes !== undefined) supplier.notes = clean(notes, 600) || null;
  if (status !== undefined) {
    if (!['active', 'inactive'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
    supplier.status = status;
  }
  db.save();
  res.json({ supplier });
});

router.delete('/suppliers/:id', (req, res) => {
  const index = db.state.suppliers.findIndex((item) => item.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: 'supplier_not_found' });
  db.state.suppliers.splice(index, 1);
  db.save();
  res.json({ ok: true });
});

router.get('/messages', (_req, res) => {
  const messages = [...db.state.messages].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.json({ messages });
});

router.patch('/messages/:id', (req, res) => {
  const message = db.state.messages.find((item) => item.id === req.params.id);
  if (!message) return res.status(404).json({ error: 'message_not_found' });
  const status = clean(req.body?.status, 20);
  if (!['open', 'answered', 'closed'].includes(status)) return res.status(400).json({ error: 'invalid_status' });
  message.status = status;
  db.save();
  res.json({ message });
});

router.patch('/settings', (req, res) => {
  const { announcement_es, announcement_en } = req.body || {};
  if (announcement_es !== undefined) db.state.settings.announcement_es = clean(announcement_es, 300) || null;
  if (announcement_en !== undefined) db.state.settings.announcement_en = clean(announcement_en, 300) || null;
  db.save();
  res.json({ settings: db.state.settings });
});

export default router;
