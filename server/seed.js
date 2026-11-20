/**
 * Catálogo semilla de YORIICHI PRO UNLOCK.
 *
 * Regla de negocio: no se inventan proveedores, precios ni cuentas.
 * Todo servicio nace con status "preparing" (En preparación) y price_usd = null
 * hasta que un administrador configure un proveedor real y su tarifa.
 */

export const CATEGORIES = [
  {
    slug: 'apple',
    name_es: 'Servicios Apple',
    name_en: 'Apple Services',
    tagline_es: 'Informes y verificaciones para iPhone, iPad y Mac.',
    tagline_en: 'Reports and verifications for iPhone, iPad and Mac.',
    icon: 'apple',
    accent: 'gold',
    sort: 1,
  },
  {
    slug: 'android',
    name_es: 'Servicios Android y Samsung',
    name_en: 'Android & Samsung Services',
    tagline_es: 'Lecturas técnicas, CSC, bootloader y diagnóstico.',
    tagline_en: 'Technical reads, CSC, bootloader and diagnostics.',
    icon: 'android',
    accent: 'fire',
    sort: 2,
  },
  {
    slug: 'imei',
    name_es: 'IMEI Check',
    name_en: 'IMEI Check',
    tagline_es: 'Validación de IMEI, TAC y estado en listas de bloqueo.',
    tagline_en: 'IMEI, TAC and blacklist status validation.',
    icon: 'imei',
    accent: 'blue',
    sort: 3,
  },
  {
    slug: 'network',
    name_es: 'Network Unlock',
    name_en: 'Network Unlock',
    tagline_es: 'Elegibilidad y liberación de operador.',
    tagline_en: 'Carrier eligibility and unlock requests.',
    icon: 'network',
    accent: 'blue',
    sort: 4,
  },
  {
    slug: 'frp',
    name_es: 'Diagnóstico y recuperación autorizada FRP',
    name_en: 'FRP Diagnostics & Authorized Recovery',
    tagline_es: 'Solo con comprobante de propiedad del dispositivo.',
    tagline_en: 'Ownership proof required, always.',
    icon: 'shield',
    accent: 'fire',
    sort: 5,
  },
  {
    slug: 'knox',
    name_es: 'Knox, KG y MDM Status',
    name_en: 'Knox, KG & MDM Status',
    tagline_es: 'Estados de garantía Knox, Knox Guard y MDM.',
    tagline_en: 'Knox warranty, Knox Guard and MDM states.',
    icon: 'lock',
    accent: 'gold',
    sort: 6,
  },
  {
    slug: 'esim',
    name_es: 'eSIM, eCode e ICCID',
    name_en: 'eSIM, eCode & ICCID',
    tagline_es: 'Compatibilidad, activación y lectura de perfiles.',
    tagline_en: 'Compatibility, activation and profile reads.',
    icon: 'sim',
    accent: 'blue',
    sort: 7,
  },
  {
    slug: 'firmware',
    name_es: 'Firmware y recursos autorizados',
    name_en: 'Firmware & Authorized Resources',
    tagline_es: 'Firmware oficial, compatibilidad y guías técnicas.',
    tagline_en: 'Official firmware, compatibility and technical guides.',
    icon: 'chip',
    accent: 'gold',
    sort: 8,
  },
];

const svc = (code, category, name, descEs, descEn) => ({
  code,
  category,
  name,
  desc_es: descEs,
  desc_en: descEn,
  status: 'preparing',
  price_usd: null,
  delivery_es: 'Tiempo estimado pendiente de configuración del proveedor.',
  delivery_en: 'Estimated delivery pending provider configuration.',
});

