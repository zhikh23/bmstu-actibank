import { statusLabels } from '../../entities/form/model.js';

export function FormsTable({ forms, loading, error, sortBy, sortOrder, onRetry, onSort }) {
  if (loading) return <div className="skeleton-table">{[1, 2, 3, 4].map((row) => <div key={row} className="skeleton-row"><i /><i /><i /><i /></div>)}</div>;
  if (error) return <div className="state-box error-state"><strong>Не удалось загрузить данные</strong><p>{error}</p><button className="secondary-button" onClick={onRetry}>Повторить</button></div>;
  if (!forms.length) return <div className="state-box"><i className="pi pi-inbox empty-icon" aria-hidden="true" /><strong>Формы не найдены</strong><p>Измените поиск или фильтр.</p></div>;

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Название мероприятия</th>
            <th><button className="table-sort" onClick={() => onSort('start')}>Дата мероприятия <SortIcon active={sortBy === 'start'} order={sortOrder} /></button></th>
            <th>Статус</th>
            <th><button className="table-sort" onClick={() => onSort('createdAt')}>Дата подачи <SortIcon active={sortBy === 'createdAt'} order={sortOrder} /></button></th>
            <th />
          </tr>
        </thead>
        <tbody>{forms.map((form) => <tr key={form.id} className="form-row" onClick={() => { window.location.href = `/forms/${form.id}`; }}>
          <td><button className="slug-copy" title="Скопировать идентификатор" onClick={(event) => { event.stopPropagation(); navigator.clipboard.writeText(form.slug); }}>{form.slug}<i className="pi pi-copy" aria-hidden="true" /></button></td>
          <td><strong>{form.name}</strong><small>{form.description}</small></td>
          <td>{formatDateRange(form.start, form.end)}</td>
          <td><span className={`status-badge status-${form.status}`}>{statusLabels[form.status] ?? form.status}</span></td>
          <td>{form.createdAt ? formatDate(form.createdAt) : '—'}</td>
          <td><a className="open-link" href={`/forms/${form.id}`} aria-label={`Открыть ${form.name}`} onClick={(event) => event.stopPropagation()}><i className="pi pi-chevron-right" aria-hidden="true" /></a></td>
        </tr>)}</tbody>
      </table>
    </div>
  );
}

function SortIcon({ active, order }) {
  const icon = active ? (order === 'asc' ? 'pi-sort-amount-up' : 'pi-sort-amount-down') : 'pi-sort-alt';
  return <i className={`pi ${icon} sort-icon ${active ? 'active' : ''}`} aria-hidden="true" />;
}

function formatDate(value) {
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(new Date(value));
}

function formatDateRange(startValue, endValue) {
  const start = new Date(startValue);
  const end = new Date(endValue);
  const date = new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
  const time = new Intl.DateTimeFormat('ru-RU', { hour: '2-digit', minute: '2-digit' });
  if (start.toDateString() === end.toDateString()) {
    return <>{date.format(start)}<small>{time.format(start)}–{time.format(end)}</small></>;
  }
  return <>{date.format(start)}<small>до {date.format(end)}</small></>;
}
