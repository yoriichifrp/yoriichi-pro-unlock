import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../i18n';

/** Revela contenido al entrar en el viewport. */
export function Reveal({ children, delay = 0, as: Tag = 'div', className = '', ...rest }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      setVisible(true);
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${visible ? 'is-visible' : ''} ${className}`.trim()}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export function StatusBadge({ status }) {
  const { t } = useI18n();
  const map = {
    preparing: { cls: 'badge-preparing', key: 'common.preparing' },
    available: { cls: 'badge-available', key: 'common.available' },
    paused: { cls: 'badge-paused', key: 'common.paused' },
  };
  const entry = map[status] || map.preparing;
  return (
    <span className={`badge ${entry.cls}`}>
      <span className="dot" />
      {t(entry.key)}
    </span>
  );
}

export function OrderStatusBadge({ status }) {
  const { t } = useI18n();
  const cls = {
    received: 'badge-info',
    quoted: 'badge-preparing',
    awaiting_payment: 'badge-preparing',
    in_progress: 'badge-fire',
    completed: 'badge-available',
    cancelled: 'badge-paused',
  }[status] || 'badge-paused';
  return (
    <span className={`badge ${cls}`}>
      <span className="dot" />
      {t(`status.${status}`)}
    </span>
  );
}

export function SectionHead({ eyebrow, title, sub, children }) {
  return (
    <Reveal className="section-head">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title">{title}</h2>
      {sub && <p className="section-sub">{sub}</p>}
      {children}
    </Reveal>
  );
}

export function Field({ label, hint, children }) {
  return (
    <div className="field">
      {label && <label>{label}</label>}
      {children}
      {hint && <span className="hint">{hint}</span>}
    </div>
  );
}

export function Alert({ kind = 'info', children }) {
  if (!children) return null;
  return <div className={`alert alert-${kind}`}>{children}</div>;
}

export function Spinner() {
  return <div className="spinner" role="status" aria-label="loading" />;
}

export function Modal({ title, subtitle, onClose, children }) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-label={title}>
        <div className="modal-head">
          <div>
            <h3 className="panel-title">{title}</h3>
            {subtitle && <p className="small muted mt-1">{subtitle}</p>}
          </div>
          <button type="button" className="modal-close" onClick={onClose} aria-label="close">
            ✕
          </button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

export function CopyChip({ value, label }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };
  return (
    <button type="button" className="code-chip" onClick={copy} title={label || t('common.copy')}>
      {value}
      <span className="small" style={{ letterSpacing: 0 }}>
        {copied ? t('common.copied') : t('common.copy')}
      </span>
    </button>
  );
}

export function formatDate(value, lang) {
  if (!value) return '—';
  try {
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : 'es-DO', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(new Date(value));
  } catch {
    return value;
  }
}

export function money(value) {
  if (value === null || value === undefined) return null;
  return `US$ ${Number(value).toFixed(2)}`;
}