export const SERVICES = [
  // Apple
  svc('apple-imei-gsx', 'apple', 'Apple IMEI / GSX Report',
    'Informe técnico de IMEI Apple con modelo, garantía y estado de activación.',
    'Apple IMEI technical report with model, warranty and activation status.'),
  svc('apple-activation-lock', 'apple', 'Activation Lock Status',
    'Verificación del estado de Activation Lock con comprobante de propiedad.',
    'Activation Lock status verification with proof of ownership.'),
  svc('apple-carrier-lock', 'apple', 'Carrier Lock Status',
    'Estado de bloqueo de operador y política de liberación del equipo.',
    'Carrier lock state and device unlock policy.'),
  svc('apple-model-lookup', 'apple', 'Model & Capacity Lookup',
    'Identificación de modelo, capacidad, color y región por IMEI o serie.',
    'Model, capacity, color and region identification by IMEI or serial.'),
  svc('apple-warranty', 'apple', 'Warranty & Coverage Check',
    'Cobertura vigente, tipo de garantía y fecha estimada de expiración.',
    'Active coverage, warranty type and estimated expiration date.'),
  svc('apple-parts-history', 'apple', 'Parts & Service History',
    'Historial de piezas y servicios registrados para el dispositivo.',
    'Recorded parts and service history for the device.'),

  // Android / Samsung
  svc('samsung-model-report', 'android', 'Samsung Model Report',
    'Modelo exacto, CSC, región y versión de firmware del equipo.',
    'Exact model, CSC, region and device firmware version.'),
  svc('samsung-csc-info', 'android', 'CSC / Region Information',
    'Lectura de CSC activo y regiones compatibles para el modelo.',
    'Active CSC read and compatible regions for the model.'),
  svc('android-root-status', 'android', 'Root & Bootloader Status',
    'Estado de root, bootloader y modificaciones del sistema.',
    'Root, bootloader and system modification state.'),
  svc('android-diagnostic', 'android', 'Android Technical Diagnostic',
    'Diagnóstico guiado de hardware y software con informe técnico.',
    'Guided hardware and software diagnostic with technical report.'),
  svc('android-backup-migration', 'android', 'Backup & Migration Assistance',
    'Acompañamiento en respaldo y migración de datos del dispositivo.',
    'Assistance with device backup and data migration.'),
  svc('samsung-frp-check', 'android', 'Samsung FRP Eligibility Review',
    'Revisión previa de elegibilidad FRP con documentación del titular.',
    'Prior FRP eligibility review with owner documentation.'),

  // IMEI
  svc('imei-basic', 'imei', 'IMEI Basic Check',
    'Validación de formato, TAC y coherencia del IMEI reportado.',
    'Format, TAC and consistency validation of the reported IMEI.'),
  svc('imei-full', 'imei', 'IMEI Full Report',
    'Informe ampliado de operador, modelo y garantía cuando el proveedor esté habilitado.',
    'Extended carrier, model and warranty report once the provider is enabled.'),
  svc('imei-blacklist', 'imei', 'Blacklist / Lost & Stolen Status',
    'Consulta de listas de bloqueo y reportes de pérdida o robo.',
    'Blacklist, lost and stolen report lookup.'),
  svc('imei-tac', 'imei', 'TAC & Model Identification',
    'Identificación de fabricante y modelo a partir del TAC.',
    'Manufacturer and model identification from the TAC.'),
  svc('imei-bulk', 'imei', 'Bulk IMEI Verification',
    'Verificación por lotes para talleres y distribuidores autorizados.',
    'Batch verification for authorized workshops and distributors.'),

  // Network Unlock
  svc('net-lock-check', 'network', 'Carrier Lock Check',
    'Confirmación del operador que bloquea el dispositivo.',
    'Confirmation of the carrier locking the device.'),
  svc('net-eligibility', 'network', 'Unlock Eligibility Review',
    'Revisión de contrato, saldo y política de liberación del operador.',
    'Contract, balance and carrier unlock policy review.'),
  svc('net-unlock-request', 'network', 'Network Unlock Request',
    'Solicitud de liberación sujeta a elegibilidad y aprobación del operador.',
    'Unlock request subject to carrier eligibility and approval.'),
  svc('net-apn', 'network', 'APN & Data Configuration',
    'Configuración de APN, MMS y datos móviles por operador.',
    'APN, MMS and mobile data configuration per carrier.'),
  svc('net-signal', 'network', 'Signal & Bands Diagnostic',
    'Diagnóstico de bandas, señal y cobertura del dispositivo.',
    'Device band, signal and coverage diagnostic.'),

  // FRP autorizado
  svc('frp-eligibility', 'frp', 'FRP Eligibility Review',
    'Verificación documental del titular antes de cualquier proceso.',
    'Documentary verification of the owner before any process.'),
  svc('frp-authorized-recovery', 'frp', 'Authorized FRP Recovery',
    'Recuperación autorizada únicamente con comprobante de propiedad válido.',
    'Authorized recovery only with valid proof of ownership.'),
  svc('frp-diagnostic', 'frp', 'Remote FRP Diagnostic',
    'Diagnóstico remoto guiado para identificar el estado del equipo.',
    'Guided remote diagnostic to identify the device state.'),
  svc('frp-account-guidance', 'frp', 'Account Recovery Guidance',
    'Orientación para recuperar la cuenta del titular por canales oficiales.',
    'Guidance to recover the owner account through official channels.'),
  svc('frp-report', 'frp', 'Post-Service Technical Report',
    'Informe técnico posterior al servicio con verificaciones realizadas.',
    'Post-service technical report with the performed verifications.'),

  // Knox / KG / MDM
  svc('knox-warranty', 'knox', 'Knox Warranty Status',
    'Estado de Knox Warranty Bit (0x0 / 0x1) y su implicación.',
    'Knox Warranty Bit state (0x0 / 0x1) and its implication.'),
  svc('knox-kg-state', 'knox', 'KG State Check',
    'Estado de Knox Guard: activo, completado o pendiente.',
    'Knox Guard state: active, completed or pending.'),
  svc('knox-mdm-status', 'knox', 'MDM Enrollment Status',
    'Verificación de inscripción MDM y perfil empresarial activo.',
    'MDM enrollment and active enterprise profile verification.'),
  svc('knox-mdm-release', 'knox', 'Authorized MDM Release',
    'Desvinculación autorizada con permiso escrito del titular o de la empresa.',
    'Authorized release with written permission from the owner or company.'),
  svc('knox-report', 'knox', 'Knox Technical Report',
    'Informe consolidado de Knox, KG y MDM para el equipo.',
    'Consolidated Knox, KG and MDM report for the device.'),

  // eSIM
  svc('esim-compatibility', 'esim', 'eSIM Compatibility Check',
    'Confirmación de compatibilidad eSIM por modelo y región.',
    'eSIM compatibility confirmation by model and region.'),
  svc('esim-activation', 'esim', 'eSIM Activation Support',
    'Acompañamiento en la activación del perfil con el operador.',
    'Assistance activating the profile with the carrier.'),
  svc('esim-ecode', 'esim', 'eCode / SM-DP+ Lookup',
    'Lectura de eCode y datos del servidor SM-DP+ del operador.',
    'eCode read and carrier SM-DP+ server data.'),
  svc('esim-iccid', 'esim', 'ICCID & EID Read',
    'Lectura de ICCID y EID del dispositivo con verificación.',
    'Device ICCID and EID read with verification.'),
  svc('esim-transfer', 'esim', 'eSIM Transfer Between Devices',
    'Traslado del perfil eSIM entre dispositivos compatibles.',
    'eSIM profile transfer between compatible devices.'),

  // Firmware
  svc('fw-official', 'firmware', 'Official Firmware by Model',
    'Localización de firmware oficial correspondiente al modelo y CSC.',
    'Official firmware lookup for the model and CSC.'),
  svc('fw-compatibility', 'firmware', 'Firmware Compatibility Review',
    'Validación de compatibilidad antes de cualquier actualización.',
    'Compatibility validation before any update.'),
  svc('fw-flash-guide', 'firmware', 'Authorized Flash Guidance',
    'Guía técnica de flasheo autorizado con respaldo previo obligatorio.',
    'Authorized flash guidance with mandatory prior backup.'),
  svc('fw-backup', 'firmware', 'Pre-Flash Backup',
    'Respaldo de datos y configuración antes de intervenir el equipo.',
    'Data and configuration backup before servicing the device.'),
  svc('fw-manuals', 'firmware', 'Technical Manuals & Resources',
    'Manuales y recursos técnicos autorizados por fabricante.',
    'Manufacturer-authorized technical manuals and resources.'),
];

