import { EventsTable } from '@/components/events-table/EventsTable';
import { stores } from '@/stores';
import styles from './EventsPage.module.css';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';
import { MultiSelect } from 'primereact/multiselect';

export const EventsPage = observer(function EventsPage() {
  const { events, organizations } = stores;

  useEffect(() => {
    void events.load();
  }, [
    events,
    events.search,
    events.sortBy,
    events.sortOrder,
    events.organizerIds,
  ]);

  useEffect(() => {
    void organizations.load();
  }, [organizations]);

  const items = events.items;
  const loading = events.loading && events.items.length === 0;
  const failed = events.error !== null && events.items.length === 0;

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Мероприятия</h1>
        <p>
          Все зарегистрированные прошедшие мероприятия в сфере молодёжной
          политики МГТУ им. Н.Э. Баумана
        </p>
        <div className={styles.toolbar}>
          <span className={`${styles.search} p-icon-field p-icon-field-left`}>
            <i className="pi pi-search p-input-icon" aria-hidden="true" />
            <InputText
              className={styles.searchInput}
              value={events.search ?? ''}
              onChange={(event) => events.setSearch(event.target.value)}
              placeholder="Поиск по названию"
              aria-label="Поиск мероприятий по названию"
            />
          </span>

          <MultiSelect
            value={events.organizerIds ?? []}
            options={organizations.items}
            optionLabel="name"
            optionValue="id"
            onChange={(event) =>
              events.setOrganizerIds(
                Array.isArray(event.value)
                  ? event.value.filter(
                      (value): value is string => typeof value === 'string',
                    )
                  : [],
              )
            }
            className={styles.organizationSelect}
            placeholder="Все организации"
            aria-label="Фильтр мероприятий по организациям"
            filter
            filterPlaceholder="Поиск организации"
            maxSelectedLabels={1}
            selectedItemsLabel="Выбрано: {0}"
            emptyMessage="Организации не найдены"
            loading={organizations.loading}
            panelClassName={styles.organizationPanel}
          />
        </div>
      </div>

      {loading && <p className={styles.state}>Загрузка мероприятий...</p>}

      {failed && <p>Не удалось загрузить мероприятия. Попробуйте ещё раз.</p>}

      {!loading && !failed && items.length === 0 && (
        <p className={styles.emptyState}>
          {events.search?.trim()
            ? 'По вашему запросу мероприятия не найдены'
            : 'Здесь пока пусто'}
        </p>
      )}

      {items.length !== 0 && (
        <EventsTable
          events={events.items}
          organizations={organizations.items}
          sortBy={events.sortBy}
          sortOrder={events.sortOrder}
          onSort={(sortBy) => events.setSort(sortBy)}
        />
      )}
    </section>
  );
});
