const BASE_URL = import.meta.env.VITE_API_URL ?? '';

export const customFetch = async <T>(
  url: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      Accept: 'application/json',
      ...(options.body instanceof FormData
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...options.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
};
