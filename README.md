# YORIICHI PRO UNLOCK

Plataforma internacional de servicios GSM con estética cinematográfica japonesa (negro, rojo fuego, dorado y azul eléctrico), bilingüe español/inglés y paneles de cliente y administración.

> **Aviso importante:** todos los servicios se entregan marcados como **«En preparación»**. No hay proveedores, precios, cuentas bancarias ni transacciones inventadas. Los pagos y las integraciones reales se configuran después, desde el panel administrativo o mediante variables de entorno. Solo se ofrecen servicios legítimos y autorizados.

## Stack

| Capa | Tecnología |
| --- | --- |
| Frontend | React 19 + Vite 8 + React Router 7 |
| Backend | Node.js (ESM) + Express 5 |
| Persistencia | Almacén documental en archivo con escritura atómica (`tmp` + `rename`), sustituible por PostgreSQL/Supabase |
| Autenticación | Sesión en cookie `HttpOnly` firmada con HMAC-SHA256, contraseñas con `scrypt` + sal |
| Idiomas | Español e inglés (diccionario propio en `src/i18n.jsx`) |

Un único proceso Node sirve la API en `/api/*` y la interfaz compilada en `dist/`, escuchando en `0.0.0.0` y `process.env.PORT`.

## Puesta en marcha

```bash
npm install
npm run build      # compila la interfaz en dist/
npm start          # servidor en http://localhost:8080
```

Desarrollo con recarga:

```bash
npm run dev        # Vite en :5173 con proxy /api → :8080
node server/index.js
```

Verificación funcional (arranca el servidor real contra datos temporales):

```bash
npm test
```

## Variables de entorno

| Variable | Uso |
| --- | --- |
| `PORT` | Puerto HTTP (por defecto `8080`). |
| `DATA_DIR` | Directorio del archivo de datos (por defecto `./data`). En hosting sin disco persistente se reinicia con cada despliegue. |
| `ADMIN_EMAIL` | Correo del administrador real. Si se define junto a `ADMIN_PASSWORD` (mínimo 8 caracteres), reemplaza al administrador de demostración. |
| `ADMIN_PASSWORD` | Contraseña del administrador definido por entorno. |

Sin esas variables se crea un administrador de demostración (`admin@yoriichi.pro` / `Yoriichi#2026`) y el panel muestra el aviso de configuración pendiente. **Cámbialo antes de operar en producción.**

## Estructura

```
server/
  index.js            Servidor Express, cabeceras de seguridad, SPA fallback, bootstrap del admin
  db.js               Persistencia atómica + consultas (usuarios, pedidos, servicios, herramientas…)
  seed.js             Semilla de catálogo, herramientas, pagos y categorías (sin precios inventados)
  auth.js             Hash scrypt, cookie firmada, rate limiting, middlewares requireAuth/requireAdmin
  util.js             Limpieza de entradas, validaciones, códigos de pedido, eventos de estado
  routes/
    auth.js           Registro, login, logout, perfil, cambio de contraseña
    public.js         Catálogo, herramientas, pagos, ajustes, seguimiento, soporte
    account.js        Pedidos del cliente, detalle, cancelación, resumen
    admin.js          Resumen, pedidos, clientes, servicios, precios, herramientas, pagos, proveedores, mensajes, ajustes
src/
  App.jsx             Rutas y protección por rol
  i18n.jsx            Diccionarios ES/EN y hook useI18n
  auth.jsx            Contexto de sesión
  api.js              Cliente fetch con manejo de errores tipados
  components/         Layout, Logo original, OrderForm, status, ui, iconos
  pages/              Home, Catalog, CategoryPage, Tools, Credits, Track, Contact, Auth, Dashboard, Admin, NotFound
scripts/smoke-test.js Prueba end-to-end del flujo completo
```

## Vistas

Inicio · Catálogo GSM · Servicios Apple · Android y Samsung · IMEI Check · Network Unlock · Diagnóstico y recuperación autorizada FRP · Knox, KG y MDM Status · eSIM, eCode e ICCID · Firmware y recursos autorizados · Créditos y licencias · Renta de herramientas · Estado de pedidos · Contacto · Registro e inicio de sesión · Panel de clientes · Panel administrativo.

Las categorías se sirven desde el catálogo del servidor, de modo que agregar servicios no requiere tocar la interfaz.

## Renta de herramientas

UnlockTool, TSM Tool, Cell Tool, KG Tool y AMT Tool. La renta se solicita por días (1–30) y queda sujeta a confirmación de disponibilidad, sin cargos automáticos.

## Pagos

Banreservas, Banco Popular, BHD León, PayPal y Binance aparecen como **configuración pendiente**. Ningún método procesa pagos reales todavía: el panel solo permite registrar instrucciones cuando exista una cuenta verificada.

## Panel administrativo

Acceso con rol `admin` en `/admin`, con pestañas de resumen, pedidos (estado, monto, estado de pago, nota interna), clientes (rol, estado, créditos), servicios (estado y precio), herramientas (estado y tarifa diaria), métodos de pago, proveedores, mensajes de soporte y avisos del sitio. Cada cambio queda validado en el servidor y auditado en el historial del pedido.

## Contacto

- WhatsApp: +18299729672
- Telegram: +18299729672
- Correo: yoriichifrp09@gmail.com

## Seguridad

Contraseñas con `scrypt` y comparación en tiempo constante, sesiones firmadas en cookie `HttpOnly` con `SameSite=Lax`, limitación de intentos en autenticación y soporte, validación y limpieza de todas las entradas, comprobación de propiedad en pedidos de cliente, autorización por rol en `/api/admin`, cabeceras CSP/`nosniff`/`X-Frame-Options` y límite de tamaño del cuerpo JSON.

## Alcance legal

La plataforma solo admite servicios legítimos con autorización del propietario del dispositivo o del titular de la cuenta. No se ofrecen desbloqueos no autorizados, elusión de protecciones de terceros ni acceso a cuentas ajenas.
