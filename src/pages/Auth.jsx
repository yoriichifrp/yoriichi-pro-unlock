import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useI18n } from '../i18n';
import { useAuth } from '../auth';

function useFormError() {
  const { t } = useI18n();
  return (thrown) => {
    const key = `error.${thrown.code || 'generic'}`;
    const text = t(key);
    return text === key ? thrown.message : text;
  };
}

export function LoginPage() {
  const { t } = useI18n();
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const panelPath = location.pathname === '/login' ? '/dashboard' : '/panel';
  const describeError = useFormError();
  const [form, setForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/panel" replace />;

  const change = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await login(form.email.trim(), form.password);
      navigate(panelPath);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="auth-wrap auth-split">
          <aside className="auth-aside">
            <span className="eyebrow">{t('brand.tagline')}</span>
            <h2 className="auth-aside-title">{t('home.hero.tagline')}</h2>
            <ul className="auth-points">
              <li>{t('home.status.catalog')}</li>
              <li>{t('nav.tools')}</li>
              <li>{t('nav.track')}</li>
            </ul>
            <p className="small muted">{t('home.hero.note')}</p>
          </aside>
          <div className="auth-card">
            <span className="eyebrow">{t('nav.login')}</span>
            <h1 className="section-title">{t('auth.login.title')}</h1>
            <p className="section-sub">{t('auth.login.sub')}</p>

            <form onSubmit={submit} className="mt-3">
              <div className="field">
                <label htmlFor="login-email">{t('common.email')}</label>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change('email')}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="login-password">{t('common.password')}</label>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={change('password')}
                  autoComplete="current-password"
                  required
                />
              </div>

              {error ? <div className="alert alert-error">{error}</div> : null}

              <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                {busy ? t('common.saving') : t('auth.login.submit')}
              </button>
            </form>

            <p className="auth-foot">
              {t('auth.login.noAccount')} <Link to="/registro">{t('nav.register')}</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function RegisterPage() {
  const { t } = useI18n();
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const panelPath = location.pathname === '/register' ? '/dashboard' : '/panel';
  const describeError = useFormError();
  const [form, setForm] = useState({ name: '', email: '', password: '', country: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  if (user) return <Navigate to="/panel" replace />;

  const change = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
        country: form.country.trim(),
      });
      navigate(panelPath);
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <div className="auth-wrap auth-split">
          <aside className="auth-aside">
            <span className="eyebrow">{t('brand.tagline')}</span>
            <h2 className="auth-aside-title">{t('home.hero.tagline')}</h2>
            <ul className="auth-points">
              <li>{t('home.status.catalog')}</li>
              <li>{t('nav.tools')}</li>
              <li>{t('nav.track')}</li>
            </ul>
            <p className="small muted">{t('home.hero.note')}</p>
          </aside>
          <div className="auth-card">
            <span className="eyebrow">{t('nav.register')}</span>
            <h1 className="section-title">{t('auth.register.title')}</h1>
            <p className="section-sub">{t('auth.register.sub')}</p>

            <form onSubmit={submit} className="mt-3">
              <div className="field">
                <label htmlFor="register-name">{t('common.name')}</label>
                <input id="register-name" name="name" value={form.name} onChange={change('name')} maxLength={60} required />
              </div>
              <div className="field">
                <label htmlFor="register-email">{t('common.email')}</label>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={change('email')}
                  autoComplete="email"
                  required
                />
              </div>
              <div className="field">
                <label htmlFor="register-country">{t('common.country')} <span className="muted">({t('common.optional')})</span></label>
                <input id="register-country" name="country" value={form.country} onChange={change('country')} maxLength={60} />
              </div>
              <div className="field">
                <label htmlFor="register-password">{t('common.password')}</label>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={change('password')}
                  autoComplete="new-password"
                  minLength={8}
                  required
                />
              </div>

              {error ? <div className="alert alert-error">{error}</div> : null}

              <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                {busy ? t('common.saving') : t('auth.register.submit')}
              </button>
            </form>

            <p className="auth-foot">
              {t('auth.register.hasAccount')} <Link to="/ingresar">{t('nav.login')}</Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
