import { api } from '../../shared/api/client.js';

export const formQueryKey = (id) => ['form', id];
export const formsQueryKey = (filters) => ['forms', filters];

export function listForms(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.set('status', filters.status);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);
  const query = params.toString();
  return api.get(`/forms${query ? `?${query}` : ''}`);
}

export const getForm = (id) => api.get(`/forms/${encodeURIComponent(id)}`);
export const formAction = (id, action, body) => api.post(`/forms/${encodeURIComponent(id)}/${action}`, body);
