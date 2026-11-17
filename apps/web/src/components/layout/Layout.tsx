import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { getLoginUrl } from '@/shared/auth';

import { Navbar } from './Navbar';
import styles from './layout.module.css';
import { stores } from '@/stores';

export function Layout() {
  const { auth } = stores;

  useEffect(() => {
    void auth.load();
  })

  useEffect(() => {
    if (auth.error !== null) {
      window.location.assign(getLoginUrl());
    }
  }, [auth]);

  return (
    <div className={styles.page}>
      <Navbar />
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
