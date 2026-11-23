import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import type { FormDraft } from '@/types/form-draft';
import type { TeamBlock } from '../form-config';
import styles from './TeamBlockField.module.css';
import { stores } from '@/stores';
import { TeamMember } from '@/types/team-member';
import { RoleCategory } from '@/types/role-category';
import { Role } from '@/types/role';
import { StudentSummary } from '@/types/student';

interface TeamBlockFieldProps {
  field: TeamBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: FormDraft['team']) => void;
}

export const TeamBlockField = observer(function TeamBlockField({
  field,
  draft,
  invalid,
  onChange,
}: TeamBlockFieldProps) {
  const { roles, selectedRoles, students } = stores;

  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [roleId, setRoleId] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  useEffect(() => {
    void roles.loadCategories();
  }, [roles]);

  useEffect(() => {
    if (categoryId) {
      void roles.loadRoles(categoryId);
    }
  }, [categoryId, roles]);

  useEffect(() => {
    selectedRoles.setIds(draft.team.map((member) => member.roleId));
    void selectedRoles.loadRoles();
  }, [draft.team, selectedRoles]);

  const categoryRoles = roles.categoryRoles(categoryId ?? '');
  const loadingRoles = roles.isLoadingRoles(categoryId ?? '');
  const rolesError = categoryId ? roles.rolesError.get(categoryId) : null;

  const selectCategory = (value: string | null) => {
    setCategoryId(value);
    setRoleId(null);
    setStudentId(null);
  };

  const addMember = () => {
    if (!categoryId || !roleId || !studentId) return;
    const alreadyAdded = draft.team.some(
      (member) => member.roleId === roleId && member.userId === studentId,
    );
    if (alreadyAdded) {
      return;
    }
    onChange([...draft.team, { userId: studentId, roleId }]);
    setStudentId(null);
  };

  const removeMember = (target: TeamMember) => {
    onChange(
      draft.team.filter(
        (member) =>
          !(member.roleId === target.roleId && member.userId === target.userId),
      ),
    );
  };

  const grouped: {
    category: RoleCategory;
    roles: {
      role: Role;
      members: StudentSummary[];
    }[];
  }[] = [];

  const studentsByRoles: Map<string, StudentSummary[]> = new Map();
  for (const member of draft.team) {
    const student = students.getById(member.userId) ?? {
      id: member.userId,
      fullName: 'Неизвестный студент',
    };
    if (!studentsByRoles.has(member.roleId)) {
      studentsByRoles.set(member.roleId, []);
    }
    studentsByRoles.get(member.roleId)!.push(student);
  }

  const existingRolesByCategory: Map<string, Role[]> = new Map();
  for (const roleId of studentsByRoles.keys()) {
    const roleWithCategory = selectedRoles.byId.get(roleId);
    if (!roleWithCategory) continue;
    const role = {
      ...roleWithCategory,
      categoryId: roleWithCategory.category.id,
    };
    if (!existingRolesByCategory.has(role.categoryId)) {
      existingRolesByCategory.set(role.categoryId, []);
    }
    existingRolesByCategory.get(role.categoryId)!.push(role);
  }

  for (const category of roles.categories) {
    const categoryRoles = existingRolesByCategory.get(category.id) ?? [];
    if (categoryRoles.length === 0) continue;
    grouped.push({
      category,
      roles: categoryRoles.map((role) => ({
        role,
        members: studentsByRoles.get(role.id) ?? [],
      })),
    });
  }

  return (
    <fieldset
      className={`${styles.teamField} ${invalid ? styles.invalid : ''}`}
    >
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
              options={roles.categories}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => selectCategory(event.value ?? null)}
              placeholder={
                roles.loadingCategories
                  ? 'Загрузка категорий...'
                  : 'Выберите категорию'
              }
              filter
              disabled={roles.loadingCategories}
              emptyMessage={roles.categoriesError ?? 'Категории не найдены'}
            />
          </label>

          <label>
            <span>Роль</span>
            <Dropdown
              value={roleId}
              options={categoryRoles}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => setRoleId(event.value ?? null)}
              placeholder={
                !categoryId
                  ? 'Сначала выберите категорию'
                  : loadingRoles
                    ? 'Загрузка ролей...'
                    : 'Выберите роль'
              }
              filter
              disabled={!categoryId || loadingRoles}
              emptyMessage={rolesError ?? 'Роли не найдены'}
            />
          </label>

          <label>
            <span>Организатор</span>
            <Dropdown
              value={studentId}
              options={students.items}
              optionLabel="fullName"
              optionValue="id"
              onChange={(event) => setStudentId(event.value ?? null)}
              placeholder={
                students.loading
                  ? 'Загрузка студентов...'
                  : 'Выберите организатора'
              }
              filter
              disabled={students.loading || !roleId}
              emptyMessage={students.error ?? 'Студенты не найдены'}
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
          {grouped.map(({ category, roles }) => (
            <section className={styles.categoryGroup} key={category.id}>
              <h3>{category.name}</h3>
              {roles.map(({ role, members }) => (
                <div className={styles.roleGroup} key={role.id}>
                  <h4>{role.name}</h4>
                  <ul>
                    {members.map((student) => (
                      <li key={student.id}>
                        <span>{student.fullName}</span>
                        <Button
                          type="button"
                          icon="pi pi-times"
                          rounded
                          text
                          aria-label={`Удалить ${student.fullName}`}
                          onClick={() =>
                            removeMember({
                              userId: student.id,
                              roleId: role.id,
                            })
                          }
                        />
                      </li>
                    ))}
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
