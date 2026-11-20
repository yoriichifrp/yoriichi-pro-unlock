import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useI18n } from '../i18n';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';
import { ServiceBadge, priceLabel } from '../components/status';
import { OrderForm } from '../components/OrderForm';

export default function CategoryPage() {
  const { slug } = useParams();
  const { t, lang } = useI18n();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api.get('/public/catalog')
      .then((data) => {
        if (!active) return;
        const found = (data.categories || []).find((item) => item.slug === slug);
        setCategory(found || null);
      })
      .catch(() => setCategory(null))
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [slug]);

  const pick = (item, field) => (item ? (lang === 'es' ? item[`${field}_es`] : item[`${field}_en`]) || '' : '');

  if (loading) {
    return <section className="section"><div className="container"><div className="loading-block">{t('common.loading')}</div></div></section>;
  }

  if (!category) {
    return (
      <section className="section">
        <div className="container">
          <h1 className="section-title">{t('notfound.title')}</h1>
          <p className="section-sub">{t('notfound.body')}</p>
          <Link className="btn btn-primary mt-3" to="/catalogo">{t('nav.catalog')}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">
          <CategoryIcon name={category.icon} size={16} /> {t('nav.services')}
        </span>
        <h1 className="section-title">{pick(category, 'name')}</h1>
        <p className="section-sub">{pick(category, 'tagline')}</p>

        <div className="grid-2 mt-4">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('category.services')}</h2>
            </div>
            <p className="muted small">
              {category.services.length} {t('catalog.results')}
            </p>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('category.requirements.title')}</h2>
            </div>
            <p className="muted small">
              {category.slug === 'frp' ? t('category.requirements.frp') : t('category.requirements.generic')}
            </p>
          </div>
        </div>

        <div className="grid-3 mt-4">
          {(category.services || []).map((service) => (
            <article className="card" key={service.code}>
              <div className="between">
                <h3 className="card-title">{service.name}</h3>
                <ServiceBadge status={service.status} />
              </div>
              <p className="card-desc">{pick(service, 'desc')}</p>
              <div className="card-meta">
                <span className="small muted">{pick(service, 'delivery') || '—'}</span>
                <span className="small gold-text">{priceLabel(service.price_usd, t)}</span>
              </div>
              <div className="card-actions">
                <span className="code-chip">{service.code}</span>
                <button type="button" className="btn btn-primary btn-sm" onClick={() => setSelected(service)}>
                  {t('common.requestService')}
                </button>
              </div>
            </article>
          ))}
        </div>

        {selected ? <OrderForm kind="service" reference={selected} onClose={() => setSelected(null)} /> : null}
      </div>
    </section>
  );
}
