import {useState} from 'react';
import {observer} from 'mobx-react-lite';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';

import type {Student} from '@/types/student';
import type {RoleCategory} from '@/types/role';
import type {Role} from '@/types/role-category';
import type {FormDraft} from '@/types/form-draft';
import type {TeamBlock} from './form-config';
import styles from './TeamBlockField.module.css';

interface TeamBlockFieldProps {
  field: TeamBlock;
  draft: FormDraft;
  categories: RoleCategory[];
  roles: Record<string, Role>;
  students: Student[];
  loadingCategories: boolean;
  loadingRoles: boolean;
  loadingStudents: boolean;
  categoriesError: string | null;
  rolesError: string | null;
  studentsError: string | null;
  invalid: boolean;
  onLoadRoles: (categoryId: string) => void;
  onChange: (value: FormDraft['team']) => void;
}

export const TeamBlockField = observer(function TeamBlockField({
  field,
  draft,
  categories,
  roles,
  students,
  loadingCategories,
  loadingRoles,
  loadingStudents,
  categoriesError,
  rolesError,
  studentsError,
  invalid,
  onLoadRoles,
  onChange,
}: TeamBlockFieldProps) {
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  const categoryRoles = Object.values(roles).filter(
    (role) => role.category.id === categoryId,
  );

  const selectCategory = (value: string | null) => {
    setCategoryId(value);
    setRoleId(null);
    setStudentId(null);
    if (value) void onLoadRoles(value);
  };

  const addMember = () => {
    if (!roleId || !studentId) return;

    const alreadyAdded = draft.team.some(
      (member) => member.roleId === roleId && member.userId === studentId,
    );
    if (!alreadyAdded) {
      onChange([...draft.team, { roleId, userId: studentId }]);
    }
  };

  const removeMember = (roleIdToRemove: string, studentIdToRemove: string) => {
    onChange(draft.team.filter(
      (member) => !(member.roleId === roleIdToRemove && member.userId === studentIdToRemove),
    ));
  };

  const grouped = categories.map((category) => {
    const categoryRoleIds = new Set(
      Object.values(roles)
        .filter((role) => role.category.id === category.id)
        .map((role) => role.id),
    );

    const members = draft.team.filter((member) => categoryRoleIds.has(member.roleId));
    if (members.length === 0) return null;

    const roleGroups = Object.values(roles)
      .filter((role) => role.category.id === category.id)
      .map((role) => ({
        role,
        members: members.filter((member) => member.roleId === role.id),
      }))
      .filter((group) => group.members.length > 0);

    return { category, roleGroups };
  }).filter((group): group is NonNullable<typeof group> => group !== null);

  return (
    <fieldset className={`${styles.teamField} ${invalid ? styles.invalid : ''}`}>
      <legend>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </legend>

      <div className={styles.controls}>
        <div className={styles.fields}>
          <label>
            <span>Категория роли</span>
            <Dropdown
              value={categoryId}
              options={categories}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => selectCategory(event.value ?? null)}
              placeholder={loadingCategories ? 'Загрузка категорий...' : 'Выберите категорию'}
              filter
              disabled={loadingCategories}
              emptyMessage={categoriesError ?? 'Категории не найдены'}
            />
          </label>

          <label>
            <span>Роль</span>
            <Dropdown
              value={roleId}
              options={categoryRoles}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => {
                setRoleId(event.value ?? null);
                setStudentId(null);
              }}
              placeholder={!categoryId ? 'Сначала выберите категорию' : loadingRoles ? 'Загрузка ролей...' : 'Выберите роль'}
              filter
              disabled={!categoryId || loadingRoles}
              emptyMessage={rolesError ?? 'Роли не найдены'}
            />
          </label>

          <label>
            <span>Организатор</span>
            <Dropdown
              value={studentId}
              options={students}
              optionLabel="fullName"
              optionValue="id"
              onChange={(event) => setStudentId(event.value ?? null)}
              placeholder={loadingStudents ? 'Загрузка студентов...' : 'Выберите организатора'}
              filter
              disabled={loadingStudents || !roleId}
              emptyMessage={studentsError ?? 'Студенты не найдены'}
            />
          </label>
        </div>

        <Button
          type="button"
          icon="pi pi-plus"
          label="Добавить"
          onClick={addMember}
          disabled={!categoryId || !roleId || !studentId}
        />
      </div>

      {grouped.length === 0 ? (
        <p className={styles.empty}>Добавьте хотя бы одного организатора</p>
      ) : (
        <div className={styles.groups}>
          {grouped.map(({ category, roleGroups }) => (
            <section className={styles.categoryGroup} key={category.id}>
              <h3>{category.name}</h3>
              {roleGroups.map(({ role, members }) => (
                <div className={styles.roleGroup} key={role.id}>
                  <h4>{role.name}</h4>
                  <ul>
                    {members.map((member) => {
                      const student = students.find((item) => item.id === member.userId);
                      if (!student) return null;
                      return (
                        <li key={student.id}>
                          <span>{student.fullName}</span>
                          <Button
                            type="button"
                            icon="pi pi-times"
                            rounded
                            text
                            aria-label={`Удалить ${student.fullName}`}
                            onClick={() => removeMember(role.id, student.id)}
                          />
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
    </fieldset>
  );
});
