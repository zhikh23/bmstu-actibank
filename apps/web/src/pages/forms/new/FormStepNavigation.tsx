import styles from './FormStepNavigation.module.css';

interface FormStepNavigationProps {
  labels: string[];
  activeStep: number;
  unlockedStep: number;
  completedSteps: boolean[];
  onSelect: (step: number) => void;
}

export function FormStepNavigation({
  labels,
  activeStep,
  unlockedStep,
  completedSteps,
  onSelect,
}: FormStepNavigationProps) {
  return (
    <nav className={styles.steps} aria-label="Этапы заполнения формы">
      <ol className={styles.list}>
        {labels.map((label, index) => {
          const isAllowed = index <= unlockedStep;
          const isActive = index === activeStep;
          const isCompleted = completedSteps[index];

          return (
            <li className={styles.item} key={label}>
              <button
                type="button"
                className={`${styles.marker} ${isActive ? styles.active : ''} ${
                  isCompleted ? styles.completed : ''
                }`}
                onClick={() => onSelect(index)}
                disabled={!isAllowed}
                aria-label={`Перейти к этапу ${index + 1}: ${label}`}
                aria-current={isActive ? 'step' : undefined}
              >
                {isCompleted ? (
                  <i className="pi pi-check" aria-hidden="true" />
                ) : (
                  index + 1
                )}
              </button>
              <span
                className={`${styles.label} ${!isAllowed ? styles.disabled : ''}`}
              >
                {label}
              </span>
              {index < labels.length - 1 && (
                <span className={styles.connector} aria-hidden="true" />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
