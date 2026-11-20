import crypto from 'node:crypto';

export const ORDER_STATUSES = [
  'received',
  'quoted',
  'awaiting_payment',
  'in_progress',
  'completed',
  'cancelled',
];

export const PAYMENT_STATUSES = ['not_configured', 'pending', 'confirmed', 'refunded'];

export function clean(value, max = 400) {
  if (value === null || value === undefined) return '';
  return String(value).replace(/[\u0000-\u001f\u007f]/g, ' ').trim().slice(0, max);
}

export function isEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(String(value || '').trim());
}

export function isPassword(value) {
  const text = String(value || '');
  return text.length >= 8 && text.length <= 200;
}

export function orderCode() {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 6; i += 1) suffix += alphabet[crypto.randomInt(alphabet.length)];
  return `YPU-${suffix}`;
}

export function uniqueOrderCode(exists) {
  for (let attempt = 0; attempt < 20; attempt += 1) {
    const code = orderCode();
    if (!exists(code)) return code;
  }
  return `YPU-${Date.now().toString(36).toUpperCase()}`;
}

export function appendEvent(order, status, note, by) {
  order.events = Array.isArray(order.events) ? order.events : [];
  order.events.push({ status, note: note || null, by: by || 'system', at: new Date().toISOString() });
  order.updatedAt = new Date().toISOString();
}

export function publicOrder(order) {
  return {
    code: order.code,
    kind: order.kind,
    status: order.status,
    serviceCode: order.serviceCode,
    serviceName: order.serviceName,
    device: order.device,
    amountUsd: order.amountUsd,
    paymentMethod: order.paymentMethod,
    paymentStatus: order.paymentStatus,
    adminNote: order.adminNote || null,
    events: order.events || [],
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
  };
}

export function adminOrder(order) {
  return {
    ...publicOrder(order),
    userId: order.userId,
    userEmail: order.userEmail,
    userName: order.userName,
  };
}
