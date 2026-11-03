import { statusLabels } from '../../entities/form/model.js';

export function FormFilters({ forms, filters, onChange }) {
  const statuses = ['all', 'draft', 'pending', 'reviewing'];
  const count = (value) => value === 'all'
    ? forms.length
    : forms.filter((form) => form.status === value).length;

  return (
    <div className="status-filters" aria-label="Фильтр по статусу">
      {statuses.map((value) => (
        <button
          className={`status-filter ${filters.status === value ? 'active' : ''}`}
          key={value}
          onClick={() => onChange({ ...filters, status: value })}
        >
          {value === 'all' ? 'Все' : statusLabels[value]} <b>{count(value)}</b>
        </button>
      ))}
    </div>
  );
}
