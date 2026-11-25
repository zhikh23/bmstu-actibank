import styles from './EventsTable.module.css';
import { EventsListItem } from '@/types/events-list';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CopyableSlug from '@/shared/ui/CopyableSlug/CopyableSlug';
import { useNavigate } from 'react-router-dom';
import { formatDateTime } from '@/shared/lib/format-date';

export type EventsSortBy =
  'name' | 'start' | 'createdAt' | 'updatedAt' | 'reviewedAt';
export type EventsSortOrder = 'asc' | 'desc';

interface EventsTableProps {
  events: EventsListItem[];
  sortBy?: EventsSortBy;
  sortOrder?: EventsSortOrder;
  onSort?: (sortBy: EventsSortBy) => void;
  onSortChange?: (sortBy: EventsSortBy) => void;
}

export function EventsTable({ events }: EventsTableProps) {
  const navigate = useNavigate();

  const slugRowTemplate = (event: EventsListItem) => {
    return <CopyableSlug slug={event.slug} />;
  };

  const nameRowTemplate = ({ name, description }: EventsListItem) => {
    return (
      <span className={styles.nameRow}>
        <span className={styles.name}>{name}</span>
        <span className={styles.description}>{description}</span>
      </span>
    );
  };

  const datesRowTemplate = ({ start, end }: EventsListItem) => {
    return (
      <span className={styles.dates}>
        <span>{formatDateTime(start)}</span>
        <span>{formatDateTime(end)}</span>
      </span>
    );
  };

  return (
    <DataTable
      value={events}
      dataKey="id"
      scrollable
      removableSort
      selectionMode="single"
      onRowClick={(e) => navigate(`/events/${e.data.id}`)}
      emptyMessage="Мероприятия не найдены"
      aria-label="Список мероприятий"
      className={styles.table}
    >
      <Column
        field="slug"
        header="#"
        body={slugRowTemplate}
        style={{ width: '7rem', fontWeight: 'bold' }}
      />
      <Column
        field="name"
        header="Название"
        sortable
        style={{ minWidth: '20rem', maxWidth: 0 }}
        body={nameRowTemplate}
      />
      <Column
        field="start"
        header="Даты мероприятия"
        sortable
        style={{ width: '13rem' }}
        body={datesRowTemplate}
      />
      <Column
        field="createdAt"
        header="Дата создания"
        sortable
        style={{ width: '13rem' }}
        body={(event) => formatDateTime(event.createdAt)}
      />
    </DataTable>
  );
}
