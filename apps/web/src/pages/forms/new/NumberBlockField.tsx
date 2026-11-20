import { InputNumber } from 'primereact/inputnumber';

import type { NumberBlock } from './form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './FormField.module.css';

interface NumberBlockFieldProps {
  field: NumberBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: number | null) => void;
}

export function NumberBlockField({ field, draft, invalid, onChange }: NumberBlockFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.labelText}>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </span>
      <InputNumber
        value={draft[field.field] as number | null}
        onValueChange={(event) => onChange(event.value ?? null)}
        className={invalid ? 'p-invalid' : ''}
        placeholder={field.placeholder}
        min={field.min}
        useGrouping={false}
      />
    </label>
  );
}
