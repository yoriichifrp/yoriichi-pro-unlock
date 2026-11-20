import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';
import { ServiceBadge, priceLabel } from '../components/status';
import { OrderForm } from '../components/OrderForm';

const ACCENTS = { fire: '#ff3b2f', gold: '#e8c46a', blue: '#3b8cff' };

export default function Catalog() {
  const { t, lang } = useI18n();
  const [categories, setCategories] = useState([]);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('all');
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/public/catalog')
      .then((data) => setCategories(data.categories || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  const pick = (item, field) => (lang === 'es' ? item[`${field}_es`] : item[`${field}_en`]) || '';

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    return categories
      .filter((category) => active === 'all' || category.slug === active)
      .map((category) => ({
        ...category,
        services: (category.services || []).filter((service) => {
          if (!term) return true;
          return [service.name, service.code, pick(service, 'desc')]
            .join(' ')
            .toLowerCase()
            .includes(term);
        }),
      }))
      .filter((category) => category.services.length > 0);
  }, [categories, active, query, lang]);

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.catalog')}</span>
        <h1 className="section-title">{t('catalog.title')}</h1>
        <p className="section-sub">{t('catalog.sub')}</p>

        <div className="row mt-3">
          <input
            className="search-input"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('catalog.searchPlaceholder')}
            aria-label={t('common.search')}
          />
        </div>

        <div className="tabs mt-3">
          <button type="button" className={`tab ${active === 'all' ? 'active' : ''}`} onClick={() => setActive('all')}>
            {t('common.all')}
          </button>
          {categories.map((category) => (
            <button
              type="button"
              key={category.slug}
              className={`tab ${active === category.slug ? 'active' : ''}`}
              onClick={() => setActive(category.slug)}
            >
              {pick(category, 'name')}
            </button>
          ))}
        </div>

        {loading ? <div className="loading-block">{t('common.loading')}</div> : null}

        {!loading && filtered.length === 0 ? (
          <div className="empty">{t('common.noResults')}</div>
        ) : null}

        {filtered.map((category) => (
          <div className="mt-4" key={category.slug}>
            <div className="section-head">
              <div>
                <h2 className="section-title">
                  <span className="pill" style={{ '--accent': ACCENTS[category.accent] || ACCENTS.fire }}>
                    <CategoryIcon name={category.icon} />
                  </span>{' '}
                  {pick(category, 'name')}
                </h2>
                <p className="section-sub">{pick(category, 'tagline')}</p>
              </div>
              <Link className="btn btn-ghost btn-sm" to={`/servicios/${category.slug}`}>
                {t('common.seeAll')}
              </Link>
            </div>

            <div className="grid-3">
              {category.services.map((service) => (
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
                      {t('common.request')}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}

        {selected ? (
          <OrderForm kind="service" reference={selected} onClose={() => setSelected(null)} />
        ) : null}
      </div>
    </section>
  );
}
