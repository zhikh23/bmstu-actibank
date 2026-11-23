import type { FieldBlock } from '../form-config';
import { DateBlockField } from './DateBlockField';
import { SelectBlockField, type SelectOption } from './SelectBlockField';
import { TextBlockField } from './TextBlockField';
import { LinksBlockField } from './LinksBlockField';
import { NumberBlockField } from './NumberBlockField';
import { DropdownBlockField } from './DropdownBlockField';
import { VenuesBlockField } from './VenuesBlockField';
import { TeamBlockField } from './TeamBlockField';
import { FormDraft } from '@/types/form-draft';

interface FormFieldProps {
  field: FieldBlock;
  draft: FormDraft;
  options: Record<string, SelectOption[]>;
  optionState?: Record<string, { loading: boolean; error: string | null }>;
  invalid: boolean;
  onChange: <K extends keyof FormDraft>(field: K, value: FormDraft[K]) => void;
}

export function FormField({
  field,
  draft,
  options,
  optionState,
  invalid,
  onChange,
}: FormFieldProps) {
  if (field.type === 'date') {
    return (
      <DateBlockField
        field={field}
        draft={draft}
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'multiSelect') {
    return (
      <SelectBlockField
        field={field}
        draft={draft}
        options={options[field.optionsKey] ?? []}
        disabled={optionState?.[field.optionsKey]?.loading}
        emptyMessage={
          optionState?.[field.optionsKey]?.error ?? 'Опции не найдены'
        }
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'links') {
    return (
      <LinksBlockField
        field={field}
        draft={draft}
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'select') {
    return (
      <DropdownBlockField
        field={field}
        draft={draft}
        options={options[field.optionsKey] ?? []}
        disabled={optionState?.[field.optionsKey]?.loading}
        emptyMessage={
          optionState?.[field.optionsKey]?.error ?? 'Опции не найдены'
        }
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'number') {
    return (
      <NumberBlockField
        field={field}
        draft={draft}
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'team') {
    return (
      <TeamBlockField
        field={field}
        draft={draft}
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  if (field.type === 'venues') {
    return (
      <VenuesBlockField
        field={field}
        draft={draft}
        invalid={invalid}
        onChange={(value) => onChange(field.field, value)}
      />
    );
  }

  return (
    <TextBlockField
      field={field}
      draft={draft}
      invalid={invalid}
      onChange={(value) => onChange(field.field, value)}
    />
  );
}