export const TOOLS = [
  {
    code: 'unlocktool',
    name: 'UnlockTool',
    desc_es: 'Licencia de herramienta multiplataforma para servicio técnico autorizado.',
    desc_en: 'Multi-platform tool license for authorized technical service.',
    status: 'preparing',
    price_per_day: null,
    availability: 'config_pending',
  },
  {
    code: 'tsm-tool',
    name: 'TSM Tool',
    desc_es: 'Herramienta de servicio Samsung con licencia oficial requerida.',
    desc_en: 'Samsung service tool requiring an official license.',
    status: 'preparing',
    price_per_day: null,
    availability: 'config_pending',
  },
  {
    code: 'cell-tool',
    name: 'Cell Tool',
    desc_es: 'Herramienta de diagnóstico y servicio celular por días de renta.',
    desc_en: 'Cellular diagnostic and service tool rented by the day.',
    status: 'preparing',
    price_per_day: null,
    availability: 'config_pending',
  },
  {
    code: 'kg-tool',
    name: 'KG Tool',
    desc_es: 'Herramienta especializada en Knox Guard para técnicos acreditados.',
    desc_en: 'Knox Guard specialist tool for accredited technicians.',
    status: 'preparing',
    price_per_day: null,
    availability: 'config_pending',
  },
  {
    code: 'amt-tool',
    name: 'AMT Tool',
    desc_es: 'Herramienta de servicio avanzado con activación por licencia.',
    desc_en: 'Advanced service tool with license activation.',
    status: 'preparing',
    price_per_day: null,
    availability: 'config_pending',
  },
];

