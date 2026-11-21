export type PersonsError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

export const PersonsError = {
  notFound: (message: string): PersonsError => ({
    kind: 'NotFound',
    message,
  }),

  repository: (message: string): PersonsError => ({
    kind: 'RepositoryError',
    message,
  }),
};
