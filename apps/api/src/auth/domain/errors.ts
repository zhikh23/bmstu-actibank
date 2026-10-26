export type AuthError = { kind: 'RepositoryError'; message: string };

export const AuthError = {
  repository: (message: string): AuthError => ({
    kind: 'RepositoryError',
    message,
  }),
};
