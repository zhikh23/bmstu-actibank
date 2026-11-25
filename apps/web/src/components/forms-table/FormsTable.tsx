import styles from './FormsTable.module.css';
import { formatDateTime } from '@/shared/lib/format-date';
import { FormsListItem } from '@/types/forms-list';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { FormStatus } from '@/types/form-status';
import { MultiSelect } from 'primereact/multiselect';
import { FilterMatchMode } from 'primereact/api';
import CopyableSlug from '@/shared/ui/CopyableSlug/CopyableSlug';
import { useNavigate } from 'react-router-dom';

export type FormsSortBy =
  'name' | 'start' | 'createdAt' | 'updatedAt' | 'reviewedAt';
export type FormsSortOrder = 'asc' | 'desc';

interface FormsTableProps {
  forms: FormsListItem[];
  sortBy?: FormsSortBy;
  sortOrder?: FormsSortOrder;
  onSort?: (sortBy: FormsSortBy) => void;
  onSortChange?: (sortBy: FormsSortBy) => void;
}

interface StatusOption {
  label: string;
  value: FormStatus;
}

const statusOptions: StatusOption[] = [
  { label: 'Черновик', value: FormStatus.Draft },
  { label: 'Ожидает проверки', value: FormStatus.Pending },
  { label: 'Отменено', value: FormStatus.Canceled },
  { label: 'На проверке', value: FormStatus.Reviewing },
  { label: 'Одобрено', value: FormStatus.Approved },
  { label: 'Отклонено', value: FormStatus.Rejected },
];

const mapStatusLabel = new Map<FormStatus, string>([
  [FormStatus.Draft, 'Черновик'],
  [FormStatus.Pending, 'Ожидает проверки'],
  [FormStatus.Canceled, 'Отменено'],
  [FormStatus.Reviewing, 'На проверке'],
  [FormStatus.Approved, 'Одобрено'],
  [FormStatus.Rejected, 'Отклонено'],
]);

export function FormsTable({ forms }: FormsTableProps) {
  const navigate = useNavigate();

  const slugRowTemplate = (form: FormsListItem) => {
    return <CopyableSlug slug={form.slug} />;
  };

  const nameRowTemplate = ({ name, description }: FormsListItem) => {
    return (
      <span className={styles.nameRow}>
        <span className={styles.name}>{name}</span>
        <span className={styles.description}>{description}</span>
      </span>
    );
  }

  const statusRowTemplate = ({ status }: FormsListItem) => {
    return (
      <span className={`${styles.status} ${styles[`status-${status}`] ?? ''}`}>
        {mapStatusLabel.get(status)}
      </span>
    );
  }

  const datesRowTemplate = ({ start, end }: FormsListItem) => {
    return (
      <span className={styles.dates}>
      <span>{formatDateTime(start)}</span>
      <span>{formatDateTime(end)}</span>
    </span>
    );
  }

  const statusFilterItemTemplate = (status: StatusOption) => {
    return (
      <span
        className={`${styles.status} ${styles[`status-${status.value}`] ?? ''}`}
      >
        {status.label}
      </span>
    );
  };

  const statusFilterTemplate = (
    options: ColumnFilterElementTemplateOptions,
  ) => {
    return (
      <MultiSelect
        value={options.value}
        options={statusOptions}
        itemTemplate={statusFilterItemTemplate}
        onChange={(e) => options.filterApplyCallback(e.value)}
        showClear
      />
    );
  };

  return (
    <DataTable
      value={forms}
      dataKey="id"
      scrollable
      removableSort
      selectionMode="single"
      onRowClick={(e) => navigate(`/forms/${e.data.id}`)}
      emptyMessage="Заявки не найдены"
      aria-label="Список заявок"
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
        header="Статус"
        filterField="status"
        style={{ width: '8rem' }}
        body={statusRowTemplate}
        filter
        filterElement={statusFilterTemplate}
        filterMatchMode={FilterMatchMode.IN}
        filterMenuStyle={{ width: '20rem' }}
        showFilterOperator={false}
        showFilterMatchModes={false}
        showFilterMenuOptions={false}
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
        body={(form) => formatDateTime(form.createdAt)}
      />
      <Column
        field="updatedAt"
        header="Дата обновления"
        sortable
        style={{ width: '13rem' }}
        body={(form) => formatDateTime(form.updatedAt)}
      />
    </DataTable>
  );
}
