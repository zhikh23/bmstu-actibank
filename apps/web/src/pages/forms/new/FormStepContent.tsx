import type { FormBlock } from './form-config';
import { FormField } from './FormField';
import type { SelectOption } from './SelectBlockField';
import styles from './FormStepContent.module.css';
import {FormDraft} from "@/types/form-draft";
import type {Building} from "@/types/building";
import type {Venue} from "@/types/venue";
import type {RoleCategory} from "@/types/role";
import type {Role} from "@/types/role-category";
import type {StudentSummary} from "@/types/student";

interface LookupState {
  options: Record<string, SelectOption[]>;
  optionState?: Record<string, { loading: boolean; error: string | null }>;
  buildings?: Building[];
  venues?: Record<string, Venue>;
  loadingBuildings?: boolean;
  loadingVenues?: boolean;
  buildingsError?: string | null;
  venuesError?: string | null;
  roleCategories?: RoleCategory[];
  roles?: Record<string, Role>;
  students?: StudentSummary[];
  loadingRoleCategories?: boolean;
  loadingRoles?: boolean;
  loadingStudents?: boolean;
  roleCategoriesError?: string | null;
  rolesError?: string | null;
  studentsError?: string | null;
  onLoadVenues?: (buildingId: string) => void;
  onLoadRoles?: (categoryId: string) => void;
}

interface FormStepContentProps {
  blocks: FormBlock[];
  placeholder?: string;
  draft: FormDraft;
  attempted: boolean;
  onChange: <K extends keyof FormDraft>(field: K, value: FormDraft[K]) => void;
  isFilled: (field: keyof FormDraft) => boolean;
  lookupState: LookupState;
}

export function FormStepContent({
  blocks,
  placeholder,
  draft,
  attempted,
  onChange,
  isFilled,
  lookupState,
}: FormStepContentProps) {
  const sharedProps = {
    draft,
    ...lookupState,
  };

  const isInvalid = (
    field: keyof FormDraft,
    required: boolean | undefined,
    attempted: boolean,
    isFilled: (f: keyof FormDraft) => boolean,
  ) => attempted && Boolean(required) && !isFilled(field);

  const renderBlock = (block: FormBlock) => {
    if (block.type === 'group') {
      return (
        <div className={styles.dateGrid} key={block.fields.map(({ field }) => field).join('-')}>
          {block.fields.map((field) => (
            <FormField
              key={field.field}
              field={field}
              {...sharedProps}
              invalid={isInvalid(field.field, field.required, attempted, isFilled)}
              onChange={onChange}
            />
          ))}
        </div>
      );
    }

    return (
      <FormField
        key={block.field}
        field={block}
        {...sharedProps}
        invalid={isInvalid(block.field, block.required, attempted, isFilled)}
        onChange={onChange}
      />
    );
  };

  if (blocks.length === 0) {
    return (
      <div className={styles.placeholder}>
        <i className="pi pi-check-circle" aria-hidden="true" />
        <p>{placeholder}</p>
        <small>Здесь появятся дополнительные поля в следующем шаге разработки.</small>
      </div>
    );
  }

  return <div className={styles.fields}>{blocks.map(renderBlock)}</div>;
}
