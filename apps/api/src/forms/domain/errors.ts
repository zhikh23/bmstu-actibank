export type FormsError =
  | { kind: 'InvalidStateTransition'; from: string; to: string }
  | { kind: 'InvariantViolation'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'NotFound'; message: string }
  | { kind: 'Forbidden'; reason: string }
  | { kind: 'StorageError'; message: string };

export const FormsError = {
  invalidTransition: (from: string, to: string): FormsError => ({
    kind: 'InvalidStateTransition',
    from,
    to,
  }),
  invariant: (message: string): FormsError => ({
    kind: 'InvariantViolation',
    message,
  }),
  repository: (message: string): FormsError => ({
    kind: 'RepositoryError',
    message,
  }),
  notFound: (message: string): FormsError => ({
    kind: 'NotFound',
    message,
  }),
  forbidden: (reason: string): FormsError => ({
    kind: 'Forbidden',
    reason,
  }),
};
