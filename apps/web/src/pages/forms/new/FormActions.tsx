import { Button } from 'primereact/button';

import styles from './FormActions.module.css';

interface FormActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  submitting?: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function FormActions({ isFirstStep, isLastStep, submitting = false, onBack, onNext }: FormActionsProps) {
  return (
    <footer className={styles.footer}>
      <Button type="button" label="Назад" outlined onClick={onBack} disabled={isFirstStep || submitting} />
      <Button
        type="button"
        label={isLastStep ? 'Готово' : 'Продолжить'}
        icon={isLastStep ? 'pi pi-check' : 'pi pi-arrow-right'}
        iconPos="right"
        onClick={onNext}
        loading={submitting}
        disabled={submitting}
      />
    </footer>
  );
}
