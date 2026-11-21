import {useEffect, useState} from 'react';
import {observer} from 'mobx-react-lite';

import {stores} from '@/stores';
import {defaultFormDraft, FormDraft} from "@/types/form-draft";

import {FormActions} from './FormActions';
import {FormStepContent} from './FormStepContent';
import {FormStepNavigation} from './FormStepNavigation';
import {formSteps} from './form-config';
import type {SelectOption} from './SelectBlockField';
import styles from './NewFormPage.module.css';

export const NewFormPage = observer(function NewFormPage() {
  const { themes, organizations, venues, eventCatalog, roles, persons } = stores;
  const [draft, setDraft] = useState<FormDraft>(defaultFormDraft);
  const [activeStep, setActiveStep] = useState(0);
  const [unlockedStep, setUnlockedStep] = useState(0);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);

  useEffect(() => {
    void themes.load();
    void organizations.load();
    void venues.loadBuildings();
    void eventCatalog.load();
    void roles.loadCategories();
    void persons.load();
  }, [themes, organizations, venues, eventCatalog, roles, persons]);

  const updateDraft = <K extends keyof FormDraft>(field: K, value: FormDraft[K]) => {
    setDraft((current) => ({ ...current, [field]: value }));
  };

  const isFilled = (field: keyof FormDraft) => {
    const value = draft[field];
    if (value === null) {
      return false;
    }
    if (Array.isArray(value)) {
      return value.length > 0;
    }
    if (typeof value === 'number') {
      return true;
    }
    return value instanceof Date || Boolean(value.trim());
  };

  const isStepComplete = (stepIndex: number) =>
    formSteps[stepIndex].blocks
      .flatMap((block) => (block.type === 'group' ? block.fields : [block]))
      .filter((block) => block.required)
      .every((block) => isFilled(block.field));

  const selectStep = (step: number) => {
    if (step <= unlockedStep) {
      setActiveStep(step);
      setAttemptedStep(null);
    }
  };

  const goNext = () => {
    setAttemptedStep(activeStep);
    if (!isStepComplete(activeStep) || activeStep === formSteps.length - 1) {
      return;
    }

    setUnlockedStep((current) => Math.max(current, activeStep + 1));
    setActiveStep((current) => current + 1);
    setAttemptedStep(null);
  };

  const goBack = () => {
    setActiveStep((current) => Math.max(0, current - 1));
    setAttemptedStep(null);
  };

  const activeFormStep = formSteps[activeStep];
  const options: Record<string, SelectOption[]> = {
    themes: themes.items,
    organizations: organizations.items,
    levels: eventCatalog.levels,
    formats: eventCatalog.formats,
    types: eventCatalog.types,
  };

  return (
    <section className={styles.page}>
      <header className={styles.heading}>
        <h1>Создание формы мероприятия</h1>
        <p>Внимательно заполните форму для регистрации прошедшего мероприятия</p>
      </header>

      <div className={styles.card}>
        <FormStepNavigation
          labels={formSteps.map(({ label }) => label)}
          activeStep={activeStep}
          unlockedStep={unlockedStep}
          completedSteps={formSteps.map(
            (_, index) => index < unlockedStep && isStepComplete(index),
          )}
          onSelect={selectStep}
        />

        <div className={styles.content}>
          <div className={styles.stepHeading}>
            <span>{activeStep + 1}</span>
            <h2>{activeFormStep.label}</h2>
          </div>
          <FormStepContent
            blocks={activeFormStep.blocks}
            placeholder={activeFormStep.placeholder}
            draft={draft}
            attempted={attemptedStep === activeStep}
            onChange={updateDraft}
            isFilled={isFilled}
            lookupState={{
              options: options,
              optionState: {
                themes: { loading: themes.loading, error: themes.error },
                organizations: { loading: organizations.loading, error: organizations.error },
                levels: { loading: eventCatalog.loading, error: eventCatalog.error },
                formats: { loading: eventCatalog.loading, error: eventCatalog.error },
                types: { loading: eventCatalog.loading, error: eventCatalog.error },
              },
              buildings: venues.buildings,
              venues: venues.venues,
              loadingBuildings: venues.loadingBuildings,
              loadingVenues: venues.loadingVenues,
              buildingsError: venues.buildingsError,
              venuesError: venues.venuesError,
              roleCategories: roles.categories,
              roles: roles.roles,
              persons: persons.items,
              loadingRoleCategories: roles.loadingCategories,
              loadingRoles: roles.loadingRoles,
              loadingPersons: persons.loading,
              roleCategoriesError: roles.categoriesError,
              rolesError: roles.rolesError,
              personsError: persons.error,
              onLoadVenues: (buildingId) => void venues.loadVenues(buildingId),
              onLoadRoles: (categoryId) => void roles.loadRoles(categoryId),
            }}
          />
        </div>

        <FormActions
          isFirstStep={activeStep === 0}
          isLastStep={activeStep === formSteps.length - 1}
          onBack={goBack}
          onNext={goNext}
        />
      </div>
    </section>
  );
});
