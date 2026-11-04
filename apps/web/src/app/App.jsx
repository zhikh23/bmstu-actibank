import { useEffect, useState } from 'react';
import { FormsListPage } from '../pages/forms-list/ui/FormsListPage.jsx';
import { Topbar } from '../widgets/topbar/Topbar.jsx';
import { FormCreatePage } from '../pages/form-create/ui/FormCreatePage.jsx';
import { FormDetailPage } from '../pages/form-detail/ui/FormDetailPage.jsx';
import { getCurrentUser } from '../entities/user/api.js';
import { getApiError, API_URL } from '../shared/api/client.js';
import { getRoute } from './router.js';

export function App() {
  const [auth, setAuth] = useState({ loading: true, user: null, error: '' });
  const path = window.location.pathname;
  const route = getRoute(path);
  const isProtected = ['forms-list', 'form-create', 'form-edit', 'form-detail'].includes(route.name);

  useEffect(() => {
    getCurrentUser()
      .then((user) => setAuth({ loading: false, user, error: '' }))
      .catch((error) => {
        const apiError = getApiError(error);
        setAuth({ loading: false, user: null, error: apiError.status === 401 ? '' : apiError.message });
      });
  }, []);

  return (
    <div className="app-shell">
      <Topbar
        user={auth.user}
        onLogin={() => {
          const returnTo =
            window.location.pathname +
            window.location.search +
            window.location.hash;
          window.location.href = `${API_URL}/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
        }}
        onLogout={async () => {
          await fetch(`${API_URL}/auth/logout`, { credentials: 'include' });
          setAuth({ loading: false, user: null, error: '' });
        }}
      />
      {auth.loading ? <main className="main-content"><div className="content-card state-box">Проверка сессии…</div></main> :
        auth.error ? <main className="main-content"><div className="content-card state-box error-state"><strong>{auth.error}</strong></div></main> :
        isProtected && !auth.user ? <main className="main-content"><div className="content-card state-box"><strong>Войдите, чтобы продолжить</strong><button className="primary-button" onClick={() => {
          const returnTo = window.location.pathname + window.location.search + window.location.hash;
          window.location.href = `${API_URL}/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
        }}>Войти</button></div></main> :
        route.name === 'form-create' && !auth.user.roles?.includes('applicant') ? <main className="main-content"><div className="content-card state-box error-state"><strong>Недостаточно прав</strong></div></main> :
        route.name === 'form-create' ? <FormCreatePage /> :
        route.name === 'form-detail' ? <FormDetailPage id={route.id} user={auth.user} /> :
        route.name === 'form-edit' ? <FormCreatePage formId={route.id} /> :
        route.name === 'forms-list' ? <FormsListPage user={auth.user} /> :
        route.name === 'not-found' ? <main className="main-content"><div className="content-card state-box error-state"><strong>Страница не найдена</strong><a className="secondary-button" href="/">На главную</a></div></main> :
        <main className="main-content"><div className="content-card state-box"><strong>Регистрация мероприятий</strong><p>Создавайте и отслеживайте заявки на мероприятия.</p><button className="primary-button" onClick={() => window.location.href = '/forms'}>Открыть формы</button></div></main>}
    </div>
  );
}
