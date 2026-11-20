import { useState } from 'react';
import { useI18n } from '../i18n';
import { api } from '../api';
import { PaymentBadge, StatusBadge, formatDate } from '../components/status';

export default function Track() {
  const { t, lang } = useI18n();
  const [code, setCode] = useState('');
  const [order, setOrder] = useState(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const describeError = (thrown) => {
    const key = `error.${thrown.code || 'generic'}`;
    const text = t(key);
    return text === key ? thrown.message : text;
  };

  const search = async (event) => {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setBusy(true);
    setError('');
    setOrder(null);
    try {
      const data = await api.get(`/public/orders/track/${encodeURIComponent(value)}`);
      setOrder(data.order || data);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.track')}</span>
        <h1 className="section-title">{t('track.title')}</h1>
        <p className="section-sub">{t('track.sub')}</p>

        <form className="panel mt-4" onSubmit={search}>
          <div className="field">
            <label htmlFor="track-code">{t('track.codeLabel')}</label>
            <div className="row">
              <input
                id="track-code"
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder={t('track.codePlaceholder')}
                maxLength={20}
                autoComplete="off"
              />
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy ? t('common.loading') : t('track.search')}
              </button>
            </div>
            <p className="hint">{t('track.hint')}</p>
          </div>
        </form>

        {error ? <div className="alert alert-error mt-3">{error}</div> : null}

        {order ? (
          <div className="grid-2 mt-4">
            <div className="panel">
              <div className="between">
                <h2 className="panel-title">{order.serviceName}</h2>
                <StatusBadge status={order.status} />
              </div>
              <div className="code-chip mt-2">{order.code}</div>
              <div className="stack mt-3">
                <div className="between">
                  <span className="muted small">{t('track.device')}</span>
                  <span>{order.device?.brand} {order.device?.model}</span>
                </div>
                <div className="between">
                  <span className="muted small">{t('track.amount')}</span>
                  <span>{order.amountUsd == null ? t('common.pricePending') : `$${Number(order.amountUsd).toFixed(2)} USD`}</span>
                </div>
                <div className="between">
                  <span className="muted small">{t('track.payment')}</span>
                  <PaymentBadge status={order.paymentStatus} />
                </div>
                <div className="between">
                  <span className="muted small">{t('track.created')}</span>
                  <span className="small">{formatDate(order.createdAt, lang)}</span>
                </div>
                <div className="between">
                  <span className="muted small">{t('track.updated')}</span>
                  <span className="small">{formatDate(order.updatedAt, lang)}</span>
                </div>
              </div>
              {order.adminNote ? <p className="hint mt-3">{order.adminNote}</p> : null}
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">{t('track.timeline')}</h2>
              </div>
              <div className="timeline">
                {(order.events || []).map((event, index) => (
                  <div className="timeline-item" key={`${event.at}-${index}`}>
                    <div className="between">
                      <strong className="small">{t(`status.${event.status}`)}</strong>
                      <span className="small muted">{formatDate(event.at, lang)}</span>
                    </div>
                    {event.note ? <p className="small muted">{event.note}</p> : null}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        <p className="hint mt-4">{t('track.note')}</p>
      </div>
    </section>
  );
}
