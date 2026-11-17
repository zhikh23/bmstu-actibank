const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
});

export const formatDate = (value: string) =>
  dateFormatter.format(new Date(value));

const dataTimeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: 'numeric',
  minute: '2-digit',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

export const formatDateTime = (d: Date) => dataTimeFormatter.format(d);
