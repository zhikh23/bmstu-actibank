import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { getLoginUrl } from '@/shared/auth';
import { stores } from '@/stores';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import styles from './layout.module.css';

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

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar
          open={menuOpen}
          onToggle={() => setMenuOpen((open) => !open)}
        />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  );
});
