import styles from './FormDetails.module.css';
import { FormDetail } from '@/types/form-detail';
import { formatDateTime } from '@/shared/lib/format-date';
import { useEffect } from 'react';
import { stores } from '@/stores';

const statusLabels: Record<string, string> = {
  draft: 'Черновик',
  pending: 'Ожидает проверки',
  reviewing: 'На проверке',
  approved: 'Одобрено',
  rejected: 'Отклонено',
  canceled: 'Отменено',
};

export interface FormDetailProps {
  form: FormDetail;
}

export function FormDetails({ form }: FormDetailProps) {
  const { students } = stores;

  useEffect(() => {
    void students.load();
  }, [students]);

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

  return (
    <div className={styles.card}>
      <dl className={styles.details}>
        <div className={styles.field}>
          <dt>Статус</dt>
          <dd>{statusLabels[form.status]}</dd>
        </div>

        {form.reason && (
          <div className={styles.field}>
            <dt>Причина</dt>
            <dd>{form.reason}</dd>
          </div>
        )}

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
          <dd>{form.organizers.map((item) => item.name).join(', ') || '—'}</dd>
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
                  <span key={g.userId + '-' + g.rank.id}>
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
      </dl>
    </div>
  );
}
