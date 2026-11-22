import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useNavigate, useParams } from 'react-router-dom';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import { Message } from 'primereact/message';

import { stores } from '@/stores';
import { formatDateTime } from '@/shared/lib/format-date';
import styles from './FormSummaryPage.module.css';

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  pending: 'На рассмотрении',
  reviewing: 'На проверке',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  canceled: 'Отменено',
};

export const FormSummaryPage = observer(function FormSummaryPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { forms, auth, students } = stores;
  const [revisionOpen, setRevisionOpen] = useState(false);
  const [revisionReason, setRevisionReason] = useState('');

  useEffect(() => {
    void auth.load();
  }, [auth]);
  useEffect(() => {
    void students.load();
  }, [students]);
  useEffect(() => {
    if (id) void forms.loadSelected(id, true);
  }, [forms, id]);

  const form = forms.selected;
  const isApplicant = auth.me?.roles.includes('applicant') ?? false;
  const isModerator = auth.me?.roles.includes('moderator') ?? false;

  const reload = async () => {
    if (id) await forms.loadSelected(id, true);
  };

  const perform = async (action: () => Promise<boolean>) => {
    if (await action()) await reload();
  };

  if (forms.loadingSelected)
    return <p className={styles.state}>Загрузка заявки...</p>;
  if (forms.selectedError)
    return <p className={styles.state}>{forms.selectedError}</p>;
  if (!form) return null;

  const teamByCategory = form.team.reduce<
    Array<{
      id: string;
      name: string;
      roles: Array<{ id: string; name: string; members: typeof form.team }>;
    }>
  >((categories, member) => {
    const categoryId = member.role.category.id;
    let category = categories.find((item) => item.id === categoryId);
    if (!category) {
      category = { id: categoryId, name: member.role.category.name, roles: [] };
      categories.push(category);
    }
    let role = category.roles.find((item) => item.id === member.role.id);
    if (!role) {
      role = { id: member.role.id, name: member.role.name, members: [] };
      category.roles.push(role);
    }
    role.members.push(member);
    return categories;
  }, []);

  const sendForRevision = async () => {
    if (!revisionReason.trim()) return;
    await perform(() => forms.reject(form.id, revisionReason.trim()));
    setRevisionOpen(false);
  };

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <div className={styles.title}>
          <span className={styles.slug}>{form.slug}</span>
          <h1>{form.name}</h1>
        </div>
        <div className={styles.actions}>
          {isApplicant && (
            <>
              <span
                title={
                  form.status !== 'draft'
                    ? 'Редактировать можно только заявку в статусе «Черновик»'
                    : undefined
                }
              >
                <Button
                  label="Редактировать"
                  icon="pi pi-pencil"
                  disabled={form.status !== 'draft'}
                  onClick={() => navigate(`/forms/${form.id}/edit`)}
                />
              </span>
              {form.status === 'draft' && (
                <Button
                  label="Отметить готовой"
                  icon="pi pi-check"
                  onClick={() => perform(() => forms.markReady(form.id))}
                />
              )}
              {form.status === 'pending' && (
                <Button
                  label="Вернуть в черновик"
                  icon="pi pi-replay"
                  onClick={() => perform(() => forms.convertToDraft(form.id))}
                />
              )}
              {['draft', 'pending'].includes(form.status) && (
                <Button
                  label="Отменить заявку"
                  icon="pi pi-times"
                  severity="danger"
                  outlined
                  onClick={() => {
                    if (
                      window.confirm(
                        'Отменить заявку? Это действие необратимо.',
                      )
                    )
                      void perform(() => forms.cancel(form.id));
                  }}
                />
              )}
            </>
          )}
          {isModerator && (
            <>
              {form.status === 'pending' && (
                <Button
                  label="Взять на проверку"
                  icon="pi pi-eye"
                  onClick={() => perform(() => forms.startReview(form.id))}
                />
              )}
              {form.status === 'reviewing' && (
                <>
                  <Button
                    label="Подтвердить"
                    icon="pi pi-check"
                    onClick={() => perform(() => forms.approve(form.id))}
                  />
                  <Button
                    label="Отклонить"
                    icon="pi pi-ban"
                    severity="danger"
                    onClick={() => perform(() => forms.reject(form.id, null))}
                  />
                  <Button
                    label="Отправить на доработку"
                    icon="pi pi-replay"
                    outlined
                    onClick={() => setRevisionOpen(true)}
                  />
                </>
              )}
            </>
          )}
        </div>
      </header>

      {forms.actionError && (
        <Message
          severity="error"
          text={forms.actionError}
          className={styles.error}
        />
      )}

      <div className={styles.card}>
        <dl className={styles.details}>
          <div className={styles.field}>
            <dt>Статус</dt>
            <dd>{statusLabels[form.status]}</dd>
          </div>
          <div className={styles.field}>
            <dt>Дата создания</dt>
            <dd>{formatDateTime(form.createdAt)}</dd>
          </div>

          <div className={styles.field}>
            <dt>Описание</dt>
            <dd>{form.description || '—'}</dd>
          </div>

          <div className={styles.dateRow}>
            <div className={styles.field}>
              <dt>Начало</dt>
              <dd>{formatDateTime(form.start)}</dd>
            </div>
            <div className={styles.field}>
              <dt>Окончание</dt>
              <dd>{formatDateTime(form.end)}</dd>
            </div>
          </div>

          <div className={styles.field}>
            <dt>Организаторы</dt>
            <dd>
              {form.organizers.map((item) => item.name).join(', ') || '—'}
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Места проведения</dt>
            <dd>
              {form.venues
                .map((item) => `${item.name} (${item.building.name})`)
                .join(', ') || '—'}
            </dd>
          </div>

          <div className={styles.optionsRow}>
            <div className={styles.field}>
              <dt>Уровень</dt>
              <dd>{form.level.name}</dd>
            </div>
            <div className={styles.field}>
              <dt>Формат</dt>
              <dd>{form.format.name}</dd>
            </div>
            <div className={styles.field}>
              <dt>Тип мероприятия</dt>
              <dd>{form.type.name}</dd>
            </div>
            <div className={styles.field}>
              <dt>Темы</dt>
              <dd>{form.themes.map((item) => item.name).join(', ') || '—'}</dd>
            </div>
          </div>

          <div className={styles.field}>
            <dt>Ссылки</dt>
            <dd>
              {form.links.length
                ? form.links.map((l) => (
                    <a
                      key={l}
                      className={styles.link}
                      href={l}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {l}
                      <br />
                    </a>
                  ))
                : '—'}
            </dd>
          </div>

          <div className={styles.participantsRow}>
            <div className={styles.field}>
              <dt>Студенты</dt>
              <dd>{form.participants.students}</dd>
            </div>
            <div className={styles.field}>
              <dt>Сотрудники</dt>
              <dd>{form.participants.employees}</dd>
            </div>
            <div className={styles.field}>
              <dt>Прочие участники</dt>
              <dd>{form.participants.others}</dd>
            </div>
            <div className={styles.field}>
              <dt>Суммарное количество</dt>
              <dd>
                {form.participants.students +
                  form.participants.employees +
                  form.participants.others}
              </dd>
            </div>
          </div>

          <div className={styles.field}>
            <dt>Гости</dt>
            <dd>
              {form.guests.length
                ? form.guests.map((g, i) => (
                    <span key={g.userId + g.rank.id}>
                      {g.userId} — {g.rank.name}
                      {i < form.guests.length - 1 && <br />}
                    </span>
                  ))
                : '—'}
            </dd>
          </div>
          <div className={styles.field}>
            <dt>Команда организаторов</dt>
            <dd>
              {teamByCategory.length === 0 ? (
                '—'
              ) : (
                <div className={styles.team}>
                  {teamByCategory.map((category) => (
                    <section className={styles.teamCategory} key={category.id}>
                      <h3>{category.name}</h3>
                      {category.roles.map((role) => (
                        <div className={styles.teamRole} key={role.id}>
                          <strong>{role.name}</strong>
                          <ul>
                            {role.members.map((member) => {
                              const student = students.getById(member.userId);
                              return (
                                <li key={member.userId}>
                                  {student?.fullName ?? 'ФИО не загружено'}
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      ))}
                    </section>
                  ))}
                </div>
              )}
            </dd>
          </div>
          {form.reason && (
            <div className={styles.field}>
              <dt>Причина</dt>
              <dd>{form.reason}</dd>
            </div>
          )}
        </dl>
      </div>

      <Dialog
        header="Причина отправки на доработку"
        visible={revisionOpen}
        onHide={() => setRevisionOpen(false)}
        footer={
          <div>
            <Button
              label="Отмена"
              text
              onClick={() => setRevisionOpen(false)}
            />
            <Button
              label="Отправить"
              disabled={!revisionReason.trim()}
              onClick={sendForRevision}
            />
          </div>
        }
      >
        <InputTextarea
          value={revisionReason}
          onChange={(event) => setRevisionReason(event.target.value)}
          rows={5}
          autoResize
          className={styles.reasonInput}
          placeholder="Укажите, что нужно исправить"
        />
      </Dialog>
    </section>
  );
});
