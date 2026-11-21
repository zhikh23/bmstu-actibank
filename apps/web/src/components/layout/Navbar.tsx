import { useEffect } from 'react';
import { Button } from 'primereact/button';
import { observer } from "mobx-react-lite";

import { stores } from '@/stores';
import {BMSTUIcon, EUIcon} from "@/components/icons";

import styles from './navbar.module.css';

export const Navbar = observer(function Navbar() {
  const { auth, person } = stores;
  const me = auth.me;
  const personInfo = person.current;

  useEffect(() => {
    if (me) {
      void person.load(me.id);
    } else {
      person.clear();
    }
  }, [me, person]);

  const fullName = personInfo?.fullName;
  const initials = fullName
    ?.split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase();

  return (
    <header className={styles.header}>
      <div className={styles.headerLogos}>
        <BMSTUIcon />
        <EUIcon />
      </div>
      <div className={styles.headerRight}>
        {me && (
          <>
            <span className={styles.userName}>{fullName ?? 'Загрузка...'}</span>
            <span className={styles.userAvatar} aria-label={fullName ?? 'Пользователь'}>
              {initials ?? '...'}
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
