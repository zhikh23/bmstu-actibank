import { useState } from 'react';
import { FormsListPage } from '../pages/forms-list/ui/FormsListPage.jsx';
import { Topbar } from '../widgets/topbar/Topbar.jsx';

export function App() {
  const [authenticated, setAuthenticated] = useState(true);

  return (
    <div className="app-shell">
      <Topbar
        authenticated={authenticated}
        onLogin={() => {
          const returnTo =
            window.location.pathname +
            window.location.search +
            window.location.hash;
          window.location.href =
            `/api/v1/auth/login?returnTo=${encodeURIComponent(returnTo)}`;
        }}
        onLogout={async () => {
          await fetch('/api/v1/auth/logout', { credentials: 'include' });
          setAuthenticated(false);
        }}
      />
      <FormsListPage authenticated={authenticated} />
    </div>
  );
}
