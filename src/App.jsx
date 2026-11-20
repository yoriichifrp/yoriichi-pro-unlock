import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import CategoryPage from './pages/CategoryPage';
import Tools from './pages/Tools';
import Credits from './pages/Credits';
import Track from './pages/Track';
import Contact from './pages/Contact';
import { LoginPage, RegisterPage } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Admin from './pages/Admin';
import NotFound from './pages/NotFound';
import { useAuth } from './auth';
import { useI18n } from './i18n';

function Protected({ children, admin = false }) {
  const { user, loading } = useAuth();
  const { t } = useI18n();
  const location = useLocation();

  if (loading) {
    return (
      <section className="section">
        <div className="container center">
          <p className="muted">{t('common.loading')}</p>
        </div>
      </section>
    );
  }

  if (!user) {
    return <Navigate to="/ingresar" replace state={{ from: location.pathname }} />;
  }

  if (admin && user.role !== 'admin') {
    return (
      <section className="section">
        <div className="container center">
          <div className="alert alert-warn">{t('admin.accessDenied')}</div>
        </div>
      </section>
    );
  }

  return children;
}

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalog />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/servicios/:slug" element={<CategoryPage />} />
        <Route path="/herramientas" element={<Tools />} />
        <Route path="/creditos" element={<Credits />} />
        <Route path="/estado" element={<Track />} />
        <Route path="/contacto" element={<Contact />} />
        <Route path="/ingresar" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/registro" element={<RegisterPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/panel"
          element={(
            <Protected>
              <Dashboard />
            </Protected>
          )}
        />
        <Route
          path="/dashboard"
          element={(
            <Protected>
              <Dashboard />
            </Protected>
          )}
        />
        <Route
          path="/admin"
          element={(
            <Protected admin>
              <Admin />
            </Protected>
          )}
        />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
