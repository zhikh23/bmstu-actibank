import { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';

import type { VenuesBlock } from './form-config';
import type { FormDraft } from '@/types/form-draft';
import styles from './VenuesBlockField.module.css';
import { observer } from 'mobx-react-lite';
import { stores } from '@/stores';

interface VenuesBlockFieldProps {
  field: VenuesBlock;
  draft: FormDraft;
  invalid: boolean;
  onChange: (value: string[]) => void;
}

export const VenuesBlockField = observer(function VenuesBlockField({
  field,
  draft,
  invalid,
  onChange,
}: VenuesBlockFieldProps) {
  const { venues, selectedVenues } = stores;

  const [buildingId, setBuildingId] = useState<string | null>(null);
  const [venueId, setVenueId] = useState<string | null>(null);

  useEffect(() => {
    void venues.loadBuildings();
  }, [venues]);

  useEffect(() => {
    if (buildingId) {
      void venues.loadVenues(buildingId);
    }
  }, [buildingId, venues]);

  useEffect(() => {
    selectedVenues.setIds(draft.venues);
    void selectedVenues.loadVenues();
  }, [draft.venues, selectedVenues]);

  const buildingVenues = venues.buildingVenues(buildingId ?? '');
  const loadingVenues = venues.isLoadingVenues(buildingId ?? '');
  const venuesError = buildingId ? venues.venuesError.get(buildingId) : null;

  const selected = selectedVenues.venues;
  const selectedIds = new Set(selectedVenues.ids);

  const selectBuilding = (value: string | null) => {
    setBuildingId(value);
    setVenueId(null);
  };

  const addVenue = () => {
    if (!buildingId || !venueId || selectedIds.has(venueId)) {
      return;
    }
    const building = venues.buildings.find((b) => b.id === buildingId);
    const venue = buildingVenues.find((v) => v.id === venueId);
    if (!building || !venue) {
      return;
    }
    onChange([...draft.venues, venueId]);
    setVenueId(null);
  };

  const removeVenue = (target: string) => {
    selectedVenues.remove(target);
    onChange(draft.venues.filter((id) => id !== target));
  };

  return (
    <fieldset
      className={`${styles.venuesField} ${invalid ? styles.invalid : ''}`}
    >
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
              options={venues.buildings}
              optionLabel="name"
              optionValue="id"
              onChange={(event) => selectBuilding(event.value ?? null)}
              placeholder={
                venues.loadingBuildings
                  ? 'Загрузка зданий...'
                  : 'Выберите здание'
              }
              filter
              disabled={venues.loadingBuildings}
              emptyMessage={venues.buildingsError ?? 'Здания не найдены'}
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
              placeholder={
                !buildingId
                  ? 'Сначала выберите здание'
                  : loadingVenues
                    ? 'Загрузка помещений...'
                    : 'Выберите место'
              }
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
          disabled={!buildingId || !venueId || selectedIds.has(venueId)}
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
