import { useCallback, useEffect, useMemo, useState } from 'react';
import { useI18n } from '../i18n';
import { api } from '../api';
import { PaymentBadge, StatusBadge, ServiceBadge, formatDate, priceLabel } from '../components/status';

const TABS = ['overview', 'orders', 'services', 'clients', 'tools', 'payments', 'suppliers', 'messages', 'settings'];
const STATUSES = ['received', 'quoted', 'awaiting_payment', 'in_progress', 'completed', 'cancelled'];
const PAY_STATUSES = ['not_configured', 'pending', 'confirmed', 'refunded'];
const SERVICE_STATUSES = ['preparing', 'available', 'paused'];
const PAYMENT_METHOD_STATUSES = ['config_pending', 'active', 'disabled'];

export default function Admin() {
  const { t, lang } = useI18n();
  const [tab, setTab] = useState('overview');
  const [data, setData] = useState({});
  const [drafts, setDrafts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState('');
  const [search, setSearch] = useState('');

  const describeError = useCallback(
    (thrown) => {
      const key = `error.${thrown.code || 'generic'}`;
      const text = t(key);
      return text === key ? thrown.message : text;
    },
    [t],
  );

  const endpointFor = (name) => {
    if (name === 'overview') return '/admin/overview';
    if (name === 'clients') return '/admin/users';
    if (name === 'payments') return '/admin/payment-methods';
    if (name === 'settings') return '/public/settings';
    return `/admin/${name}`;
  };

  const load = useCallback(
    async (name) => {
      setLoading(true);
      setError('');
      try {
        const payload = await api.get(endpointFor(name));
        setData((previous) => ({ ...previous, [name]: payload }));
      } catch (thrown) {
        setError(describeError(thrown));
      } finally {
        setLoading(false);
      }
    },
    [describeError],
  );

  useEffect(() => {
    load(tab);
  }, [tab, load]);

  const flash = (message) => {
    setNotice(message);
    setError('');
    setTimeout(() => setNotice(''), 3200);
  };

  const draftOf = (key, base) => drafts[key] ?? base;
  const setDraft = (key, patch) => {
    setDrafts((previous) => ({ ...previous, [key]: { ...(previous[key] || {}), ...patch } }));
  };

  const save = async (path, payload, message, key) => {
    setBusy(key);
    setError('');
    try {
      await api.patch(path, payload);
      flash(message);
      setDrafts((previous) => {
        const next = { ...previous };
        delete next[key];
        return next;
      });
      await load(tab);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy('');
    }
  };

  const overview = data.overview;
  const kpis = useMemo(() => {
    if (!overview) return [];
    return [
      { label: t('admin.kpi.orders'), value: overview.orders.total },
      { label: t('admin.kpi.open'), value: (overview.orders.byStatus.received || 0) + (overview.orders.byStatus.in_progress || 0) },
      { label: t('admin.kpi.clients'), value: overview.users.total },
      { label: t('admin.kpi.available'), value: overview.services.available },
      { label: t('admin.kpi.messages'), value: overview.messages.open },
      { label: t('admin.kpi.payments'), value: overview.payments.active },
    ];
  }, [overview, t]);

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.admin')}</span>
        <h1 className="section-title">{t('admin.title')}</h1>
        <p className="section-sub">{t('admin.sub')}</p>
        <div className="alert alert-warn mt-2">{t('admin.demoWarning')}</div>

        <div className="tabs mt-3">
          {TABS.map((name) => (
            <button
              type="button"
              key={name}
              className={`tab ${tab === name ? 'active' : ''}`}
              onClick={() => setTab(name)}
            >
              {t(`admin.tab.${name}`)}
            </button>
          ))}
        </div>

        {error ? <div className="alert alert-error mt-3">{error}</div> : null}
        {notice ? <div className="alert alert-success mt-3">{notice}</div> : null}
        {loading ? <div className="loading-block mt-3"><span className="spinner" /> {t('common.loading')}</div> : null}

        {tab === 'overview' && overview ? (
          <>
            <div className="grid-3 mt-3">
              {kpis.map((item) => (
                <div className="stat-card" key={item.label}>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              ))}
            </div>
            <div className="panel mt-4">
              <div className="panel-head">
                <h2 className="panel-title">{t('admin.recent')}</h2>
              </div>
              {overview.recentOrders.length === 0 ? (
                <p className="empty">{t('admin.orders.empty')}</p>
              ) : (
                <div className="table-wrap">
                  <table>
                    <thead>
                      <tr>
                        <th>{t('common.status')}</th>
                        <th>{t('common.total')}</th>
                        <th>{t('common.paymentMethod')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {overview.recentOrders.map((order) => (
                        <tr key={order.code}>
                          <td>
                            <strong className="small">{order.code}</strong>
                            <div className="small muted">{order.serviceName}</div>
                          </td>
                          <td><StatusBadge status={order.status} /></td>
                          <td><PaymentBadge status={order.paymentStatus} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        ) : null}

        {tab === 'orders' && data.orders ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.orders')}</h2>
            </div>
            {data.orders.orders.length === 0 ? (
              <p className="empty">{t('admin.orders.empty')}</p>
            ) : (
              <div className="stack">
                {data.orders.orders.map((order) => {
                  const key = `order-${order.code}`;
                  const draft = draftOf(key, {
                    status: order.status,
                    paymentStatus: order.paymentStatus,
                    amountUsd: order.amountUsd ?? '',
                    adminNote: order.adminNote ?? '',
                  });
                  return (
                    <div className="panel" key={order.code}>
                      <div className="between">
                        <div>
                          <strong>{order.serviceName}</strong>
                          <div className="small muted">
                            {order.code} · {order.userName} ({order.userEmail}) · {formatDate(order.createdAt, lang)}
                          </div>
                          <div className="small muted">
                            {order.device?.brand} {order.device?.model} · IMEI {order.device?.imei || '—'}
                            {order.device?.days ? ` · ${order.device.days} ${t('common.days')}` : ''}
                          </div>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="form-row mt-2">
                        <div className="field">
                          <label>{t('common.status')}</label>
                          <select
                            value={draft.status}
                            onChange={(event) => setDraft(key, { status: event.target.value })}
                          >
                            {STATUSES.map((status) => (
                              <option key={status} value={status}>{t(`status.${status}`)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="field">
                          <label>{t('admin.orders.amount')}</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={draft.amountUsd}
                            onChange={(event) => setDraft(key, { amountUsd: event.target.value })}
                          />
                        </div>
                        <div className="field">
                          <label>{t('common.paymentMethod')}</label>
                          <select
                            value={draft.paymentStatus}
                            onChange={(event) => setDraft(key, { paymentStatus: event.target.value })}
                          >
                            {PAY_STATUSES.map((status) => (
                              <option key={status} value={status}>{t(`paystatus.${status}`)}</option>
                            ))}
                          </select>
                        </div>
                      </div>

                      <div className="field">
                        <label>{t('admin.orders.adminNote')}</label>
                        <input
                          value={draft.adminNote}
                          onChange={(event) => setDraft(key, { adminNote: event.target.value })}
                          maxLength={600}
                        />
                      </div>

                      <button
                        type="button"
                        className="btn btn-primary btn-sm"
                        disabled={busy === key}
                        onClick={() => save(
                          `/admin/orders/${encodeURIComponent(order.code)}`,
                          {
                            status: draft.status,
                            paymentStatus: draft.paymentStatus,
                            amountUsd: draft.amountUsd === '' ? null : draft.amountUsd,
                            adminNote: draft.adminNote,
                          },
                          t('admin.orders.updated'),
                          key,
                        )}
                      >
                        {busy === key ? t('common.saving') : t('admin.orders.update')}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}

        {tab === 'clients' && data.clients ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.clients')}</h2>
            </div>
            <div className="stack">
              {data.clients.users.map((client) => {
                const key = `user-${client.id}`;
                const draft = draftOf(key, { role: client.role, status: client.status, credits: client.credits });
                return (
                  <div className="panel" key={client.id}>
                    <div className="between">
                      <div>
                        <strong>{client.name}</strong>
                        <div className="small muted">{client.email} · {client.country || '—'}</div>
                        <div className="small muted">{client.orders} · {formatDate(client.createdAt, lang)}</div>
                      </div>
                      <span className={`badge ${client.status === 'active' ? 'badge-available' : 'badge-paused'}`}>
                        {t(`admin.clients.status.${client.status}`)}
                      </span>
                    </div>
                    <div className="form-row mt-2">
                      <div className="field">
                        <label>{t('admin.clients.role')}</label>
                        <select value={draft.role} onChange={(event) => setDraft(key, { role: event.target.value })}>
                          <option value="client">{t('admin.clients.role.client')}</option>
                          <option value="admin">{t('admin.clients.role.admin')}</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>{t('common.status')}</label>
                        <select value={draft.status} onChange={(event) => setDraft(key, { status: event.target.value })}>
                          <option value="active">{t('admin.clients.status.active')}</option>
                          <option value="suspended">{t('admin.clients.status.suspended')}</option>
                        </select>
                      </div>
                      <div className="field">
                        <label>{t('admin.clients.credit')}</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draft.credits}
                          onChange={(event) => setDraft(key, { credits: event.target.value })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy === key}
                      onClick={() => save(
                        `/admin/users/${client.id}`,
                        { role: draft.role, status: draft.status, credits: draft.credits },
                        t('admin.clients.updated'),
                        key,
                      )}
                    >
                      {busy === key ? t('common.saving') : t('common.save')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === 'services' && data.services ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.services')}</h2>
              <input
                className="input-inline"
                placeholder={t('common.search')}
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="stack">
              {data.services.services
                .filter((service) => {
                  const term = search.trim().toLowerCase();
                  if (!term) return true;
                  return `${service.name} ${service.code}`.toLowerCase().includes(term);
                })
                .map((service) => {
                  const key = `service-${service.code}`;
                  const draft = draftOf(key, {
                    status: service.status,
                    price_usd: service.price_usd ?? '',
                  });
                  return (
                    <div className="panel" key={service.code}>
                      <div className="between">
                        <div>
                          <strong>{service.name}</strong>
                          <div className="small muted">{service.code} · {priceLabel(service.price_usd, t)}</div>
                        </div>
                        <ServiceBadge status={service.status} />
                      </div>
                      <div className="form-row mt-2">
                        <div className="field">
                          <label>{t('common.status')}</label>
                          <select value={draft.status} onChange={(event) => setDraft(key, { status: event.target.value })}>
                            {SERVICE_STATUSES.map((status) => (
                              <option key={status} value={status}>{t(`common.${status}`)}</option>
                            ))}
                          </select>
                        </div>
                        <div className="field">
                          <label>{t('admin.services.price')}</label>
                          <input
                            type="number"
                            min="0"
                            step="0.01"
                            value={draft.price_usd}
                            onChange={(event) => setDraft(key, { price_usd: event.target.value })}
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        disabled={busy === key}
                        onClick={() => save(
                          `/admin/services/${encodeURIComponent(service.code)}`,
                          { status: draft.status, price_usd: draft.price_usd === '' ? null : draft.price_usd },
                          t('admin.services.updated'),
                          key,
                        )}
                      >
                        {busy === key ? t('common.saving') : t('common.save')}
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>
        ) : null}

        {tab === 'tools' && data.tools ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.tools')}</h2>
            </div>
            <div className="stack">
              {data.tools.tools.map((tool) => {
                const key = `tool-${tool.code}`;
                const draft = draftOf(key, { status: tool.status, price_per_day: tool.price_per_day ?? '' });
                return (
                  <div className="panel" key={tool.code}>
                    <div className="between">
                      <div>
                        <strong>{tool.name}</strong>
                        <div className="small muted">
                          {tool.price_per_day == null
                            ? t('common.pricePending')
                            : `${priceLabel(tool.price_per_day, t)} / ${t('tools.days')}`}
                        </div>
                      </div>
                      <ServiceBadge status={tool.status} />
                    </div>
                    <div className="form-row mt-2">
                      <div className="field">
                        <label>{t('common.status')}</label>
                        <select value={draft.status} onChange={(event) => setDraft(key, { status: event.target.value })}>
                          {SERVICE_STATUSES.map((status) => (
                            <option key={status} value={status}>{t(`common.${status}`)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="field">
                        <label>{t('tools.daily')}</label>
                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={draft.price_per_day}
                          onChange={(event) => setDraft(key, { price_per_day: event.target.value })}
                        />
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy === key}
                      onClick={() => save(
                        `/admin/tools/${encodeURIComponent(tool.code)}`,
                        {
                          status: draft.status,
                          price_per_day: draft.price_per_day === '' ? null : draft.price_per_day,
                        },
                        t('admin.tools.updated'),
                        key,
                      )}
                    >
                      {busy === key ? t('common.saving') : t('common.save')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === 'payments' && data.payments ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.payments')}</h2>
            </div>
            <p className="hint">{t('admin.payments.warning')}</p>
            <div className="stack mt-3">
              {data.payments.methods.map((method) => {
                const key = `method-${method.code}`;
                const draft = draftOf(key, {
                  status: method.status,
                  instructions_es: method.instructions_es ?? '',
                  instructions_en: method.instructions_en ?? '',
                });
                return (
                  <div className="panel" key={method.code}>
                    <div className="between">
                      <strong>{method.name}</strong>
                      <span className={`badge ${method.status === 'active' ? 'badge-available' : 'badge-preparing'}`}>
                        {method.status === 'active' ? t('common.available') : t('common.configPending')}
                      </span>
                    </div>
                    <div className="field mt-2">
                      <label>{t('common.status')}</label>
                      <select value={draft.status} onChange={(event) => setDraft(key, { status: event.target.value })}>
                        {PAYMENT_METHOD_STATUSES.map((status) => (
                          <option key={status} value={status}>{t(`paystatus.${status}`)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="field">
                      <label>{t('admin.payments.instructions')} (ES)</label>
                      <textarea
                        rows="2"
                        value={draft.instructions_es}
                        onChange={(event) => setDraft(key, { instructions_es: event.target.value })}
                        maxLength={600}
                      />
                    </div>
                    <div className="field">
                      <label>{t('admin.payments.instructions')} (EN)</label>
                      <textarea
                        rows="2"
                        value={draft.instructions_en}
                        onChange={(event) => setDraft(key, { instructions_en: event.target.value })}
                        maxLength={600}
                      />
                    </div>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      disabled={busy === key}
                      onClick={() => save(
                        `/admin/payment-methods/${encodeURIComponent(method.code)}`,
                        {
                          status: draft.status,
                          instructions_es: draft.instructions_es,
                          instructions_en: draft.instructions_en,
                        },
                        t('admin.payments.updated'),
                        key,
                      )}
                    >
                      {busy === key ? t('common.saving') : t('common.save')}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === 'suppliers' && data.suppliers ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.suppliers.title')}</h2>
            </div>
            <form
              className="form-row"
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const payload = Object.fromEntries(new FormData(form).entries());
                setBusy('supplier-new');
                setError('');
                try {
                  await api.post('/admin/suppliers', payload);
                  form.reset();
                  flash(t('admin.suppliers.created'));
                  await load('suppliers');
                } catch (thrown) {
                  setError(describeError(thrown));
                } finally {
                  setBusy('');
                }
              }}
            >
              <div className="field">
                <label>{t('common.name')}</label>
                <input name="name" maxLength={120} required />
              </div>
              <div className="field">
                <label>{t('admin.suppliers.contact')}</label>
                <input name="contact" maxLength={160} />
              </div>
              <div className="field">
                <label>{t('admin.suppliers.services')}</label>
                <input name="services" maxLength={300} />
              </div>
              <button type="submit" className="btn btn-primary btn-sm" disabled={busy === 'supplier-new'}>
                {busy === 'supplier-new' ? t('common.saving') : t('admin.suppliers.new')}
              </button>
            </form>

            <div className="stack mt-3">
              {data.suppliers.suppliers.length === 0 ? (
                <p className="empty">{t('admin.suppliers.empty')}</p>
              ) : (
                data.suppliers.suppliers.map((supplier) => (
                  <div className="between panel" key={supplier.id}>
                    <div>
                      <strong>{supplier.name}</strong>
                      <div className="small muted">{supplier.contact || '—'} · {supplier.services || '—'}</div>
                    </div>
                    <div className="row">
                      <span className={`badge ${supplier.status === 'active' ? 'badge-available' : 'badge-paused'}`}>
                        {supplier.status}
                      </span>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={async () => {
                          try {
                            await api.patch(`/admin/suppliers/${supplier.id}`, {
                              status: supplier.status === 'active' ? 'inactive' : 'active',
                            });
                            flash(t('admin.suppliers.created'));
                            await load('suppliers');
                          } catch (thrown) {
                            setError(describeError(thrown));
                          }
                        }}
                      >
                        {t('common.save')}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={async () => {
                          try {
                            await api.del(`/admin/suppliers/${supplier.id}`);
                            flash(t('admin.suppliers.deleted'));
                            await load('suppliers');
                          } catch (thrown) {
                            setError(describeError(thrown));
                          }
                        }}
                      >
                        {t('common.cancel')}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ) : null}

        {tab === 'messages' && data.messages ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.messages')}</h2>
            </div>
            {data.messages.messages.length === 0 ? (
              <p className="empty">{t('admin.messages.empty')}</p>
            ) : (
              <div className="stack">
                {data.messages.messages.map((message) => (
                  <div className="panel" key={message.id}>
                    <div className="between">
                      <div>
                        <strong>{message.subject}</strong>
                        <div className="small muted">
                          {message.name} · {message.email} · {message.channel} · {formatDate(message.createdAt, lang)}
                        </div>
                      </div>
                      <span className={`badge ${message.status === 'open' ? 'badge-preparing' : 'badge-available'}`}>
                        {message.status}
                      </span>
                    </div>
                    <p className="small mt-2">{message.message}</p>
                    <div className="row">
                      <a className="btn btn-ghost btn-sm" href={`mailto:${message.email}`}>{t('admin.messages.answer')}</a>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={async () => {
                          try {
                            await api.patch(`/admin/messages/${message.id}`, {
                              status: message.status === 'closed' ? 'open' : 'closed',
                            });
                            flash(t('admin.messages.close'));
                            await load('messages');
                          } catch (thrown) {
                            setError(describeError(thrown));
                          }
                        }}
                      >
                        {message.status === 'closed' ? t('admin.messages.answer') : t('admin.messages.close')}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {tab === 'settings' && data.settings ? (
          <div className="panel mt-3">
            <div className="panel-head">
              <h2 className="panel-title">{t('admin.tab.settings')}</h2>
            </div>
            <form
              onSubmit={async (event) => {
                event.preventDefault();
                const form = event.currentTarget;
                const payload = Object.fromEntries(new FormData(form).entries());
                setBusy('settings');
                setError('');
                try {
                  await api.patch('/admin/settings', payload);
                  flash(t('admin.settings.saved'));
                } catch (thrown) {
                  setError(describeError(thrown));
                } finally {
                  setBusy('');
                }
              }}
            >
              <div className="field">
                <label>{t('admin.settings.announcementEs')}</label>
                <textarea
                  name="announcement_es"
                  rows="2"
                  maxLength={300}
                  defaultValue={data.settings.settings?.announcement_es ?? ''}
                />
              </div>
              <div className="field">
                <label>{t('admin.settings.announcementEn')}</label>
                <textarea
                  name="announcement_en"
                  rows="2"
                  maxLength={300}
                  defaultValue={data.settings.settings?.announcement_en ?? ''}
                />
              </div>
              <button type="submit" className="btn btn-primary" disabled={busy === 'settings'}>
                {busy === 'settings' ? t('common.saving') : t('common.save')}
              </button>
            </form>
            <p className="hint mt-3">{t('admin.settings.password')}</p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
