import { FormsTable } from '@/pages/forms/ui/FormsTable';
import { stores } from '@/stores';
import styles from './FormsPage.module.css';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { InputText } from 'primereact/inputtext';

export const FormsPage = observer(function FormsPage() {
  const { forms } = stores;

  useEffect(() => {
    void forms.load();
  }, [forms]);

  const items = forms.filtered;
  const loading = forms.loading && forms.items.length === 0;
  const failed = forms.error !== null && forms.items.length === 0;

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Заявки на регистрацию мероприятий</h1>
        <p>
          Все активные заявки на регистрацию мероприятия в сфере молодёжной
          политики МГТУ им. Н.Э. Баумана
        </p>
        <span className={`${styles.search} p-icon-field p-icon-field-left`}>
          <i className="pi pi-search p-input-icon" aria-hidden="true" />
          <InputText
            className={styles.searchInput}
            value={forms.searchQuery}
            onChange={(event) => forms.setSearchQuery(event.target.value)}
            placeholder="Поиск по названию"
            aria-label="Поиск заявок по названию"
          />
        </span>
      </div>

      {loading && <p className={styles.state}>Загрузка заявок...</p>}

      {failed && <p>Не удалось загрузить заявки. Попробуйте ещё раз.</p>}

      {!loading && !failed && items.length === 0 && (
        <p className={styles.emptyState}>
          {forms.searchQuery.trim()
            ? 'По вашему запросу заявок не найдено'
            : 'Здесь пока пусто'}
        </p>
      )}

      {items.length !== 0 && <FormsTable forms={forms.filtered} />}
    </section>
  );
});
