import { Link } from 'react-router-dom';
import { useI18n } from '../i18n';

export default function NotFound() {
  const { t } = useI18n();
  return (
    <section className="section">
      <div className="container center">
        <span className="kanji" style={{ fontSize: '4rem' }}>縁</span>
        <h1 className="section-title">{t('notfound.title')}</h1>
        <p className="section-sub">{t('notfound.body')}</p>
        <Link className="btn btn-primary mt-3" to="/">{t('nav.home')}</Link>
      </div>
    </section>
  );
}
