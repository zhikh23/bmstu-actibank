import { Calendar } from 'primereact/calendar';

import type { DateBlock } from './form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './FormField.module.css';

interface DateBlockFieldProps {
  field: DateBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: Date | null) => void;
}

export function DateBlockField({
  field,
  draft,
  invalid,
  onChange,
}: DateBlockFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.labelText}>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </span>
      <Calendar
        value={draft[field.field] as Date | null}
        onChange={(event) => onChange(event.value ?? null)}
        className={invalid ? 'p-invalid' : ''}
        showTime
        hourFormat="24"
        showIcon
        placeholder={field.placeholder}
      />
    </label>
  );
}
