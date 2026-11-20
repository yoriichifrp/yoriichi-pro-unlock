import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';
import { priceLabel } from './status';

export function OrderForm({ kind = 'service', reference, onClose }) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [form, setForm] = useState({ brand: '', model: '', imei: '', notes: '', paymentMethod: '', days: 3 });
  const [methods, setMethods] = useState([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [created, setCreated] = useState(null);

  useEffect(() => {
    api.get('/public/payments')
      .then((data) => setMethods((data.methods || []).filter((method) => method.status === 'active')))
      .catch(() => {});
  }, []);

  const change = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const describeError = (thrown) => {
    const key = `error.${thrown.code || 'generic'}`;
    const text = t(key);
    return text === key ? thrown.message : text;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    if (!form.brand.trim() || !form.model.trim()) {
      setError(t('error.device_required'));
      return;
    }
    if (form.imei.trim() && !/^[0-9]{6,20}$/.test(form.imei.trim())) {
      setError(t('error.invalid_imei'));
      return;
    }
    setBusy(true);
    try {
      const data = await api.post('/account/orders', {
        kind,
        serviceCode: reference.code,
        brand: form.brand.trim(),
        model: form.model.trim(),
        imei: form.imei.trim(),
        notes: form.notes.trim(),
        paymentMethod: form.paymentMethod || null,
        days: Number(form.days) || 3,
      });
      setCreated(data.order || data);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={t('order.title')}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-head">
          <h3>{t('order.title')}</h3>
          <button type="button" className="modal-close" onClick={onClose} aria-label={t('common.close')}>
            ✕
          </button>
        </div>

        <div className="modal-body">
          {!user ? (
            <>
              <p>{t('order.loginRequired')}</p>
              <Link className="btn btn-primary btn-block" to="/ingresar">{t('nav.login')}</Link>
            </>
          ) : created ? (
            <>
              <div className="alert alert-success">{t('order.success')}</div>
              <p className="muted">{t('order.successBody')}</p>
              <div className="code-chip">{created.code}</div>
              <Link className="btn btn-primary btn-block mt-3" to="/panel" onClick={onClose}>
                {t('order.viewOrder')}
              </Link>
            </>
          ) : (
            <form onSubmit={submit}>
              <p className="muted small mb-3">
                {t('order.service')}: <strong>{reference.name}</strong> · {priceLabel(reference.price_usd, t)}
              </p>

              <div className="form-grid">
                <div className="field">
                  <label htmlFor="order-brand">{t('common.brand')}</label>
                  <input
                    id="order-brand"
                    value={form.brand}
                    onChange={change('brand')}
                    placeholder="Apple / Samsung / Xiaomi"
                    maxLength={40}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="order-model">{t('common.model')}</label>
                  <input
                    id="order-model"
                    value={form.model}
                    onChange={change('model')}
                    placeholder="iPhone 13 Pro / SM-G991B"
                    maxLength={60}
                    required
                  />
                </div>
              </div>

              <div className="field">
                <label htmlFor="order-imei">{t('common.imei')} <span className="muted">({t('common.optional')})</span></label>
                <input
                  id="order-imei"
                  value={form.imei}
                  onChange={change('imei')}
                  inputMode="numeric"
                  maxLength={20}
                  placeholder="000000000000000"
                />
                <p className="hint">{t('order.imeiHint')}</p>
              </div>

              {kind === 'rental' ? (
                <div className="field">
                  <label htmlFor="order-days">{t('common.days')}</label>
                  <input
                    id="order-days"
                    type="number"
                    min="1"
                    max="30"
                    value={form.days}
                    onChange={change('days')}
                  />
                </div>
              ) : null}

              <div className="field">
                <label htmlFor="order-payment">{t('common.paymentMethod')}</label>
                <select id="order-payment" value={form.paymentMethod} onChange={change('paymentMethod')}>
                  <option value="">—</option>
                  {methods.map((method) => (
                    <option value={method.code} key={method.code}>{method.name}</option>
                  ))}
                </select>
                <p className="hint">{t('order.paymentNote')}</p>
              </div>

              <div className="field">
                <label htmlFor="order-notes">{t('common.notes')}</label>
                <textarea id="order-notes" rows="3" value={form.notes} onChange={change('notes')} maxLength={600} />
              </div>

              {error ? <div className="alert alert-error">{error}</div> : null}

              <div className="card-actions">
                <button type="button" className="btn btn-ghost" onClick={onClose}>{t('common.cancel')}</button>
                <button type="submit" className="btn btn-primary" disabled={busy}>
                  {busy ? t('common.saving') : t('order.submit')}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
