import { Button } from 'primereact/button';

import styles from './FormActions.module.css';

interface FormActionsProps {
  isFirstStep: boolean;
  isLastStep: boolean;
  onBack: () => void;
  onNext: () => void;
}

export function FormActions({ isFirstStep, isLastStep, onBack, onNext }: FormActionsProps) {
  return (
    <footer className={styles.footer}>
      <Button type="button" label="Назад" outlined onClick={onBack} disabled={isFirstStep} />
      <Button
        type="button"
        label={isLastStep ? 'Готово' : 'Продолжить'}
        icon={isLastStep ? 'pi pi-check' : 'pi pi-arrow-right'}
        iconPos="right"
        onClick={onNext}
      />
    </footer>
  );
}
