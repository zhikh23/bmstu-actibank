import { Link } from 'react-router-dom';

import styles from './FormsTable.module.css';
import { formatDateTime } from '@/shared/lib/format-date';
import { FormsListItem } from '@/types/forms-list';

interface FormsTableProps {
  forms: FormsListItem[];
}

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  pending: 'На рассмотрении',
  approved: 'Одобрено',
  reviewing: 'На проверке',
  canceled: 'Отменено',
  rejected: 'Отклонено',
};

export function FormsTable({ forms }: FormsTableProps) {
  if (forms.length === 0) {
    return <p className={styles.state}>Заявок пока нет.</p>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th scope="col">#</th>
            <th scope="col">Название</th>
            <th scope="col">Даты мероприятия</th>
            <th scope="col">Статус</th>
            <th scope="col">Дата подачи</th>
            <th scope="col" aria-label="Открыть заявку" />
          </tr>
        </thead>
        <tbody>
          {forms.map((form) => (
            <tr key={form.id}>
              <td colSpan={6} className={styles.rowCell}>
                <Link className={styles.rowLink} to={`/forms/${form.id}`}>
                  <span className={styles.slug}>{form.slug}</span>
                  <span className={styles.name}>{form.name}</span>
                  <span className={styles.eventDates}>
                    <span>{formatDateTime(form.start)}</span>
                    <span>{formatDateTime(form.end)}</span>
                  </span>
                  <span
                    className={`${styles.status} ${styles[`status-${form.status}`] ?? ''}`}
                  >
                    {statusLabels[form.status] ?? form.status}
                  </span>
                  <span>{formatDateTime(form.createdAt)}</span>
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
