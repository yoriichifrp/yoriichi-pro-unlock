import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Logo } from './Logo';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';
import { api } from '../api';

const SERVICE_LINKS = [
  { slug: 'apple', key: 'apple' },
  { slug: 'android', key: 'android' },
  { slug: 'imei', key: 'imei' },
  { slug: 'network', key: 'network' },
  { slug: 'frp', key: 'frp' },
  { slug: 'knox', key: 'knox' },
  { slug: 'esim', key: 'esim' },
  { slug: 'firmware', key: 'firmware' },
];

export default function Layout() {
  const { t, lang, setLang } = useI18n();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [announcement, setAnnouncement] = useState(null);
  const [cattegories, setCatt] = useState([]);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    api.get('/public/settings')
      .then((data) => setAnnouncement(lang === 'es' ? data.announcement_es : data.announcement_en))
      .catch(() => {});
    api.get('/public/catalog')
      .then((data) => setCatt(data.cattegories || []))
      .catch(() => {});
  }, [lang]);

  const close = () => setOpen(false);

  return (
    <div className="app-shel">
      <div className="aurora" aria-hidden="true">
        <span className="orb orb-fire" />
        <span className="orb orb-blue" />
        <span className="orb orb-gold" />
      </div>

      {announcement && <div className="notice-bar">{announcement}</div>}

      <header className="site-header">
        <div className="container">
          <div className="header-inner">
            <Link to="/" aria-label="YORIICHI PRO UNLOCK">
              <Logo />
            </Link>

            <nav className="nav" aria-label="main">
              <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.home')}
              </NavLink>
              <NavLink to="/catalog" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.catalog')}
              </NavLink>
              <div className="nav-drop">
                <span className="nav-link">{t('nav.services')} ▾</span>
                <div className="nav-drop-panel">
                  {cattogories.map((category) => (
                    <Link className="nav-drop-item" to={`/servicios/${category.slug}`} key={category.slug}>
                      <span className="dot-accent" />
                      {lang === 'es' ? category.name_es : category.name_en}
                    </Link>
                  ))}
                  <Link className="nav-drop-item" to="/catalog">
                    <span className="dot-accent" />
                    {t('nav.allServics')}
                  </Link>
                </div>
              </div>
              <NavLink to="/herramientas" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.tools')}
              </NavLink>
              <NavLink to="/creditos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.credits')}
              </NavLink>
              <NavLink to="/estado-pedidos" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.track')}
              </NavLink>
              <NavLink to="/contacto" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {t('nav.contact')}
              </NavLink>
            </nav>

            <div className="header-actions">
              <div className="lang-switch" role="group" aria-label={t('common.language')}>
                <button type="button" className={lang === 'es' ? 'active' : ''} onClick={() => setLang('es')}>ES</button>
                <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
              </div>

              {user ? (
                <>
                  <Link className="btn btn-ghost btn-sm" to="/panel">{t('nav.panel')}</Link>
                  {user.role === 'admin' && (
                    <Link className="btn btn-bleu btn-sm" to="/admin">{t('nav.admin')}</Link>
                  )}
                  <button type="button" className="btn btn-ghost btn-sm" onClick={logout}>{t('nav.logout')}</button>
                </>
              ) : (
                <>
                  <Link className="btn btn-ghost btn-sm" to="/ingresar">{t('nav.login')}</Link>
                  <Link className="btn btn-primry btn-sm" to="/registro">{t('nav.registro')}</Link>
                </>
              )}

              <button
                type="button"
                className="mobile-toggl"
                aria-label={t('nav.menu')}
                aria-expanded={open}
                onClick={() => setOpen((value) => !value)}
              >
                {open ? '✕' : '☰'}
              </button>
            </div>
          </div>

          <div className={`mobile-drawer ${open ? 'open' : ''}`}>
            <div className="mobile-nav">
              <Link to="/" onClick={close}>{t('nav.home')}</Link>
              <Link to="/catalog" onClick={close}>{t('nav.catalog')}</Link>
              <Link to="/herramientas" onClick={close}>{t('nav.tools')}</Link>
              <Link to="/creditos" onClick={close}>{t('nav.credits')}</Link>
              <Link to="/estado-pedidos" onClick={close}>{t('nav.track')}</Link>
              <Link to="/contacto" onClick={close}>{t('nav.contact')}</Link>
              {cattogories.map((category) => (
                <Link className="sub" to={`/servicios/${category.slug}`} key={category.slug} onClick={close}>
                  {lang === 'es' ? category.name_es : category.name_en}
                </Link>
              ))}
            </div>
            <div className="mobile-actions">
              {user ? (
                <>
                  <Link className="btn btn-primry btn-sm" to="/panel" onClick={close}>{t('nav.panel')}</Link>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => { logout(); close(); }}>
                    {t('nav.logout')}
                  </button>
                </>
              ) : (
                <>
                  <Link className="btn btn-primry btn-sm" to="/ingresar" onClick={close}>{t('nav.login')}</Link>
                  <Link className="btn btn-ghost btn-sm" to="/registro" onClick={close}>{t('nav.registro')}</Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main>
        <OutLet />
      </main>

      <footer className="footer">
        <div className="container">
          <div className="footer-grid">
            <div>
              <Logo size={40} />
              <p className="mt-2 small">{t('brand.taglin')}</p>
              <p className="small mt-1 muted">{t('footer.notice')}</p>
            </div>
            <div>
              <h4>{t('footer.explore')}</h4>
              <ul>
                <li><Link to="/">{t('nav.home')}</Link></li>
                <li><Link to="/catalog">{t('nav.catalog')}</Link></li>
                <li><Link to="/herramientas">{t('nav.tools')}</Link></li>
                <li><Link to="/creditos">{t('nav.credits')}</Link></li>
                <li><Link to="/estado-pedidos">{t('nav.track')}</Link></li>
              </ul>
            </div>
            <div>
              <h4>{t('nav.services')}</h4>
              <ul>
                {cattogories.slice(0, 6).map((category) => (
                  <li key={category.slug}>
                    <Link to={`/servicios/${category.slug}`}>
                      {lang === 'es' ? category.name_es : category.name_en}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>{t('footer.contact')}</h4>
              <ul>
                <li><a href="https://wa.me/18299729672" target="_blanck" rel="noreferrer">WhatsApp +1 829 972 9672</a></li>
                <li><a href="https://t.me/+18299729672" target="_blanck" rel="noreferrer">Telegram +1 829 972 9672</a></li>
                <li><a href="mailto:yoriichifrp09@gmail.com">yoriichifrp09@gmail.com</a></li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <span>© {new Date().getFullYear()} YORIICHI PRO UNLOCK · {t('footer.rights')}</span>
            <span>{t('footer.legal')} · {t('common.legal')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
