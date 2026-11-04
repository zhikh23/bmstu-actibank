const API_URL = (import.meta.env.VITE_API_URL || '/api/v1').replace(/\/+$/, '');

export class ApiError extends Error {
  constructor(status, message, fieldErrors) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.fieldErrors = fieldErrors;
  }
}

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      ...(options.body instanceof FormData ? {} : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    let payload = {};
    try {
      payload = await response.json();
    } catch {
      // Some API errors have an empty body.
    }
    const message = payload.message || `Запрос завершился с ошибкой (${response.status})`;
    throw new ApiError(response.status, Array.isArray(message) ? message.join(', ') : message, payload.fieldErrors);
  }

  if (response.status === 204) return null;
  const contentType = response.headers.get('content-type') || '';
  return contentType.includes('application/json') ? response.json() : response.blob();
}

export const api = {
  get: (path) => request(path),
  post: (path, body) => request(path, { method: 'POST', body: body === undefined ? undefined : JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  upload: (path, file) => request(path, { method: 'POST', body: (() => { const data = new FormData(); data.append('file', file); return data; })() }),
};

export function getApiError(error) {
  if (error instanceof ApiError) return error;
  return new ApiError(0, error?.message || 'Неизвестная ошибка');
}

export { API_URL };
