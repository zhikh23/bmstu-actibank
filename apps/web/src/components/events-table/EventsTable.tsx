import { Link } from 'react-router-dom';

import styles from './EventsTable.module.css';
import { formatDateTime } from '@/shared/lib/format-date';
import { EventsListItem } from '@/types/events-list';

export type EventsSortBy = 'name' | 'start' | 'createdAt';
export type EventsSortOrder = 'asc' | 'desc';

interface SortHeaderProps {
  label: string;
  field: EventsSortBy;
  sortBy?: EventsSortBy;
  sortOrder?: EventsSortOrder;
  onSort?: (sortBy: EventsSortBy) => void;
}

function SortHeader({
  label,
  field,
  sortBy,
  sortOrder,
  onSort,
}: SortHeaderProps) {
  const active = sortBy === field;
  const icon = !active
    ? 'pi-sort-alt'
    : sortOrder === 'asc'
      ? 'pi-sort-amount-up'
      : 'pi-sort-amount-down';

  return (
    <th
      scope="col"
      aria-sort={
        active ? (sortOrder === 'asc' ? 'ascending' : 'descending') : 'none'
      }
    >
      <button
        type="button"
        className={styles.sortButton}
        onClick={() => onSort?.(field)}
        aria-label={`Сортировать по столбцу «${label}»`}
      >
        <span>{label}</span>
        <i className={`pi ${icon}`} aria-hidden="true" />
      </button>
    </th>
  );
}

interface EventsTableProps {
  events: EventsListItem[];
  sortBy?: EventsSortBy;
  sortOrder?: EventsSortOrder;
  onSort?: (sortBy: EventsSortBy) => void;
  onSortChange?: (sortBy: EventsSortBy) => void;
}

export function EventsTable({
  events,
  sortBy,
  sortOrder,
  onSort,
  onSortChange,
}: EventsTableProps) {
  if (events.length === 0) {
    return <p className={styles.state}>Заявок пока нет.</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <SortHeader
              label="Название"
              field="name"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort ?? onSortChange}
            />
            <SortHeader
              label="Даты мероприятия"
              field="start"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort ?? onSortChange}
            />
            <SortHeader
              label="Дата регистрации"
              field="createdAt"
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={onSort ?? onSortChange}
            />
            <th scope="col" aria-label="Открыть мероприятие" />
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event.id}>
              <td colSpan={6} className={styles.rowCell}>
                <Link className={styles.rowLink} to={`/events/${event.id}`}>
                  <span className={styles.slug}>{event.slug}</span>
                  <span className={styles.name}>{event.name}</span>
                  <span className={styles.eventDates}>
                    <span>{formatDateTime(event.start)}</span>
                    <span>{formatDateTime(event.end)}</span>
                  </span>
                  <span>{formatDateTime(event.createdAt)}</span>
                  <i
                    className={`pi pi-arrow-right ${styles.arrow}`}
                    aria-hidden="true"
                  />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
