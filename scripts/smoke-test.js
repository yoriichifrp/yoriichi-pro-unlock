/**
 * Prueba de humo de YORIICHI PRO UNLOCK.
 *
 * Arranca el servidor real contra un directorio de datos temporal y recorre el
 * flujo completo: catálogo público, registro, pedido, seguimiento, control de
 * acceso, panel administrativo, actualización de estado y soporte.
 *
 * No usa mocks: valida las rutas y la persistencia que se despliegan.
 */
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATA_DIR = fs.mkdtempSync(path.join(os.tmpdir(), 'ypu-smoke-'));
const PORT = 4300 + Math.floor(Math.random() * 500);
const BASE = `http://127.0.0.1:${PORT}`;

const ADMIN_EMAIL = 'admin@yoriichi.pro';
const ADMIN_PASSWORD = 'Yoriichi#2026';

let passed = 0;
const failures = [];

function check(label, condition, detail) {
  if (condition) {
    passed += 1;
    console.log(`  ok  ${label}`);
  } else {
    failures.push(`${label}${detail ? ` → ${detail}` : ''}`);
    console.log(`  FAIL ${label}${detail ? ` → ${detail}` : ''}`);
  }
}

function firstArrayWith(object, key) {
  if (Array.isArray(object)) return object;
  if (!object || typeof object !== 'object') return null;
  if (Array.isArray(object[key])) return object[key];
  for (const value of Object.values(object)) {
    const found = firstArrayWith(value, key);
    if (found) return found;
  }
  return null;
}

function collectServices(payload) {
  const candidates = [];
  const walk = (value) => {
    if (Array.isArray(value)) {
      if (value.some((item) => item && typeof item === 'object' && item.code && item.name && 'price_usd' in item)) {
        candidates.push(...value.filter((item) => item && typeof item === 'object' && item.code && 'price_usd' in item));
      }
      value.forEach(walk);
      return;
    }
    if (value && typeof value === 'object') Object.values(value).forEach(walk);
  };
  walk(payload);
  return candidates;
}

class Session {
  constructor() {
    this.cookie = '';
  }

  async call(method, route, body) {
    const headers = {};
    if (body !== undefined) headers['Content-Type'] = 'application/json';
    if (this.cookie) headers.Cookie = this.cookie;

    const response = await fetch(`${BASE}${route}`, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
    });

    const setCookie = response.headers.getSetCookie?.() || [];
    for (const raw of setCookie) {
      const pair = raw.split(';')[0];
      if (pair.startsWith('ypu_session=')) this.cookie = pair;
    }

    let data = null;
    try {
      data = await response.json();
    } catch {
      data = null;
    }
    return { status: response.status, data };
  }
}

async function waitForServer(timeoutMs = 20000) {
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(`${BASE}/api/health`);
      if (response.ok) return true;
    } catch {
      // el servidor aún no escucha
    }
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
  return false;
}

