export function capitalize(str: string): string {
  if (!str) return str;
  const [first, ...rest] = str;
  return first.toUpperCase() + rest.join('').toLowerCase();
}
