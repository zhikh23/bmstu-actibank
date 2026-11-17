import { FormsTable } from './ui/FormsTable';
import { stores } from '@/stores'
import styles from './forms.module.css';
import { observer } from 'mobx-react-lite'
import { useEffect } from 'react';

export const FormsNewPage = observer(function FormsNewPage() {
  const { forms } = stores;

  useEffect(() => {
    void forms.load();
  }, [forms])

  const items = forms.filtered
  const loading = forms.loading && forms.items.length === 0
  const failed = forms.error !== null && forms.items.length === 0

  return (
    <section className={styles.page}>
      <div className={styles.heading}>
        <h1>Заявки на регистрацию мероприятий</h1>
        <p>Все активные заявки на регистрацию мероприятия в сфере молодёжной политики МГТУ им. Н.Э. Баумана</p>
      </div>

      {loading && <p className={styles.state}>Загрузка заявок...</p>}

      {failed && <p>Не удалось загрузить заявки. Попробуйте ещё раз.</p>}

      {!loading && !failed && items.length === 0 && (
        <p>Здесь пока пусто</p>
      )}

      {items.length !== 0 && (
        <FormsTable forms={forms.items} />
      )}
    </section>
  );
})
