import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';
import { Reveal } from '../components/ui';
import { priceLabel } from '../components/status';
import { HoloDevice } from '../components/HoloDevice';
import { YoriichiArt } from '../components/YoriichiArt';

const ACCENTS = {
  fire: '#ff3b2f',
  gold: '#e8c46a',
  blue: '#3b8cff',
};

function Crest() {
  return (
    <svg className="hero-crest" viewBox="0 0 64 40" aria-hidden="true">
      <defs>
        <linearGradient id="crest-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#fdf3d4" />
          <stop offset="45%" stopColor="#e8c46a" />
          <stop offset="100%" stopColor="#a87f2c" />
        </linearGradient>
      </defs>
      <path
        d="M7 31 L11 11 L23 21 L32 7 L41 21 L53 11 L57 31 Z"
        fill="url(#crest-gold)"
        fillOpacity="0.2"
        stroke="url(#crest-gold)"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M7 31 H57" stroke="url(#crest-gold)" strokeWidth="3" strokeLinecap="round" />
      <circle cx="32" cy="16" r="2.4" fill="#ff3b2f" />
      <circle cx="18" cy="17" r="1.6" fill="#38e1ff" />
      <circle cx="46" cy="17" r="1.6" fill="#38e1ff" />
    </svg>
  );
}

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
  const activePayments = methods.filter((method) => method.status === 'active').length;

  return (
    <>
      <section className="hero hero-ref">
        <div className="hero-backdrop" aria-hidden="true">
          <span className="hero-grid-lines" />
          <span className="hero-horizon" />
          <span className="hero-spark hero-spark-a" />
          <span className="hero-spark hero-spark-b" />
        </div>

        <div className="container">
          <div className="hero-stage hero-stage-ref">
            <Reveal className="hero-art" delay={40}>
              <YoriichiArt />
            </Reveal>

            <Reveal className="hero-copy hero-copy-ref" delay={90}>
              <Crest />
              <span className="hero-kicker">{t('home.hero.eyebrowTop')}</span>

              <h1 className="hero-title-ref">
                <span className="title-main">{t('brand.name')}</span>
                <span className="title-sub">
                  <i aria-hidden="true" />
                  <span>{t('brand.suffix')}</span>
                  <i aria-hidden="true" />
                </span>
              </h1>

              <p className="hero-tagline-ref">
                <span>{t('home.hero.tagline1')}</span>{' '}
                <b>{t('home.hero.tagline2')}</b>{' '}
                <em>{t('home.hero.tagline3')}</em>{' '}
                <span className="tag-gold">{t('home.hero.tagline4')}</span>
              </p>

              <p className="hero-lead">{t('home.hero.lead')}</p>

              <div className="hero-actions hero-actions-ref">
                <Link className="btn-ref btn-ref-cyan" to="/catalogo">
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M13.5 4.5c3 0 6 1 6 1s1 3 1 6c0 5-5.5 9-9.5 9L8 17l-1.5-3C2.5 14 6.5 4.5 13.5 4.5Z" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
                    <circle cx="14.5" cy="9.5" r="1.6" fill="none" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M6.5 17.5 4 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                  </svg>
                  {t('home.hero.ctaServices')}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </Link>
                <Link className="btn-ref btn-ref-outline" to={user ? '/panel' : '/registro'}>
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0M18 8v6M15 11h6" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {user ? t('nav.panel') : t('home.hero.ctaRegister')}
                </Link>
              </div>

              <p className="hero-note-ref">
                <svg viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                  <path d="M9 12l2 2 4-4" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {t('home.hero.note')}
              </p>
            </Reveal>

            <Reveal className="hero-device" delay={150}>
              <HoloDevice />
            </Reveal>
          </div>

          <Reveal className="status-strip status-strip-ref" delay={200}>
            <div className="status-tile is-ready">
              <div className="status-tile-head">
                <span className="status-tile-label">{t('home.status.platformLabel')}</span>
                <span className="dot-state" aria-hidden="true" />
              </div>
              <strong>{t('home.status.operational')}</strong>
              <span className="status-tile-foot">{serviceCount} {t('home.status.services')}</span>
            </div>

            <div className="status-tile is-pending">
              <div className="status-tile-head">
                <span className="status-tile-label">{t('home.status.payments')}</span>
                <span className="dot-state" aria-hidden="true" />
              </div>
              <strong>{activePayments > 0 ? t('common.available') : t('home.status.connectionPending')}</strong>
              <span className="status-tile-foot">{methods.length} {t('home.status.methods')}</span>
            </div>

            <div className="status-tile is-idle">
              <div className="status-tile-head">
                <span className="status-tile-label">{t('home.status.modeLabel')}</span>
                <span className="dot-state" aria-hidden="true" />
              </div>
              <strong>{t('home.status.imeiCheck')}</strong>
              <span className="status-tile-foot">{t('home.status.connectionPending')}</span>
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
