export function getRoute(pathname = window.location.pathname) {
  if (pathname === '/') return { name: 'home' };
  if (pathname === '/forms') return { name: 'forms-list' };
  if (pathname === '/forms/new') return { name: 'form-create' };
  const editMatch = pathname.match(/^\/forms\/([^/]+)\/edit$/);
  if (editMatch) return { name: 'form-edit', id: decodeURIComponent(editMatch[1]) };
  const detailMatch = pathname.match(/^\/forms\/([^/]+)$/);
  if (detailMatch) return { name: 'form-detail', id: decodeURIComponent(detailMatch[1]) };
  return { name: 'not-found' };
}
