import { Chips } from 'primereact/chips';

import type { LinksBlock } from './form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './FormField.module.css';

interface LinksBlockFieldProps {
  field: LinksBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: string[]) => void;
}

export function LinksBlockField({
  field,
  draft,
  invalid,
  onChange,
}: LinksBlockFieldProps) {
  return (
    <label className={styles.field}>
      <span className={styles.labelText}>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </span>
      <Chips
        value={draft.links}
        onChange={(event) => onChange(event.value ?? [])}
        className={`${styles.linksInput} ${invalid ? 'p-invalid' : ''}`}
        placeholder={draft.links ? undefined : field.placeholder}
        separator=","
      />
    </label>
  );
}
