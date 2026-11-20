/**
 * Capa de persistencia de YORIICHI PRO UNLOCK.
 *
 * Almacén documental en archivo con escritura atómica (tmp + rename) y carga
 * completa en memoria. La interfaz (`db.state`, `db.save()`) está aislada para
 * poder sustituirse por PostgreSQL o Supabase sin tocar las rutas.
 */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { ensureSeed } from './seed.js';

const DATA_DIR = process.env.DATA_DIR || path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'yoriichi.json');

const emptyState = () => ({
  meta: { version: 1, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  settings: { announcement_es: null, announcement_en: null, sessionSecret: null },
  users: [],
  orders: [],
  messages: [],
  suppliers: [],
  categories: [],
  services: [],
  tools: [],
  paymentMethods: [],
});

let state = emptyState();
let ready = false;

function persist() {
  state.meta.updatedAt = new Date().toISOString();
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const tmp = `${DB_FILE}.${process.pid}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, DB_FILE);
}

function load() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  if (fs.existsSync(DB_FILE)) {
    try {
      const parsed = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
      state = { ...emptyState(), ...parsed, settings: { ...emptyState().settings, ...(parsed.settings || {}) } };
    } catch (error) {
      const backup = `${DB_FILE}.corrupt-${Date.now()}`;
      fs.renameSync(DB_FILE, backup);
      console.error(`[db] archivo ilegible, respaldo en ${backup}: ${error.message}`);
      state = emptyState();
    }
  }
  if (!state.settings.sessionSecret) {
    state.settings.sessionSecret = crypto.randomBytes(48).toString('hex');
  }
  ensureSeed(state);
  persist();
  ready = true;
}

load();

export const db = {
  get state() {
    return state;
  },
  get isReady() {
    return ready;
  },
  save: persist,
  id: () => crypto.randomUUID(),
  findUserByEmail(email) {
    const normalized = String(email || '').trim().toLowerCase();
    return state.users.find((user) => user.email === normalized) || null;
  },
  findUserById(id) {
    return state.users.find((user) => user.id === id) || null;
  },
  findOrder(code) {
    const normalized = String(code || '').trim().toUpperCase();
    return state.orders.find((order) => order.code === normalized) || null;
  },
  findService(code) {
    return state.services.find((service) => service.code === code) || null;
  },
  findTool(code) {
    return state.tools.find((tool) => tool.code === code) || null;
  },
  findPaymentMethod(code) {
    return state.paymentMethods.find((method) => method.code === code) || null;
  },
};

export { DATA_DIR, DB_FILE };
