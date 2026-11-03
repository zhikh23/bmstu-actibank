export function FormSearch({ value, onChange }) {
  return (
    <label className="forms-search">
      <i className="pi pi-search search-icon" aria-hidden="true" />
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Поиск по названию или описанию"
        type="search"
      />
    </label>
  );
}
