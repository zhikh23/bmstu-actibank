import { Button } from 'primereact/button';
import { observer } from "mobx-react-lite";

import { stores } from '@/stores';
import {BMSTUIcon, EUIcon} from "@/components/icons";

import styles from './navbar.module.css';

export const Navbar = observer(function Navbar() {
  const { auth } = stores;
  const me = auth.me;

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
              onClick={() => void auth.logout()}
            />
          </>
        )}
      </div>
    </header>
  );
});
