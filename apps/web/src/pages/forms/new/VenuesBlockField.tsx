import {useState} from 'react';
import {Button} from 'primereact/button';
import {Dropdown} from 'primereact/dropdown';

import type {Building} from '@/types/building';
import type {Venue} from '@/types/venue';
import type {VenuesBlock} from './form-config';
import type {FormDraft} from '@/types/form-draft';
import styles from './VenuesBlockField.module.css';
import {observer} from "mobx-react-lite";

interface VenuesBlockFieldProps {
  field: VenuesBlock;
  draft: FormDraft;
  buildings: Building[];
  venues: Record<string, Venue>;
  loadingBuildings: boolean;
  loadingVenues: boolean;
  buildingsError: string | null;
  venuesError: string | null;
  invalid: boolean;
  onLoadVenues: (buildingId: string) => void;
  onChange: (value: string[]) => void;
}

export const VenuesBlockField = observer(function VenuesBlockField({
  field,
  draft,
  buildings,
  venues,
  loadingBuildings,
  loadingVenues,
  buildingsError,
  venuesError,
  invalid,
  onLoadVenues,
  onChange,
}: VenuesBlockFieldProps) {
  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);

  const selected = draft.venues.map((venueId) => venues[venueId]).filter(Boolean);
  const buildingVenues = Object.values(venues).filter((venue) => venue.building.id === buildingId);

  const selectBuilding = (value: string | null) => {
    setBuildingId(value);
    setVenueId(null);
    if (value) {
      void onLoadVenues(value);
    }
  };

  const addVenue = () => {
    if (!buildingId || !venueId || selected.some((venue) => venue.id === venueId)) {
      return;
    }
    if (venues[venueId]) {
      onChange([ ...draft.venues, venueId ]);
    }
  }

  const removeVenue = (venueIdToRemove: string) => {
    onChange(draft.venues.filter((id) => id !== venueIdToRemove));
  };

  return (
    <fieldset className={`${styles.venuesField} ${invalid ? styles.invalid : ''}`}>
      <legend>
        {field.label}
        {field.required && <em aria-hidden="true">*</em>}
      </legend>

      <div className={styles.controls}>
        <div className={styles.fields}>
          <label>
            <span>Здание</span>
            <Dropdown
              value={buildingId}
              options={buildings}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => selectBuilding(event.value ?? null)}
              placeholder={loadingBuildings ? 'Загрузка зданий...' : 'Выберите здание'}
              filter
              disabled={loadingBuildings}
              emptyMessage={buildingsError ?? 'Здания не найдены'}
            />
          </label>

          <label>
            <span>Место проведения</span>
            <Dropdown
              value={venueId}
              options={buildingVenues}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => setVenueId(event.value ?? null)}
              placeholder={!buildingId ? 'Сначала выберите здание' : loadingVenues ? 'Загрузка помещений...' : 'Выберите место'}
              filter
              disabled={!buildingId || loadingVenues}
              emptyMessage={venuesError ?? 'Помещения не найдены'}
            />
          </label>
        </div>

        <Button
          type="button"
          icon="pi pi-plus"
          label="Добавить"
          onClick={addVenue}
          disabled={!buildingId || !venueId}
        />
      </div>

      {draft.venues.length === 0 ? (
        <p className={styles.empty}>Добавьте хотя бы одно место проведения</p>
      ) : (
        <ul className={styles.entries}>
          {selected.map((venue) => (
            <li key={venue.id}>
              <span>
                <strong>{venue.building.name}</strong>
                <small>{venue.name}</small>
              </span>
              <Button
                type="button"
                icon="pi pi-times"
                rounded
                text
                aria-label={`Удалить ${venue.name}`}
                onClick={() => removeVenue(venue.id)}
              />
            </li>
          ))}
        </ul>
      )}
    </fieldset>
  );
});
