export type EventsError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

export const EventsError = {
  notFound: (message: string): EventsError => ({
    kind: 'NotFound',
    message,
  }),

  repository: (message: string): EventsError => ({
    kind: 'RepositoryError',
    message,
  }),
};
