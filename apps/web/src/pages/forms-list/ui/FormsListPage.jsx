import { useEffect, useState } from 'react';
import { FormsTable } from '../../../widgets/forms-table/FormsTable.jsx';
import { FormFilters } from '../../../features/form-filters/FormFilters.jsx';
import { FormSearch } from '../../../features/form-search/FormSearch.jsx';

export function FormsListPage({ authenticated }) {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', sortBy: 'start', sortOrder: 'asc' });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    const params = new URLSearchParams({
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    });
    setState({ loading: true, error: '' });
    fetch(`/api/v1/forms?${params}`, { credentials: 'include' })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(response.status === 401
            ? 'Сессия истекла. Войдите в систему.'
            : 'Не удалось загрузить формы.');
        }
        return response.json();
      })
      .then(setForms)
      .catch((error) => setState({ loading: false, error: error.message }))
      .finally(() => setState((current) => ({ ...current, loading: false })));
  }, [filters]);

  const filteredForms = forms.filter((form) => {
    const matchesStatus = filters.status === 'all' || form.status === filters.status;
    const query = search.trim().toLocaleLowerCase('ru-RU');
    return matchesStatus && (!query || `${form.name} ${form.description}`.toLocaleLowerCase('ru-RU').includes(query));
  });

  return (
    <main className="main-content">
      <div className="breadcrumbs"><a href="/">Главная</a><span>›</span><a href="/forms">Формы мероприятий</a></div>
      <div className="page-heading">
        <div><h1>Формы мероприятий</h1><p>Заявки на регистрацию мероприятий</p></div>
        {authenticated && <a className="primary-button" href="/forms/new">+ Создать форму</a>}
      </div>
      <section className="content-card">
        <div className="forms-toolbar">
          <FormSearch value={search} onChange={setSearch} />
          <FormFilters forms={forms} filters={filters} onChange={setFilters} />
        </div>
        <FormsTable
          forms={filteredForms}
          loading={state.loading}
          error={state.error}
          sortBy={filters.sortBy}
          sortOrder={filters.sortOrder}
          onRetry={() => setFilters({ ...filters })}
          onSort={(sortBy) => setFilters({
            ...filters,
            sortBy,
            sortOrder: filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc',
          })}
        />
      </section>
    </main>
  );
}
