import { api } from '../../shared/api/client.js';

export const userQueryKey = ['me'];

export function getCurrentUser() {
  return api.get('/auth/me');
}
