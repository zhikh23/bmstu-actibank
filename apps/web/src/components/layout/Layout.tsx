import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { getLoginUrl } from '@/shared/auth';
import { stores } from '@/stores';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import styles from './layout.module.css';
import { UserRole } from '@/types/user';

export const Layout = observer(function Layout() {
  const { auth } = stores;
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    void auth.load();
  }, [auth]);

  useEffect(() => {
    if (auth.status === 'unauthenticated') {
      window.location.assign(getLoginUrl());
    }
  }, [auth.status]);

  const hasRole = (role: UserRole): boolean => {
    return auth.me?.roles.includes(role) ?? false;
  };

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar
          open={menuOpen}
          isApplicant={hasRole('applicant')}
          isModerator={hasRole('moderator')}
          onToggle={() => setMenuOpen((open) => !open)}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
});
