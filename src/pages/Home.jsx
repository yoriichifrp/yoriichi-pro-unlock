import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';
import { Reveal } from '../components/ui';
import { priceLabel } from '../components/status';

const ACCENTS = {
  fire: '#ff3b2f',
  gold: '#e8c46a',
  blue: '#3b8cff',
};

export default function Home() {
  const { t, lang } = useI18n();
  const [categories, setCategories] = useState([]);
  const [tools, setTools] = useState([]);
  const [methods, setMethods] = useState([]);

  useEffect(() => {
    let active = true;
    api.get('/public/catalog')
      .then((data) => { if (active) setCategories(data.categories || []); })
      .catch(() => {});
    api.get('/public/tools')
      .then((data) => { if (active) setTools(data.tools || []); })
      .catch(() => {});
    api.get('/public/payments')
      .then((data) => { if (active) setMethods(data.methods || []); })
      .catch(() => {});
    return () => { active = false; };
  }, []);

  const pick = (item, field) => (lang === 'es' ? item[`${field}_es`] : item[`${field}_en`]) || '';
  const serviceCount = categories.reduce((total, category) => total + (category.services?.length || 0), 0);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
            <Reveal>
              <span className="hero-badge">{t('home.hero.eyebrow')}</span>
              <h1 className="hero-title">
                {t('home.hero.title')} <span className="fire-text">{t('home.hero.titleAccent')}</span>
              </h1>
              <p className="hero-sub">{t('home.hero.subtitle')}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/catalogo">{t('home.hero.cta')}</Link>
                <Link className="btn btn-ghost" to="/estado-pedidos">{t('home.hero.ctaAlt')}</Link>
              </div>
              <p className="hero-note">{t('home.hero.note')}</p>
            </Reveal>

            <Reveal delay={120} className="hero-visual">
              <div className="sun-disc">
                <span className="sun-inner kanji">日</span>
              </div>
              <div className="sun-rays" aria-hidden="true" />
              <div className="hero-stats">
                <div className="hero-stat">
                  <strong>{categories.length}</strong>
                  <span>{t('home.stats.categories')}</span>
                </div>
                <div className="hero-stat">
                  <strong>{serviceCount}</strong>
                  <span>{t('home.stats.services')}</span>
                </div>
                <div className="hero-stat">
                  <strong>{tools.length || 5}</strong>
                  <span>{t('home.stats.tools')}</span>
                </div>
                <div className="hero-stat">
                  <strong>2</strong>
                  <span>{t('home.stats.languages')}</span>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('home.categories.title')}</h2>
              <p className="section-sub">{t('home.categories.sub')}</p>
            </div>
            <Link className="btn btn-ghost btn-sm" to="/catalogo">{t('home.categories.cta')}</Link>
          </div>

          <div className="grid-4">
            {categories.map((category, index) => (
              <Reveal key={category.slug} delay={index * 40}>
                <Link
                  className="category-card"
                  to={`/servicios/${category.slug}`}
                  style={{ '--accent': ACCENTS[category.accent] || ACCENTS.fire }}
                >
                  <span className="pill">
                    <CategoryIcon name={category.icon} />
                  </span>
                  <h3 className="card-title">{pick(category, 'name')}</h3>
                  <p className="card-desc">{pick(category, 'tagline')}</p>
                  <div className="card-meta">
                    <span className="small muted">{category.services?.length || 0} {t('catalog.results')}</span>
                    <span className="small gold-text">→</span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('home.process.title')}</h2>
              <p className="section-sub">{t('home.process.sub')}</p>
            </div>
          </div>
          <div className="grid-4">
            {[1, 2, 3, 4].map((step) => (
              <Reveal key={step} delay={step * 60}>
                <div className="process-step">
                  <span className="pill">{String(step).padStart(2, '0')}</span>
                  <h3 className="card-title">{t(`home.process.${step}.title`)}</h3>
                  <p className="card-desc">{t(`home.process.${step}.body`)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('home.tools.title')}</h2>
              <p className="section-sub">{t('home.tools.sub')}</p>
            </div>
            <Link className="btn btn-ghost btn-sm" to="/herramientas">{t('nav.tools')}</Link>
          </div>
          <div className="grid-3">
            {tools.map((tool, index) => (
              <Reveal key={tool.code} delay={index * 40}>
                <article className="card">
                  <div className="between">
                    <h3 className="card-title">{tool.name}</h3>
                    <span className={`badge ${tool.status === 'available' ? 'badge-available' : 'badge-preparing'}`}>
                      {t(`common.${tool.status}`)}
                    </span>
                  </div>
                  <p className="card-desc">{pick(tool, 'desc')}</p>
                  <div className="card-meta">
                    <span className="small muted">{t('common.days')}: {tool.availability_days || '—'}</span>
                    <span className="small gold-text">{priceLabel(tool.price_per_day, t)}</span>
                  </div>
                </article>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">{t('home.payments.title')}</h2>
              <p className="section-sub">{t('home.payments.sub')}</p>
            </div>
          </div>
          <div className="row">
            {methods.map((method) => (
              <span className="payment-chip" key={method.code}>
                {method.name}
                <span className={`badge ${method.status === 'active' ? 'badge-available' : 'badge-preparing'}`}>
                  {method.status === 'active' ? t('common.available') : t('common.configPending')}
                </span>
              </span>
            ))}
          </div>
          <p className="hint mt-3">{t('home.payments.note')}</p>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('home.legal.title')}</h2>
            </div>
            <p className="muted">{t('home.legal.body')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="card center" style={{ padding: '48px 24px' }}>
            <h2 className="section-title">{t('home.cta.title')}</h2>
            <p className="section-sub">{t('home.cta.body')}</p>
            <div className="hero-actions center">
              <Link className="btn btn-primary" to="/registro">{t('nav.register')}</Link>
              <Link className="btn btn-ghost" to="/contacto">{t('nav.contact')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
