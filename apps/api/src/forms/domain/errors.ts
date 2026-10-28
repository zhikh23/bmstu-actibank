export type FormsError =
  | { kind: 'InvalidStateTransition'; from: string; to: string }
  | { kind: 'InvariantViolation'; message: string }
  | { kind: 'AlreadyExists'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'NotFound'; message: string }
  | { kind: 'Forbidden'; reason: string }
  | { kind: 'StorageError'; message: string }
  | { kind: 'InvalidOperationError'; message: string };

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
  alreadyExists: (message: string): FormsError => ({
    kind: 'AlreadyExists',
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
  storageError: (message: string): FormsError => ({
    kind: 'StorageError',
    message,
  }),
  invalidOp: (message: string): FormsError => ({
    kind: 'InvalidOperationError',
    message,
  }),
};
