export type CatalogError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

export const CatalogError = {
  notFound: (message: string): CatalogError => ({
    kind: 'NotFound',
    message,
  }),

  repository: (message: string): CatalogError => ({
    kind: 'RepositoryError',
    message,
  }),
};
