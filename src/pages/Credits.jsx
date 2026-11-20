import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';

export default function Credits() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [methods, setMethods] = useState([]);
  const [configured, setConfigured] = useState(false);

  useEffect(() => {
    let active = true;
    api.get('/public/payments')
      .then((data) => {
        if (!active) return;
        setMethods(data.methods || []);
        setConfigured(Boolean(data.configured));
      })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!user) {
      setSummary(null);
      return undefined;
    }
    let active = true;
    api.get('/account/summary')
      .then((data) => { if (active) setSummary(data); })
      .catch(() => {});
    return () => { active = false; };
  }, [user]);

  const pick = (item, field) => (lang === 'es' ? item[`${field}_es`] : item[`${field}_en`]) || '';

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.credits')}</span>
        <h1 className="section-title">{t('credits.title')}</h1>
        <p className="section-sub">{t('credits.sub')}</p>

        <div className="grid-2 mt-4">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('credits.balance')}</h2>
            </div>
            {user ? (
              <>
                <p className="hero-title gold-text" style={{ fontSize: '2.4rem' }}>
                  {summary ? summary.credits ?? 0 : '—'}
                </p>
                <p className="muted small">{t('credits.needLogin')}</p>
              </>
            ) : (
              <>
                <p className="muted">{t('credits.needLogin')}</p>
                <Link className="btn btn-primary mt-2" to="/ingresar">{t('nav.login')}</Link>
              </>
            )}
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('credits.purchase.title')}</h2>
            </div>
            <p className="muted small">{t('credits.purchase.body')}</p>
            <div className="row mt-3">
              {methods.map((method) => (
                <span className="payment-chip" key={method.code}>
                  {method.name}
                  <span className={`badge ${method.status === 'active' ? 'badge-available' : 'badge-preparing'}`}>
                    {method.status === 'active' ? t('common.available') : t('common.configPending')}
                  </span>
                </span>
              ))}
            </div>
            {!configured ? <p className="hint mt-3">{t('common.notConfigured')}</p> : null}
            <Link className="btn btn-ghost btn-sm mt-3" to="/contacto">{t('nav.contact')}</Link>
          </div>
        </div>

        <div className="grid-3 mt-4">
          {[1, 2, 3].map((step) => (
            <div className="process-step" key={step}>
              <span className="pill">{String(step).padStart(2, '0')}</span>
              <p className="card-desc">{t(`credits.how.${step}`)}</p>
            </div>
          ))}
        </div>

        {methods.length > 0 ? (
          <div className="panel mt-4">
            <div className="panel-head">
              <h2 className="panel-title">{t('home.payments.title')}</h2>
            </div>
            <div className="stack">
              {methods.map((method) => (
                <div className="between" key={method.code}>
                  <div>
                    <strong>{method.name}</strong>
                    <p className="small muted">{pick(method, 'instructions') || t('common.configPending')}</p>
                  </div>
                  <span className={`badge ${method.status === 'active' ? 'badge-available' : 'badge-preparing'}`}>
                    {method.status === 'active' ? t('common.available') : t('common.configPending')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
