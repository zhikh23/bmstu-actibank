export type FilesError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string }
  | { kind: 'StorageError'; message: string }
  | { kind: 'Forbidden'; reason: string };

export const FilesError = {
  notFound: (message: string): FilesError => ({
    kind: 'NotFound',
    message,
  }),

  repository: (message: string): FilesError => ({
    kind: 'RepositoryError',
    message,
  }),

  storage: (message: string): FilesError => ({
    kind: 'StorageError',
    message,
  }),

  forbidden: (reason: string): FilesError => ({
    kind: 'Forbidden',
    reason,
  }),
};
