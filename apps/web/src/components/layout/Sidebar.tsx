import { useState, type ReactNode } from 'react';
import { NavLink } from 'react-router-dom';
import { Button } from 'primereact/button';

import styles from './sidebar.module.css';

interface SidebarProps {
  open: boolean;
  onToggle: () => void;
}

interface MenuCategoryProps {
  title: string;
  children: ReactNode;
}

function MenuCategory({ title, children }: MenuCategoryProps) {
  const [expanded, setExpanded] = useState(true);

  return (
    <section className={styles.category}>
      <button
        type="button"
        className={styles.categoryButton}
        aria-expanded={expanded}
        onClick={() => setExpanded((current) => !current)}
      >
        <i
          className={`pi ${expanded ? 'pi-chevron-down' : 'pi-chevron-right'} ${styles.categoryArrow}`}
          aria-hidden="true"
        />
        <span>{title}</span>
      </button>
      {expanded && <div className={styles.categoryLinks}>{children}</div>}
    </section>
  );
}

export function Sidebar({ open, onToggle }: SidebarProps) {
  const linkClassName = ({ isActive }: { isActive: boolean }): string =>
    `${styles.menuLink} ${isActive ? styles.menuLinkActive : ''}`;

  return (
    <aside
      className={`${styles.sidebar} ${open ? styles.sidebarOpen : ''}`}
      aria-label="Навигация"
    >
      <nav className={styles.navigation}>
        <MenuCategory title="Заявки">
          <NavLink to="/forms/new" className={linkClassName}>Подать заявку</NavLink>
          <NavLink to="/forms" end className={linkClassName}>Все заявки</NavLink>
        </MenuCategory>

        <MenuCategory title="Мероприятия">
          <NavLink to="/events" className={linkClassName}>Все мероприятия</NavLink>
        </MenuCategory>

        <MenuCategory title="Модератору">
          <NavLink to="/catalog" className={linkClassName}>Каталог</NavLink>
        </MenuCategory>
      </nav>

      <Button
        type="button"
        className={styles.toggleButton}
        icon={`pi ${open ? 'pi-angle-left' : 'pi-angle-right'}`}
        label={open ? 'Скрыть меню' : undefined}
        aria-label={open ? 'Скрыть меню' : 'Вернуть меню'}
        aria-expanded={open}
        onClick={onToggle}
        text
      />
    </aside>
  );
}
