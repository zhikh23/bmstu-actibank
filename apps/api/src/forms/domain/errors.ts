export type FormsError =
  | { kind: 'InvalidStateTransition'; from: string; to: string }
  | { kind: 'InvariantViolation'; message: string }
  | { kind: 'AlreadyExists'; message: string }
  | { kind: 'RepositoryError'; message: string };

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
};
