export type EventsError =
  | { kind: 'InvariantViolation'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'NotFound'; message: string }
  | { kind: 'Forbidden'; reason: string }
  | { kind: 'StorageError'; message: string };

export const EventsError = {
  invariant: (message: string): EventsError => ({
    kind: 'InvariantViolation',
    message,
  }),
  repository: (message: string): EventsError => ({
    kind: 'RepositoryError',
    message,
  }),
  notFound: (message: string): EventsError => ({
    kind: 'NotFound',
    message,
  }),
  forbidden: (reason: string): EventsError => ({
    kind: 'Forbidden',
    reason,
  }),
};
