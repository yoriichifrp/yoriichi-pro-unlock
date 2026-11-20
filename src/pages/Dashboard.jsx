import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';
import { PaymentBadge, StatusBadge, formatDate, priceLabel } from '../components/status';

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { user, setUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [profile, setProfile] = useState({ name: user?.name || '', country: user?.country || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });
  const [busy, setBusy] = useState('');

  const describeError = useCallback(
    (thrown) => {
      const key = `error.${thrown.code || 'generic'}`;
      const text = t(key);
      return text === key ? thrown.message : text;
    },
    [t],
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [summaryData, ordersData] = await Promise.all([
        api.get('/account/summary'),
        api.get('/account/orders'),
      ]);
      setSummary(summaryData);
      setOrders(ordersData.orders || []);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setLoading(false);
    }
  }, [describeError]);

  useEffect(() => {
    load();
  }, [load]);

  const openDetail = async (code) => {
    setError('');
    try {
      const data = await api.get(`/account/orders/${encodeURIComponent(code)}`);
      setDetail(data.order);
    } catch (thrown) {
      setError(describeError(thrown));
    }
  };

  const cancelOrder = async (code) => {
    setError('');
    setNotice('');
    setBusy(code);
    try {
      const data = await api.post(`/account/orders/${encodeURIComponent(code)}/cancel`, {});
      setOrders((previous) => previous.map((order) => (order.code === code ? data.order : order)));
      if (detail?.code === code) setDetail(data.order);
      setNotice(t('dashboard.orders.cancelled'));
      load();
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy('');
    }
  };

  const saveProfile = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy('profile');
    try {
      const data = await api.patch('/auth/profile', profile);
      setUser(data.user);
      setNotice(t('dashboard.profile.saved'));
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy('');
    }
  };

  const savePassword = async (event) => {
    event.preventDefault();
    setError('');
    setNotice('');
    setBusy('password');
    try {
      await api.patch('/auth/password', passwords);
      setPasswords({ currentPassword: '', newPassword: '' });
      setNotice(t('dashboard.password.saved'));
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy('');
    }
  };

  const stats = [
    { label: t('dashboard.stats.orders'), value: summary?.total ?? orders.length },
    { label: t('dashboard.stats.open'), value: (summary?.byStatus?.received ?? 0) + (summary?.byStatus?.in_progress ?? 0) + (summary?.byStatus?.quoted ?? 0) + (summary?.byStatus?.awaiting_payment ?? 0) },
    { label: t('dashboard.stats.completed'), value: summary?.byStatus?.completed ?? 0 },
    { label: t('dashboard.stats.credits'), value: summary?.credits ?? 0 },
  ];

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.panel')}</span>
        <h1 className="section-title">{t('dashboard.title')}</h1>
        <p className="section-sub">{t('dashboard.sub')}</p>
        <p className="hint">{t('dashboard.hello')}, {user?.name}</p>

        {error ? <div className="alert alert-error mt-3">{error}</div> : null}
        {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}

        <div className="grid-4 mt-3">
          {stats.map((item) => (
            <div className="stat" key={item.label}>
              <span className="small muted">{item.label}</span>
              <strong className="stat-value">{loading ? '—' : item.value}</strong>
            </div>
          ))}
        </div>

        {user?.role === 'admin' ? (
          <Link className="btn btn-gold btn-sm mt-3" to="/admin">{t('dashboard.adminLink')}</Link>
        ) : null}

        <div className="grid-2 mt-4">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('dashboard.orders.title')}</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
                {t('common.search')}
              </button>
            </div>

            {loading ? (
              <p className="muted small">{t('common.loading')}</p>
            ) : orders.length === 0 ? (
              <p className="muted small">{t('dashboard.orders.empty')}</p>
            ) : (
              <div className="stack">
                {orders.map((order) => (
                  <div className="panel-row" key={order.code}>
                    <div className="between">
                      <div>
                        <strong>{order.serviceName}</strong>
                        <p className="small muted">
                          {order.code} · {formatDate(order.createdAt, lang)}
                        </p>
                      </div>
                      <StatusBadge status={order.status} />
                    </div>
                    <div className="between mt-2">
                      <span className="small muted">
                        {order.amountUsd == null ? t('common.pricePending') : priceLabel(order.amountUsd, t)}
                      </span>
                      <span className="row">
                        <button type="button" className="btn btn-ghost btn-sm" onClick={() => openDetail(order.code)}>
                          {t('dashboard.orders.viewEvents')}
                        </button>
                        {['received', 'quoted'].includes(order.status) ? (
                          <button
                            type="button"
                            className="btn btn-ghost btn-sm"
                            onClick={() => cancelOrder(order.code)}
                            disabled={busy === order.code}
                          >
                            {t('dashboard.orders.cancel')}
                          </button>
                        ) : null}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="stack">
            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">{t('dashboard.profile.title')}</h2>
              </div>
              <form onSubmit={saveProfile}>
                <div className="field">
                  <label htmlFor="profile-name">{t('common.name')}</label>
                  <input
                    id="profile-name"
                    value={profile.name}
                    onChange={(event) => setProfile((previous) => ({ ...previous, name: event.target.value }))}
                    maxLength={80}
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="profile-country">{t('common.country')}</label>
                  <input
                    id="profile-country"
                    value={profile.country || ''}
                    onChange={(event) => setProfile((previous) => ({ ...previous, country: event.target.value }))}
                    maxLength={60}
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-block" disabled={busy === 'profile'}>
                  {busy === 'profile' ? t('common.saving') : t('common.save')}
                </button>
              </form>
            </div>

            <div className="panel">
              <div className="panel-head">
                <h2 className="panel-title">{t('dashboard.password.title')}</h2>
              </div>
              <form onSubmit={savePassword}>
                <div className="field">
                  <label htmlFor="password-current">{t('dashboard.password.current')}</label>
                  <input
                    id="password-current"
                    type="password"
                    value={passwords.currentPassword}
                    onChange={(event) => setPasswords((previous) => ({ ...previous, currentPassword: event.target.value }))}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="field">
                  <label htmlFor="password-new">{t('dashboard.password.new')}</label>
                  <input
                    id="password-new"
                    type="password"
                    value={passwords.newPassword}
                    onChange={(event) => setPasswords((previous) => ({ ...previous, newPassword: event.target.value }))}
                    autoComplete="new-password"
                    minLength={8}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-ghost btn-block" disabled={busy === 'password'}>
                  {busy === 'password' ? t('common.saving') : t('common.save')}
                </button>
              </form>
            </div>
          </div>
        </div>

        {detail ? (
          <div className="panel mt-4">
            <div className="panel-head">
              <h2 className="panel-title">{detail.serviceName}</h2>
              <button type="button" className="btn btn-ghost btn-sm" onClick={() => setDetail(null)}>
                {t('common.close')}
              </button>
            </div>
            <div className="row">
              <span className="code-chip">{detail.code}</span>
              <StatusBadge status={detail.status} />
              <PaymentBadge status={detail.paymentStatus} />
            </div>
            <div className="stack mt-3">
              <div className="between">
                <span className="small muted">{t('common.brand')} / {t('common.model')}</span>
                <span>{detail.device?.brand} {detail.device?.model}</span>
              </div>
              <div className="between">
                <span className="small muted">{t('common.imei')}</span>
                <span>{detail.device?.imei || '—'}</span>
              </div>
              <div className="between">
                <span className="small muted">{t('common.paymentMethod')}</span>
                <span>{detail.paymentMethod || t('common.notConfigured')}</span>
              </div>
            </div>
            <div className="timeline mt-3">
              {(detail.events || []).map((event, index) => (
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
        ) : null}
      </div>
    </section>
  );
}
