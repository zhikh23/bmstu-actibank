import { useEffect, useState } from 'react';
import { getForm, formAction } from '../../../entities/form/api.js';
import { statusLabels } from '../../../entities/form/model.js';
import { getApiError } from '../../../shared/api/client.js';
import { formatDateTime } from '../../../shared/lib/format.js';

export function FormDetailPage({ id, user }) {
  const [state, setState] = useState({ loading: true, error: '', form: null });
  const [actionState, setActionState] = useState('');

  const load = () => {
    setState((current) => ({ ...current, loading: true, error: '' }));
    getForm(id)
      .then((form) => setState({ loading: false, error: '', form }))
      .catch((error) => {
        const apiError = getApiError(error);
        setState({ loading: false, error: apiError.status === 404 ? 'Форма не найдена.' : apiError.message, form: null });
      });
  };
  useEffect(load, [id]);

  async function runAction(action) {
    setActionState(action);
    try {
      await formAction(id, action);
      load();
    } catch (error) {
      setState((current) => ({ ...current, error: getApiError(error).message }));
    } finally {
      setActionState('');
    }
  }

  if (state.loading) return <main className="main-content"><div className="content-card state-box">Загрузка формы…</div></main>;
  if (state.error && !state.form) return <main className="main-content"><div className="content-card state-box error-state"><strong>{state.error}</strong><button className="secondary-button" onClick={load}>Повторить</button></div></main>;
  const form = state.form;
  const canEdit = form.status === 'draft' && form.submitterId === user?.id;
  return (
    <main className="main-content">
      <div className="breadcrumbs"><a href="/">Главная</a><span>›</span><a href="/forms">Формы мероприятий</a><span>›</span><span>{form.slug}</span></div>
      <div className="page-heading"><div><h1>{form.name}</h1><p>{form.slug} · {statusLabels[form.status] || form.status}</p></div></div>
      {state.error && <div className="form-alert" role="alert">{state.error}</div>}
      <section className="content-card detail-grid">
        <Detail label="Описание">{form.description || '—'}</Detail>
        <Detail label="Период">{formatDateTime(form.start)} — {formatDateTime(form.end)}</Detail>
        <Detail label="Формат">{form.format?.name || '—'}</Detail>
        <Detail label="Тип">{form.type?.name || '—'}</Detail>
        <Detail label="Уровень">{form.level?.name || '—'}</Detail>
        <Detail label="Создана">{formatDateTime(form.createdAt)}</Detail>
        <Detail label="Обновлена">{formatDateTime(form.updatedAt)}</Detail>
        {form.reason && <Detail label="Причина возврата/отклонения">{form.reason}</Detail>}
      </section>
      <div className="detail-actions">
        {canEdit && <a className="primary-button" href={`/forms/${id}/edit`}>Редактировать</a>}
        {form.status === 'draft' && canEdit && <button className="primary-button" disabled={!!actionState} onClick={() => runAction('mark-ready')}>{actionState === 'mark-ready' ? 'Отправка…' : 'Отправить на модерацию'}</button>}
        {form.status === 'pending' && user?.roles?.includes('moderator') && <button className="primary-button" disabled={!!actionState} onClick={() => runAction('start-review')}>Начать проверку</button>}
        {form.status === 'reviewing' && user?.roles?.includes('moderator') && <><button className="primary-button" disabled={!!actionState} onClick={() => runAction('approve')}>Одобрить</button><button className="secondary-button" disabled={!!actionState} onClick={() => runAction('reject')}>Отклонить</button></>}
      </div>
    </main>
  );
}

function Detail({ label, children }) {
  return <div className="detail-item"><span>{label}</span><strong>{children}</strong></div>;
}
