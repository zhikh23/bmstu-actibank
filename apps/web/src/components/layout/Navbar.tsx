import { Button } from 'primereact/button';
import { BMSTUIcon, EUIcon } from '../icons';
import styles from './navbar.module.css';
import { stores } from '@/stores';

export function Navbar() {
  const { auth } = stores;
  const me = auth.me;

  function handleLogout(): void {
    auth.logout();
  }

  return (
    <header className={styles.header}>
      <div className={styles.headerLogos}>
        <BMSTUIcon />
        <EUIcon />
      </div>
      <div className={styles.headerRight}>
        {me && (
          <>
            <span className={styles.userName}>Иванов Иван</span>
            <span className={styles.userAvatar} aria-label="Иванов Иван">
              ИИ
            </span>
            <Button
              label="Выйти"
              icon="pi pi-user"
              outlined
              rounded
              className={styles.headerLogoutButton}
              onClick={handleLogout}
            />
          </>
        )}
      </div>
    </header>
  );
}