export const PAYMENT_METHODS = [
  { code: 'banreservas', name: 'Banreservas', kind: 'bank', status: 'config_pending', sort: 1 },
  { code: 'banco-popular', name: 'Banco Popular', kind: 'bank', status: 'config_pending', sort: 2 },
  { code: 'bhd-leon', name: 'BHD León', kind: 'bank', status: 'config_pending', sort: 3 },
  { code: 'paypal', name: 'PayPal', kind: 'online', status: 'config_pending', sort: 4 },
  { code: 'binance', name: 'Binance', kind: 'crypto', status: 'config_pending', sort: 5 },
];

/** Inserta o actualiza la semilla sin destruir ediciones administrativas. */
export function ensureSeed(state) {
  const byCode = (list, code) => list.find((item) => item.code === code);

  for (const category of CATEGORIES) {
    const existing = state.categories.find((item) => item.slug === category.slug);
    if (existing) Object.assign(existing, { ...category, sort: existing.sort ?? category.sort });
    else state.categories.push({ ...category });
  }

  for (const service of SERVICES) {
    const existing = byCode(state.services, service.code);
    if (existing) {
      existing.name = service.name;
      existing.category = service.category;
      existing.desc_es = existing.desc_es || service.desc_es;
      existing.desc_en = existing.desc_en || service.desc_en;
    } else {
      state.services.push({ ...service, id: service.code });
    }
  }

  for (const tool of TOOLS) {
    const existing = byCode(state.tools, tool.code);
    if (existing) Object.assign(existing, { name: tool.name, desc_es: existing.desc_es || tool.desc_es, desc_en: existing.desc_en || tool.desc_en });
    else state.tools.push({ ...tool, id: tool.code });
  }

  for (const method of PAYMENT_METHODS) {
    const existing = byCode(state.paymentMethods, method.code);
    if (existing) {
      existing.name = method.name;
      existing.kind = method.kind;
      existing.sort = existing.sort ?? method.sort;
    } else {
      state.paymentMethods.push({ ...method, instructions_es: null, instructions_en: null });
    }
  }
}
