export type StudentsError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

export const StudentsError = {
  notFound: (message: string): StudentsError => ({
    kind: 'NotFound',
    message,
  }),

  repository: (message: string): StudentsError => ({
    kind: 'RepositoryError',
    message,
  }),
};
