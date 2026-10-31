export type AuthError =
  | { kind: 'Unauthorized'; message: string }
  | { kind: 'RepositoryError'; message: string };

export const AuthError = {
  unauthorized: (message: string): AuthError => ({
    kind: 'Unauthorized',
    message,
  }),

  repository: (message: string): AuthError => ({
    kind: 'RepositoryError',
    message,
  }),
};
