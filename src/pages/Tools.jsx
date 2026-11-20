import { useEffect, useState } from 'react';
import { useI18n } from '../i18n';
import { api } from '../api';
import { ServiceBadge, priceLabel } from '../components/status';
import { OrderForm } from '../components/OrderForm';

export default function Tools() {
  const { t, lang } = useI18n();
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/public/tools')
      .then((data) => setTools(data.tools || []))
      .catch(() => setTools([]))
      .finally(() => setLoading(false));
  }, []);

  const pick = (item, field) => (lang === 'es' ? item[`${field}_es`] : item[`${field}_en`]) || '';

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.tools')}</span>
        <h1 className="section-title">{t('tools.title')}</h1>
        <p className="section-sub">{t('tools.sub')}</p>

        <div className="alert alert-info mt-3">{t('tools.note')}</div>

        {loading ? <div className="loading-block">{t('common.loading')}</div> : null}

        <div className="grid-3 mt-4">
          {tools.map((tool) => (
            <article className="card" key={tool.code}>
              <div className="between">
                <h3 className="card-title">{tool.name}</h3>
                <ServiceBadge status={tool.status} />
              </div>
              <p className="card-desc">{pick(tool, 'desc')}</p>
              <div className="card-meta">
                <span className="small muted">{t('tools.license')}: {tool.license_mode || '—'}</span>
                <span className="small gold-text">
                  {t('tools.daily')}: {priceLabel(tool.price_per_day, t)}
                </span>
              </div>
              <div className="card-meta">
                <span className="small muted">{t('tools.days')}: {tool.availability_days || '—'}</span>
                <span className="small muted">{t('common.delivery')}: {pick(tool, 'delivery') || '—'}</span>
              </div>
              <div className="card-actions">
                <span className="code-chip">{tool.code}</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelected(tool)}>
                  {t('tools.request')}
                </button>
              </div>
            </article>
          ))}
        </div>

        {selected ? <OrderForm kind="rental" reference={selected} onClose={() => setSelected(null)} /> : null}
      </div>
    </section>
  );
}
