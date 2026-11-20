import { useState } from 'react';
import { useI18n } from '../i18n';
import { api } from '../api';
import { CategoryIcon } from '../components/icons';

export default function Contact() {
  const { t } = useI18n();
  const [form, setForm] = useState({ name: '', email: '', channel: 'web', subject: '', message: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [ticket, setTicket] = useState(null);

  const change = (field) => (event) => {
    const { value } = event.target;
    setForm((previous) => ({ ...previous, [field]: value }));
  };

  const describeError = (thrown) => {
    const key = `error.${thrown.code || 'generic'}`;
    const text = t(key);
    return text === key ? thrown.message : text;
  };

  const submit = async (event) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const data = await api.post('/public/support', form);
      setTicket(data.ticket || data);
      setForm({ name: '', email: '', channel: 'web', subject: '', message: '' });
    } catch (thrown) {
      setError(describeError(thrown));
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className="section">
      <div className="container">
        <span className="eyebrow">{t('nav.contact')}</span>
        <h1 className="section-title">{t('contact.title')}</h1>
        <p className="section-sub">{t('contact.sub')}</p>

        <div className="grid-2 mt-4">
          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('contact.title')}</h2>
            </div>
            <div className="stack">
              <a className="contact-item" href="https://wa.me/18299729672" target="_blank" rel="noreferrer">
                <span className="pill"><CategoryIcon name="whatsapp" /></span>
                <span>
                  <strong>{t('contact.whatsapp')}</strong>
                  <p className="small muted">+1 829 972 9672</p>
                </span>
              </a>
              <a className="contact-item" href="https://t.me/+18299729672" target="_blank" rel="noreferrer">
                <span className="pill"><CategoryIcon name="telegram" /></span>
                <span>
                  <strong>{t('contact.telegram')}</strong>
                  <p className="small muted">+1 829 972 9672</p>
                </span>
              </a>
              <a className="contact-item" href="mailto:yoriichifrp09@gmail.com">
                <span className="pill"><CategoryIcon name="mail" /></span>
                <span>
                  <strong>{t('contact.email')}</strong>
                  <p className="small muted">yoriichifrp09@gmail.com</p>
                </span>
              </a>
            </div>
            <p className="hint mt-3">{t('contact.hours')}</p>
          </div>

          <div className="panel">
            <div className="panel-head">
              <h2 className="panel-title">{t('contact.form.title')}</h2>
            </div>

            {ticket ? (
              <div className="alert alert-success">
                {t('contact.form.success')} <strong>{ticket.code}</strong>
              </div>
            ) : (
              <form onSubmit={submit}>
                <div className="form-grid">
                  <div className="field">
                    <label htmlFor="contact-name">{t('common.name')}</label>
                    <input id="contact-name" value={form.name} onChange={change('name')} maxLength={60} required />
                  </div>
                  <div className="field">
                    <label htmlFor="contact-email">{t('common.email')}</label>
                    <input id="contact-email" type="email" value={form.email} onChange={change('email')} maxLength={120} required />
                  </div>
                </div>

                <div className="field">
                  <label htmlFor="contact-channel">{t('contact.form.channel')}</label>
                  <select id="contact-channel" value={form.channel} onChange={change('channel')}>
                    <option value="web">{t('contact.form.title')}</option>
                    <option value="whatsapp">{t('contact.whatsapp')}</option>
                    <option value="telegram">{t('contact.telegram')}</option>
                    <option value="email">{t('contact.email')}</option>
                  </select>
                </div>

                <div className="field">
                  <label htmlFor="contact-subject">{t('contact.form.subject')}</label>
                  <input id="contact-subject" value={form.subject} onChange={change('subject')} maxLength={120} required />
                </div>

                <div className="field">
                  <label htmlFor="contact-message">{t('contact.form.message')}</label>
                  <textarea id="contact-message" rows="5" value={form.message} onChange={change('message')} maxLength={1500} required />
                </div>

                {error ? <div className="alert alert-error">{error}</div> : null}

                <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
                  {busy ? t('common.saving') : t('contact.form.send')}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
