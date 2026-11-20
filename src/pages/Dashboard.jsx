import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';
import { PaymentBadge, StatusBadge, formatDate, priceLabel } from '../components/status';

const SECTIONS = [
  { id: 'overview', label: 'dashboard.nav.overview' },
  { id: 'orders', label: 'dashboard.nav.orders' },
  { id: 'profile', label: 'dashboard.nav.profile' },
  { id: 'security', label: 'dashboard.nav.security' },
];

export default function Dashboard() {
  const { t, lang } = useI18n();
  const { user, setUser } = useAuth();
  const [summary, setSummary] = useState(null);
  const [orders, setOrders] = useState([]);
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
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
    { label: t('dashboard.stats.orders'), value: summary?.total ?? orders.length, tone: 'gold' },
    { label: t('dashboard.stats.open'), value: (summary?.byStatus?.received ?? 0) + (summary?.byStatus?.in_progress ?? 0) + (summary?.byStatus?.quoted ?? 0) + (summary?.byStatus?.awaiting_payment ?? 0), tone: 'blue' },
    { label: t('dashboard.stats.completed'), value: summary?.byStatus?.completed ?? 0, tone: 'fire' },
    { label: t('dashboard.stats.credits'), value: summary?.credits ?? 0, tone: 'cyan' },
  ];

  const visibleOrders = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return orders.filter((order) => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      const matchesQuery = !needle
        || String(order.code || '').toLowerCase().includes(needle)
        || String(order.serviceName || '').toLowerCase().includes(needle);
      return matchesStatus && matchesQuery;
    });
  }, [orders, query, statusFilter]);

  const filterOptions = useMemo(() => {
    const present = new Set(orders.map((order) => order.status));
    return ['all', ...Array.from(present)];
  }, [orders]);

  return (
    <section className="section">
      <div className="container">
        <div className="dash-shell">
          <aside className="dash-side">
            <div className="dash-side-head">
              <span className="eyebrow">{t('nav.panel')}</span>
              <strong>{user?.name}</strong>
              <span className="hint">{user?.email}</span>
            </div>

            <nav className="dash-nav" aria-label={t('nav.panel')}>
              {SECTIONS.map((item, index) => (
                <a key={item.id} className={`dash-nav-item${index === 0 ? ' is-active' : ''}`} href={`#${item.id}`}>
                  {t(item.label)}
                </a>
              ))}
            </nav>

            <div className="dash-side-foot">
              <Link className="dash-nav-item" to="/catalogo">{t('nav.catalog')}</Link>
              <Link className="dash-nav-item" to="/estado">{t('nav.track')}</Link>
              <Link className="dash-nav-item" to="/contacto">{t('nav.contact')}</Link>
              {user?.role === 'admin' ? (
                <Link className="btn btn-gold btn-sm btn-block mt-2" to="/admin">{t('dashboard.adminLink')}</Link>
              ) : null}
            </div>
          </aside>

          <div className="dash-main">
            <header className="dash-head" id="overview">
              <div>
                <span className="eyebrow">{t('nav.panel')}</span>
                <h1 className="section-title">{t('dashboard.title')}</h1>
                <p className="section-sub">{t('dashboard.sub')}</p>
                <p className="hint">{t('dashboard.hello')}, {user?.name}</p>
              </div>
              <span className="badge badge-info"><span className="dot" />{t(`role.${user?.role || 'client'}`)}</span>
            </header>

            {error ? <div className="alert alert-error mt-3">{error}</div> : null}
            {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}

            <div className="grid-4 mt-3">
              {stats.map((item) => (
                <div className={`stat-card tone-${item.tone}`} key={item.label}>
                  <span>{item.label}</span>
                  <strong>{loading ? '—' : item.value}</strong>
                </div>
              ))}
            </div>

            <div className="panel mt-4" id="orders">
              <div className="panel-head">
                <div>
                  <h2 className="panel-title">{t('dashboard.orders.title')}</h2>
                  <p className="small muted mt-1">{visibleOrders.length} / {orders.length}</p>
                </div>
                <button type="button" className="btn btn-ghost btn-sm" onClick={load}>
                  {t('common.refresh')}
                </button>
              </div>

              <div className="filter-bar">
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('dashboard.orders.search')}
                  aria-label={t('dashboard.orders.search')}
                />
                <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} aria-label={t('dashboard.orders.filter')}>
                  {filterOptions.map((option) => (
                    <option key={option} value={option}>
                      {option === 'all' ? t('dashboard.orders.all') : t(`status.${option}`)}
                    </option>
                  ))}
                </select>
              </div>

              {loading ? (
                <p className="muted small mt-3">{t('common.loading')}</p>
              ) : orders.length === 0 ? (
                <p className="muted small mt-3">{t('dashboard.orders.empty')}</p>
              ) : visibleOrders.length === 0 ? (
                <p className="muted small mt-3">{t('dashboard.orders.noMatch')}</p>
              ) : (
                <div className="table-wrap mt-3">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th scope="col">{t('dashboard.table.code')}</th>
                        <th scope="col">{t('dashboard.table.service')}</th>
                        <th scope="col">{t('dashboard.table.date')}</th>
                        <th scope="col">{t('dashboard.table.status')}</th>
                        <th scope="col">{t('dashboard.table.amount')}</th>
                        <th scope="col">{t('dashboard.table.actions')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {visibleOrders.map((order) => (
                        <tr key={order.code}>
                          <td><span className="code-chip">{order.code}</span></td>
                          <td>{order.serviceName}</td>
                          <td className="small muted">{formatDate(order.createdAt, lang)}</td>
                          <td><StatusBadge status={order.status} /></td>
                          <td className="small">{order.amountUsd == null ? t('common.pricePending') : priceLabel(order.amountUsd, t)}</td>
                          <td>
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
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="grid-2 mt-4">
              <div className="panel" id="profile">
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

              <div className="panel" id="security">
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
        </div>
      </div>
    </section>
  );
}
