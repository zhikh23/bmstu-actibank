import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Message } from 'primereact/message';

import { stores } from '@/stores';
import { FormDraft } from '@/types/form-draft';
import { EditorActions } from '@/components/form-editor/EditorActions';
import { FormStepContent } from '@/components/form-editor/FormStepContent';
import { FormStepNavigation } from '@/components/form-editor/FormStepNavigation';
import { formSteps } from '@/components/form-editor/form-config';
import type { SelectOption } from '@/components/form-editor/blocks/SelectBlockField';
import styles from './FormEditor.module.css';

interface FormEditorProps {
  initialDraft: FormDraft;
  submittingText?: string;
  onSubmit: (draft: FormDraft) => Promise<boolean>;
}

export const FormEditor = observer(function FormEditor({
  initialDraft,
  submittingText,
  onSubmit,
}: FormEditorProps) {
  const {
    themes,
    organizations,
    venues,
    eventCatalog,
    roles,
    students,
    forms,
  } = stores;
  const [draft, setDraft] = useState<FormDraft>(initialDraft);
  const [activeStep, setActiveStep] = useState(0);
  const [unlockedStep, setUnlockedStep] = useState(formSteps.length - 1);
  const [attemptedStep, setAttemptedStep] = useState<number | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    setDraft(initialDraft);
  }, [initialDraft]);

  useEffect(() => {
    void themes.load();
    void organizations.load();
    void venues.loadBuildings();
    void eventCatalog.load();
    void roles.loadCategories();
    void students.load();
  }, [themes, organizations, venues, eventCatalog, roles, students]);

  const updateDraft = <K extends keyof FormDraft>(
    field: K,
    value: FormDraft[K],
  ) => {
    setDraft((current) => ({ ...current, [field]: value }));
    setSubmitError(null);
  };

  const isFilled = (field: keyof FormDraft) => {
    const value = draft[field];
    if (value === null) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'number') return true;
    return value instanceof Date || Boolean(value.trim());
  };

  const isStepComplete = (stepIndex: number) =>
    formSteps[stepIndex].blocks
      .flatMap((block) => (block.type === 'group' ? block.fields : [block]))
      .filter((block) => block.required)
      .every((block) => isFilled(block.field));

  const validateStep = (stepIndex: number): string | null => {
    if (!isStepComplete(stepIndex))
      return 'Заполните все обязательные поля этого шага.';
    if (draft.start && draft.end && draft.end <= draft.start)
      return 'Дата окончания не может быть раньше даты начала.';
    if (
      stepIndex === formSteps.length - 1 &&
      !formSteps.every((_, index) => isStepComplete(index))
    ) {
      return 'Заполните обязательные поля на всех шагах формы.';
    }
    return null;
  };

  const selectStep = (step: number) => {
    if (step <= unlockedStep) {
      setActiveStep(step);
      setAttemptedStep(null);
    }
  };

  const goNext = async () => {
    setAttemptedStep(activeStep);
    const validationError = validateStep(activeStep);
    if (validationError) {
      setSubmitError(validationError);
      return;
    }
    setSubmitError(null);
    if (activeStep === formSteps.length - 1) {
      await onSubmit(draft);
      return;
    }
    setUnlockedStep((current) => Math.max(current, activeStep + 1));
    setActiveStep((current) => current + 1);
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
        {(submitError || forms.submitError) && (
          <Message
            severity="error"
            text={submitError ?? forms.submitError ?? undefined}
            className={styles.submitError}
          />
        )}
        <FormStepContent
          blocks={activeFormStep.blocks}
          placeholder={activeFormStep.placeholder}
          draft={draft}
          attempted={attemptedStep === activeStep}
          onChange={updateDraft}
          isFilled={isFilled}
          lookupState={{
            options,
            optionState: {
              themes: { loading: themes.loading, error: themes.error },
              organizations: {
                loading: organizations.loading,
                error: organizations.error,
              },
              levels: {
                loading: eventCatalog.loading,
                error: eventCatalog.error,
              },
              formats: {
                loading: eventCatalog.loading,
                error: eventCatalog.error,
              },
              types: {
                loading: eventCatalog.loading,
                error: eventCatalog.error,
              },
            },
            onLoadVenues: (buildingId) => void venues.loadVenues(buildingId),
            onLoadRoles: (categoryId) => void roles.loadRoles(categoryId),
          }}
        />
      </div>
      <EditorActions
        isFirstStep={activeStep === 0}
        isLastStep={activeStep === formSteps.length - 1}
        submitting={forms.submitting}
        submittingText={submittingText}
        onBack={() => {
          setActiveStep((current) => Math.max(0, current - 1));
          setAttemptedStep(null);
        }}
        onNext={goNext}
      />
    </div>
  );
});
