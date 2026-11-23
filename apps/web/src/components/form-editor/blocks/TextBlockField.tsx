import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';

import type { TextBlock } from '../form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './FormField.module.css';

interface TextBlockFieldProps {
  field: TextBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: string) => void;
}

export function TextBlockField({
  field,
  draft,
  invalid,
  onChange,
}: TextBlockFieldProps) {
  const label = (
    <span className={styles.labelText}>
      {field.label}
      {field.required && <em aria-hidden="true">*</em>}
    </span>
  );

  return (
    <label className={styles.field}>
      {label}
      {field.type === 'textarea' ? (
        <InputTextarea
          value={draft[field.field] as string}
          onChange={(event) => onChange(event.target.value)}
          className={invalid ? 'p-invalid' : ''}
          rows={field.rows}
          autoResize
          placeholder={field.placeholder}
        />
      ) : (
        <InputText
          value={draft[field.field] as string}
          onChange={(event) => onChange(event.target.value)}
          className={invalid ? 'p-invalid' : ''}
          placeholder={field.placeholder}
        />
      )}
    </label>
  );
}
