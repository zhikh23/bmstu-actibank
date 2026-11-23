import { Dropdown } from 'primereact/dropdown';

import type { SelectBlock } from '../form-config';
import type { FormDraft } from '@/types/form-draft';
import type { SelectOption } from './SelectBlockField';
import styles from './FormField.module.css';

interface DropdownBlockFieldProps {
  field: SelectBlock;
  draft: FormDraft;
  options: SelectOption[];
  invalid: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  onChange: (value: string | null) => void;
}

export function DropdownBlockField({
  field,
  draft,
  options,
  invalid,
  disabled,
  emptyMessage,
  onChange,
}: DropdownBlockFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.labelText}>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </span>
      <Dropdown
        value={draft[field.field] as string | null}
        options={options}
        optionLabel={field.optionLabel}
        optionValue={field.optionValue}
        onChange={(event) => onChange(event.value ?? null)}
        className={`${styles.dropdown} ${invalid ? 'p-invalid' : ''}`}
        placeholder={field.placeholder}
        filter
        disabled={disabled}
        emptyMessage={emptyMessage}
      />
    </label>
  );
}
