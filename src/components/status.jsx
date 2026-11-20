import { useI18n } from '../i18n';

const TONE = {
  received: 'badge-info',
  quoted: 'badge-info',
  awaiting_payment: 'badge-preparing',
  in_progress: 'badge-fire',
  completed: 'badge-available',
  cancelled: 'badge-paused',
};

const PAYMENT_TONE = {
  not_configured: 'badge-preparing',
  pending: 'badge-preparing',
  confirmed: 'badge-available',
  refunded: 'badge-paused',
};

export function StatusBadge({ status }) {
  const { t } = useI18n();
  return <span className={`badge ${TONE[status] || 'badge-info'}`}>{t(`status.${status}`)}</span>;
}

export function PaymentBadge({ status }) {
  const { t } = useI18n();
  return <span className={`badge ${PAYMENT_TONE[status] || 'badge-preparing'}`}>{t(`paystatus.${status}`)}</span>;
}

export function ServiceBadge({ status }) {
  const { t } = useI18n();
  const map = {
    available: 'badge-available',
    preparing: 'badge-preparing',
    paused: 'badge-paused',
  };
  return <span className={`badge ${map[status] || 'badge-preparing'}`}>{t(`common.${status}`)}</span>;
}

export function priceLabel(value, t) {
  if (value === null || value === undefined || Number.isNaN(Number(value))) return t('common.pricePending');
  return `$${Number(value).toFixed(2)} USD`;
}

export function formatDate(value, lang) {
  if (!value) return '—';
  try {
    return new Date(value).toLocaleString(lang === 'es' ? 'es-DO' : 'en-US', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return value;
  }
}
