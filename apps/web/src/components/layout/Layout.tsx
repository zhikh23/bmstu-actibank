import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom'
import { getLoginUrl } from '@/shared/auth';

import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import styles from './layout.module.css';
import { stores } from '@/stores';

export function Layout() {
  const { auth } = stores;
  const [menuOpen, setMenuOpen] = useState(true);

  useEffect(() => {
    void auth.load();
  }, []);

  useEffect(() => {
    if (auth.error !== null) {
      window.location.assign(getLoginUrl());
    }
  }, [auth.error]);

  return (
    <div className={styles.page}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar open={menuOpen} onToggle={() => setMenuOpen((open) => !open)} />
        <main className={styles.main}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}
