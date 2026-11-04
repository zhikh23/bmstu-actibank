import { useEffect, useState } from 'react';
import { FormsTable } from '../../../widgets/forms-table/FormsTable.jsx';
import { FormFilters } from '../../../features/form-filters/FormFilters.jsx';
import { FormSearch } from '../../../features/form-search/FormSearch.jsx';
import { listForms } from '../../../entities/form/api.js';
import { getApiError } from '../../../shared/api/client.js';

export function FormsListPage({ user }) {
  const [forms, setForms] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ status: 'all', sortBy: 'start', sortOrder: 'asc' });
  const [state, setState] = useState({ loading: true, error: '' });

  useEffect(() => {
    setState({ loading: true, error: '' });
    listForms(filters)
      .then((result) => { setForms(result); setState({ loading: false, error: '' }); })
      .catch((error) => setState({ loading: false, error: getApiError(error).message }))
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
        {user?.roles?.includes('applicant') && <a className="primary-button" href="/forms/new">+ Создать форму</a>}
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
