import type { FieldBlock } from './form-config';
import { DateBlockField } from './DateBlockField';
import { SelectBlockField, type SelectOption } from './SelectBlockField';
import { TextBlockField } from './TextBlockField';
import { LinksBlockField } from './LinksBlockField';
import { NumberBlockField } from './NumberBlockField';
import { DropdownBlockField } from './DropdownBlockField';
import { VenuesBlockField } from './VenuesBlockField';
import {FormDraft} from "@/types/form-draft";
import type {Building} from "@/types/building";
import type {Venue} from "@/types/venue";

interface FormFieldProps {
  field: FieldBlock;
  draft: FormDraft;
  options: Record<string, SelectOption[]>;
  optionState?: Record<string, { loading: boolean; error: string | null }>;
  buildings?: Building[];
  venues?: Record<string, Venue>;
  loadingBuildings?: boolean;
  loadingVenues?: boolean;
  buildingsError?: string | null;
  venuesError?: string | null;
  onLoadVenues?: (buildingId: string) => void;
  invalid: boolean;
  onChange: <K extends keyof FormDraft>(field: K, value: FormDraft[K]) => void;
}

export function FormField({
  field,
  draft,
  options,
  optionState,
  buildings = [],
  venues = {},
  loadingBuildings = false,
  loadingVenues = false,
  buildingsError,
  venuesError,
  onLoadVenues = () => undefined,
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
        emptyMessage={optionState?.[field.optionsKey]?.error ?? 'Опции не найдены'}
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
        emptyMessage={optionState?.[field.optionsKey]?.error ?? 'Опции не найдены'}
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

  if (field.type === 'venues') {
    return (
      <VenuesBlockField
        field={field}
        draft={draft}
        buildings={buildings}
        venues={venues}
        loadingBuildings={loadingBuildings}
        loadingVenues={loadingVenues}
        buildingsError={buildingsError ?? null}
        venuesError={venuesError ?? null}
        invalid={invalid}
        onLoadVenues={onLoadVenues}
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
