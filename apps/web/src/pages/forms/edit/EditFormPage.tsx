import { useEffect, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';

import { stores } from '@/stores';
import { defaultFormDraft, FormDraft } from '@/types/form-draft';
import { FormEditor } from '@/components/form-editor/FormEditor';
import styles from './EditFormPage.module.css';

export const EditFormPage = observer(function EditFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms } = stores;

  useEffect(() => {
    if (id) void forms.loadSelected(id, true);
  }, [forms, id]);

  const initialDraft = useMemo<FormDraft>(() => {
    const form = forms.selected;
    if (!form) return defaultFormDraft;
    return {
      name: form.name,
      description: form.description,
      organizers: form.organizers.map((item) => item.id),
      links: form.links,
      venues: form.venues.map((item) => item.id),
      themes: form.themes.map((item) => item.id),
      start: form.start,
      end: form.end,
      formatId: form.format.id,
      typeId: form.type.id,
      levelId: form.level.id,
      participants_students: form.participants.students,
      participants_employees: form.participants.employees,
      participants_others: form.participants.others,
      guests: form.guests.map((item) => ({
        userId: item.userId,
        rankId: item.rank.id,
      })),
      team: form.team.map((item) => ({
        userId: item.userId,
        roleId: item.role.id,
      })),
    };
  }, [forms.selected]);

  const submit = async (draft: FormDraft) => {
    if (!id) return false;
    const saved = await forms.update(id, draft);
    if (saved) navigate(`/forms/${id}`);
    return saved;
  };

  if (forms.loadingSelected)
    return <p className={styles.submitError}>Загрузка заявки...</p>;
  if (forms.selectedError)
    return <p className={styles.submitError}>{forms.selectedError}</p>;
  if (!forms.selected) return null;

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <h1>Редактирование заявки</h1>
        <p>{forms.selected.slug}</p>
      </header>
      <FormEditor
        initialDraft={initialDraft}
        submittingText="Сохранить"
        onSubmit={submit}
      />
    </section>
  );
});
