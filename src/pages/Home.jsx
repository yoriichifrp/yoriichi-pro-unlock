import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';
import { Reveal } from '../components/ui';
import { priceLabel } from '../components/status';
import { SamuraiArt, LockedPhone } from '../components/HeroArt';

const ACCENTS = {
  fire: '#ff3b2f',
  gold: '#e8c46a',
  blue: '#3b8cff',
};

export default function Home() {
  const { t, lang } = useI18n();
  const { user } = useAuth();
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
          <div className="hero-stage">
            <Reveal className="hero-art" delay={40}>
              <SamuraiArt />
            </Reveal>

            <Reveal className="hero-copy" delay={90}>
              <span className="hero-badge">{t('home.hero.eyebrow')}</span>
              <h1 className="hero-title-xl">
                YORIICHI <span className="fire-text">PRO UNLOCK</span>
              </h1>
              <p className="hero-tagline">{t('home.hero.tagline')}</p>
              <div className="hero-actions">
                <Link className="btn btn-primary" to="/catalogo">{t('home.hero.ctaServices')}</Link>
                <Link className="btn btn-ghost" to={user ? '/panel' : '/registro'}>
                  {user ? t('nav.panel') : t('home.hero.ctaRegister')}
                </Link>
              </div>
              <p className="hero-note">{t('home.hero.note')}</p>
            </Reveal>

            <Reveal className="hero-device" delay={150}>
              <LockedPhone />
            </Reveal>
          </div>

          <Reveal className="status-strip" delay={200}>
            <div className="status-tile is-ready">
              <span className="dot-state" aria-hidden="true" />
              <div>
                <strong>{t('home.status.catalog')}</strong>
                <span>{t('home.status.catalogState')}</span>
                <em>{serviceCount} {t('home.status.services')}</em>
              </div>
            </div>
            <div className="status-tile is-pending">
              <span className="dot-state" aria-hidden="true" />
              <div>
                <strong>{t('home.status.payments')}</strong>
                <span>{t('common.configPending')}</span>
                <em>{methods.length} {t('home.status.methods')}</em>
              </div>
            </div>
            <div className="status-tile is-idle">
              <span className="dot-state" aria-hidden="true" />
              <div>
                <strong>{t('home.status.connections')}</strong>
                <span>{t('common.preparing')}</span>
                <em>{t('home.status.connectionsNote')}</em>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('nav.catalog')}</span>
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
              <span className="eyebrow">{t('nav.tools')}</span>
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
                      <span className="dot" />
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
              <span className="eyebrow">{t('home.process.eyebrow')}</span>
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
          <div className="panel">
            <div className="panel-head">
              <div>
                <h2 className="panel-title">{t('home.payments.title')}</h2>
                <p className="small muted mt-1">{t('home.payments.sub')}</p>
              </div>
              <span className="badge badge-preparing">
                <span className="dot" />
                {t('common.configPending')}
              </span>
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
        </div>
      </section>

      <section className="section section-tight">
        <div className="container">
          <div className="section-head">
            <div>
              <span className="eyebrow">{t('nav.contact')}</span>
              <h2 className="section-title">{t('home.support.title')}</h2>
              <p className="section-sub">{t('home.support.sub')}</p>
            </div>
            <Link className="btn btn-ghost btn-sm" to="/contacto">{t('nav.contact')}</Link>
          </div>
          <div className="grid-3">
            <a className="contact-item" href="https://wa.me/18299729672" target="_blank" rel="noreferrer">
              <span className="pill">WA</span>
              <span>
                <strong className="small">WhatsApp</strong>
                <span className="hint">+1 829 972 9672</span>
              </span>
            </a>
            <a className="contact-item" href="https://t.me/+18299729672" target="_blank" rel="noreferrer">
              <span className="pill">TG</span>
              <span>
                <strong className="small">Telegram</strong>
                <span className="hint">+1 829 972 9672</span>
              </span>
            </a>
            <a className="contact-item" href="mailto:yoriichifrp09@gmail.com">
              <span className="pill">@</span>
              <span>
                <strong className="small">{t('common.email')}</strong>
                <span className="hint">yoriichifrp09@gmail.com</span>
              </span>
            </a>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('home.legal.title')}</h2>
              <span className="badge badge-info">
                <span className="dot" />
                {t('common.legal')}
              </span>
            </div>
            <p className="muted">{t('home.legal.body')}</p>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="panel center" style={{ padding: '48px 24px' }}>
            <h2 className="section-title">{t('home.cta.title')}</h2>
            <p className="section-sub" style={{ marginInline: 'auto' }}>{t('home.cta.body')}</p>
            <div className="hero-actions" style={{ justifyContent: 'center' }}>
              <Link className="btn btn-primary" to={user ? '/panel' : '/registro'}>
                {user ? t('nav.panel') : t('nav.register')}
              </Link>
              <Link className="btn btn-ghost" to="/contacto">{t('nav.contact')}</Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
