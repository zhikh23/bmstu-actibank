import { MultiSelect } from 'primereact/multiselect';

import type { MultiSelectBlock } from './form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './FormField.module.css';

export type SelectOption = object;

interface SelectBlockFieldProps {
  field: MultiSelectBlock;
  draft: FormDraft;
  options: SelectOption[];
  invalid: boolean;
  disabled?: boolean;
  emptyMessage?: string;
  onChange: (value: string[]) => void;
}

export function SelectBlockField({
  field,
  draft,
  options,
  invalid,
  disabled,
  emptyMessage,
  onChange,
}: SelectBlockFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.labelText}>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </span>
      <MultiSelect
        value={draft[field.field]}
        options={options}
        optionLabel={field.optionLabel}
        optionValue={field.optionValue}
        onChange={(event) =>
          onChange(
            Array.isArray(event.value)
              ? event.value.filter(
                  (value): value is string => typeof value === 'string',
                )
              : [],
          )
        }
        className={`${styles.multiSelect} ${invalid ? 'p-invalid' : ''}`}
        placeholder={field.placeholder}
        display="chip"
        filter
        disabled={disabled}
        emptyMessage={emptyMessage}
      />
    </label>
  );
}
