import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { stores } from '@/stores';
import { defaultFormDraft } from '@/types/form-draft';
import styles from './NewFormPage.module.css';
import { FormEditor } from '@/components/form-editor/FormEditor';

export const NewFormPage = observer(function NewFormPage() {
  const navigate = useNavigate();
  const { forms } = stores;

  const submit = async (draft: typeof defaultFormDraft) => {
    const formId = await forms.create(draft);
    if (formId) {
      navigate('/forms');
      return true;
    }
    return false;
  };

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <h1>Создание формы мероприятия</h1>
        <p>
          Внимательно заполните форму для регистрации прошедшего мероприятия
        </p>
      </header>
      <FormEditor initialDraft={defaultFormDraft} onSubmit={submit} />
    </section>
  );
});