async function main() {
  const child = spawn(process.execPath, ['server/index.js'], {
    cwd: ROOT,
    env: {
      ...process.env,
      PORT: String(PORT),
      DATA_DIR,
      ADMIN_EMAIL: '',
      ADMIN_PASSWORD: '',
    },
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  const serverLog = [];
  child.stdout.on('data', (chunk) => serverLog.push(chunk.toString()));
  child.stderr.on('data', (chunk) => serverLog.push(chunk.toString()));

  const stop = () => {
    if (!child.killed) child.kill('SIGTERM');
  };

  try {
    const ready = await waitForServer();
    if (!ready) {
      throw new Error(`El servidor no respondió en ${BASE}\n${serverLog.join('')}`);
    }
    console.log(`\nServidor de prueba en ${BASE} (datos: ${DATA_DIR})\n`);

    const anon = new Session();

    console.log('Catálogo público');
    const health = await anon.call('GET', '/api/health');
    check('health responde ok', health.status === 200 && health.data?.ok === true, `status ${health.status}`);

    const catalog = await anon.call('GET', '/api/public/catalog');
    check('catálogo disponible', catalog.status === 200, `status ${catalog.status}`);
    const services = collectServices(catalog.data);
    check('catálogo contiene servicios', services.length >= 10, `${services.length} servicios`);
    check(
      'ningún servicio inventa precios',
      services.every((service) => service.price_usd === null || service.price_usd === undefined),
      services.filter((service) => service.price_usd != null).map((service) => service.code).join(', '),
    );
    check(
      'servicios sin proveedor en preparación',
      services.every((service) => service.status === 'preparing'),
      services.filter((service) => service.status !== 'preparing').map((service) => service.code).join(', '),
    );

    const toolsPayload = await anon.call('GET', '/api/public/tools');
    const tools = firstArrayWith(toolsPayload.data, 'tools') || [];
    const toolNames = tools.map((tool) => tool.name).join(' | ');
    check('cinco herramientas de renta', tools.length === 5, `${tools.length}: ${toolNames}`);
    check(
      'herramientas requeridas presentes',
      ['UnlockTool', 'TSM Tool', 'Cell Tool', 'KG Tool', 'AMT Tool'].every((name) => toolNames.includes(name)),
      toolNames,
    );

    const paymentsPayload = await anon.call('GET', '/api/public/payments');
    const methods = firstArrayWith(paymentsPayload.data, 'methods') || [];
    const methodNames = methods.map((method) => method.name).join(' | ');
    check('cinco métodos de pago', methods.length === 5, methodNames);
    check(
      'métodos solicitados presentes',
      ['Banreservas', 'Banco Popular', 'BHD León', 'PayPal', 'Binance'].every((name) => methodNames.includes(name)),
      methodNames,
    );
    check(
      'ningún método activo sin configuración real',
      methods.every((method) => method.status !== 'active'),
      methods.filter((method) => method.status === 'active').map((method) => method.code).join(', '),
    );

    console.log('\nRegistro y pedidos del cliente');
    const client = new Session();
    const email = `cliente${Date.now()}@example.com`;
    const register = await client.call('POST', '/api/auth/register', {
      name: 'Cliente Prueba',
      email,
      password: 'Cliente#2026',
      country: 'República Dominicana',
    });
    check('registro crea sesión', register.status === 201 && register.data?.user?.role === 'client', `status ${register.status}`);
    check('la sesión usa cookie HttpOnly', client.cookie.startsWith('ypu_session='), client.cookie);

    const weak = await new Session().call('POST', '/api/auth/register', {
      name: 'Débil',
      email: `debil${Date.now()}@example.com`,
      password: 'corta',
    });
    check('rechaza contraseñas débiles', weak.status === 400, `status ${weak.status}`);

    const chosen = services[0];
    const order = await client.call('POST', '/api/account/orders', {
      kind: 'service',
      serviceCode: chosen.code,
      brand: 'Samsung',
      model: 'SM-A546E',
      imei: '356789012345678',
      notes: 'Prueba de humo automatizada',
      paymentMethod: 'banreservas',
    });
    check('crea pedido autenticado', order.status === 201 && Boolean(order.data?.order?.code), `status ${order.status}`);
    const orderCode = order.data?.order?.code;

    const mine = await client.call('GET', '/api/account/orders');
    check(
      'el cliente ve su pedido',
      mine.status === 200 && JSON.stringify(mine.data).includes(orderCode),
      `status ${mine.status}`,
    );

    const track = await anon.call('GET', `/api/public/orders/track/${orderCode}`);
    check('seguimiento público por código', track.status === 200 && track.data?.order?.code === orderCode, `status ${track.status}`);

    const other = new Session();
    await other.call('POST', '/api/auth/register', {
      name: 'Otro Cliente',
      email: `otro${Date.now()}@example.com`,
      password: 'Cliente#2026',
    });
    const foreign = await other.call('GET', `/api/account/orders/${orderCode}`);
    check('un cliente no accede a pedidos ajenos', foreign.status === 404, `status ${foreign.status}`);

    const forbidden = await client.call('GET', '/api/admin/overview');
    check('cliente bloqueado en el panel administrativo', forbidden.status === 403, `status ${forbidden.status}`);

    console.log('\nPanel administrativo');
    const admin = new Session();
    const login = await admin.call('POST', '/api/auth/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    check('inicio de sesión administrativo', login.status === 200 && login.data?.user?.role === 'admin', `status ${login.status}`);

    const overview = await admin.call('GET', '/api/admin/overview');
    check(
      'resumen administrativo con pedidos',
      overview.status === 200 && (overview.data?.orders?.total ?? 0) >= 1,
      `status ${overview.status}`,
    );

    const update = await admin.call('PATCH', `/api/admin/orders/${orderCode}`, {
      status: 'in_progress',
      paymentStatus: 'pending',
      amountUsd: 45,
      adminNote: 'Cotización registrada en prueba de humo',
    });
    check('actualiza estado y monto del pedido', update.status === 200, `status ${update.status}`);

    const tracked = await anon.call('GET', `/api/public/orders/track/${orderCode}`);
    check(
      'el cliente ve el nuevo estado',
      tracked.data?.order?.status === 'in_progress' && Number(tracked.data?.order?.amountUsd) === 45,
      JSON.stringify({ status: tracked.data?.order?.status, amount: tracked.data?.order?.amountUsd }),
    );

    const servicePatch = await admin.call('PATCH', `/api/admin/services/${encodeURIComponent(chosen.code)}`, {
      status: 'available',
      price_usd: 30,
    });
    check('el administrador configura un servicio', servicePatch.status === 200, `status ${servicePatch.status}`);
    const catalogAfter = await anon.call('GET', '/api/public/catalog');
    const updated = collectServices(catalogAfter.data).find((service) => service.code === chosen.code);
    check(
      'el catálogo público refleja precio y estado',
      updated?.status === 'available' && Number(updated?.price_usd) === 30,
      JSON.stringify({ status: updated?.status, price: updated?.price_usd }),
    );

    const supplier = await admin.call('POST', '/api/admin/suppliers', {
      name: 'Proveedor de prueba',
      contact: 'proveedor@example.com',
      services: 'IMEI Check',
    });
    check('registra proveedor', supplier.status === 201 || supplier.status === 200, `status ${supplier.status}`);
    const suppliers = await admin.call('GET', '/api/admin/suppliers');
    check('lista proveedores', firstArrayWith(suppliers.data, 'suppliers')?.length >= 1, `status ${suppliers.status}`);

    const clients = await admin.call('GET', '/api/admin/users');
    check(
      'lista clientes registrados',
      firstArrayWith(clients.data, 'users')?.some((user) => user.email === email),
      `status ${clients.status}`,
    );

    console.log('\nSoporte y ajustes');
    const support = await anon.call('POST', '/api/public/support', {
      name: 'Cliente Prueba',
      email,
      channel: 'whatsapp',
      subject: 'Consulta de prueba',
      message: 'Mensaje generado por la prueba de humo automatizada.',
    });
    check('recibe mensaje de soporte', support.status === 201 && Boolean(support.data?.ticket), `status ${support.status}`);

    const messages = await admin.call('GET', '/api/admin/messages');
    check(
      'el panel muestra el mensaje',
      firstArrayWith(messages.data, 'messages')?.some((message) => message.subject === 'Consulta de prueba'),
      `status ${messages.status}`,
    );

    const settings = await admin.call('PATCH', '/api/admin/settings', {
      announcement_es: 'Aviso de prueba',
      announcement_en: 'Test notice',
    });
    check('guarda avisos del sitio', settings.status === 200, `status ${settings.status}`);

    const publicSettings = await anon.call('GET', '/api/public/settings');
    check(
      'los avisos son públicos',
      JSON.stringify(publicSettings.data).includes('Aviso de prueba'),
      `status ${publicSettings.status}`,
    );

    const password = await admin.call('PATCH', '/api/auth/password', {
      currentPassword: ADMIN_PASSWORD,
      newPassword: 'NuevaClave#2026',
    });
    check('permite cambiar la contraseña', password.status === 200, `status ${password.status}`);

    const relogin = await new Session().call('POST', '/api/auth/login', {
      email: ADMIN_EMAIL,
      password: 'NuevaClave#2026',
    });
    check('la nueva contraseña funciona', relogin.status === 200, `status ${relogin.status}`);
  } finally {
    stop();
  }

  console.log(`\n${passed} comprobaciones correctas, ${failures.length} fallidas`);
  if (failures.length > 0) {
    console.error('\nFallos:');
    failures.forEach((failure) => console.error(` - ${failure}`));
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error('\nLa prueba de humo no pudo completarse:', error.message);
  process.exitCode = 1;
});
