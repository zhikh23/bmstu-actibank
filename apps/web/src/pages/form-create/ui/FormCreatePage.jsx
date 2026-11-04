import { useEffect, useState } from 'react';
import { api } from '../../../shared/api/client.js';
import { getForm } from '../../../entities/form/api.js';

const steps = ['Основное', 'Место и время', 'Участники', 'Оргкомитет'];

const initialForm = {
  name: '', description: '', organizers: [], links: [''], venues: [], themes: [], start: '', end: '',
  formatId: '', typeId: '', levelId: '', participants: { students: 0, employees: 0, others: 0 },
  guests: [], team: [], catalogLabels: { themes: {}, organizers: {}, venues: {} },
};

export function FormCreatePage({ formId }) {
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const [form, setForm] = useState(initialForm);
  const [state, setState] = useState({ loading: false, error: '' });
  useEffect(() => {
    if (!formId) return;
    getForm(formId).then((value) => setForm({
      ...initialForm,
      ...value,
      formatId: value.format?.id || '',
      typeId: value.type?.id || '',
      levelId: value.level?.id || '',
      start: value.start ? new Date(value.start).toISOString().slice(0, 16) : '',
      end: value.end ? new Date(value.end).toISOString().slice(0, 16) : '',
      organizers: value.organizers?.map((item) => item.id) || [],
      venues: value.venues?.map((item) => item.id) || [],
      themes: value.themes?.map((item) => item.id) || [],
      catalogLabels: {
        themes: Object.fromEntries((value.themes || []).map((item) => [item.id, item.name])),
        organizers: Object.fromEntries((value.organizers || []).map((item) => [item.id, item.name])),
        venues: Object.fromEntries((value.venues || []).map((item) => [item.id, item.name])),
      },
    })).catch((error) => setState({ loading: false, error: error.message }));
  }, [formId]);
  const update = (field, value) => setForm((current) => ({ ...current, [field]: value }));
  const goToStep = (nextStep) => {
    setStep(nextStep);
    setMaxStep((current) => Math.max(current, nextStep));
  };
  const continueToStep = () => {
    setCompletedSteps((current) => new Set([...current, step]));
    goToStep(step + 1);
  };

  async function submit() {
    if (form.name.trim().length < 3) return fail('Название мероприятия должно содержать не менее 3 символов.', 0);
    if (!form.start || !form.end || new Date(form.start) >= new Date(form.end)) return fail('Дата начала должна быть раньше даты окончания.', 0);
    setState({ loading: true, error: '' });
    try {
      const result = await (formId ? api.patch(`/forms/${formId}`, {
          ...form, catalogLabels: undefined, start: new Date(form.start).toISOString(), end: new Date(form.end).toISOString(),
          links: form.links.filter(Boolean), guests: form.guests.filter((item) => item.userId && item.rankId).map(({ userId, rankId }) => ({ userId, rankId })),
          team: form.team.filter((item) => item.userId && item.roleId).map(({ userId, roleId }) => ({ userId, roleId })),
          participants: Object.fromEntries(Object.entries(form.participants).map(([key, value]) => [key, Number(value || 0)])),
        }) : api.post('/forms', {
          ...form, catalogLabels: undefined, start: new Date(form.start).toISOString(), end: new Date(form.end).toISOString(),
          links: form.links.filter(Boolean), guests: form.guests.filter((item) => item.userId && item.rankId).map(({ userId, rankId }) => ({ userId, rankId })),
          team: form.team.filter((item) => item.userId && item.roleId).map(({ userId, roleId }) => ({ userId, roleId })),
          participants: Object.fromEntries(Object.entries(form.participants).map(([key, value]) => [key, Number(value || 0)])),
        }));
      window.location.href = `/forms/${formId || result.formId}`;
    } catch (error) {
      setState({ loading: false, error: error.message });
    }
  }

  function fail(error, nextStep) {
    setState({ loading: false, error });
    goToStep(nextStep);
  }

  return (
    <main className="main-content form-create-page">
      <div className="breadcrumbs"><a href="/">Главная</a><span>›</span><a href="/forms">Формы мероприятий</a><span>›</span><span>Создание формы</span></div>
      <div className="page-heading"><div><h1>Создание формы мероприятия</h1><p>Заполните сведения о мероприятии</p></div></div>
      <section className="wizard-card">
        <nav className="stepper" aria-label="Шаги создания формы">{steps.map((label, index) => { const complete = completedSteps.has(index) || index < step; return <button key={label} className={`stepper-item ${index === step ? 'active' : ''} ${complete ? 'complete' : ''}`} disabled={index > maxStep} onClick={() => goToStep(index)}><span>{complete ? <i className="pi pi-check" aria-hidden="true" /> : index + 1}</span><b>{label}</b></button>; })}</nav>
        {state.error && <div className="form-alert" role="alert"><i className="pi pi-exclamation-triangle" aria-hidden="true" />{state.error}</div>}
        {step === 0 && <BasicStep form={form} update={update} />}
        {step === 1 && <DetailsStep form={form} update={update} />}
        {step === 2 && <ParticipantsStep form={form} update={update} />}
        {step === 3 && <OrganizerStep form={form} update={update} />}
        <div className="wizard-actions"><a className="secondary-button" href="/forms">Отмена</a><div>{step > 0 && <button className="secondary-button" onClick={() => goToStep(step - 1)}>Назад</button>}{step < steps.length - 1 ? <button className="primary-button" onClick={continueToStep}>Продолжить <i className="pi pi-arrow-right" aria-hidden="true" /></button> : <button className="primary-button" disabled={state.loading} onClick={submit}>{state.loading ? 'Создание…' : 'Создать форму'} <i className="pi pi-check" aria-hidden="true" /></button>}</div></div>
      </section>
    </main>
  );
}

function Section({ title, children, wide = false }) { return <section className={`form-section ${wide ? 'wide-section' : ''}`}><h2>{title}</h2>{children}</section>; }
function Field({ label, required, children, wide = false }) { return <label className={`form-field ${wide ? 'wide' : ''}`}><span>{label}{required && <em>*</em>}</span>{children}</label>; }
function TextInput({ value, onChange, ...props }) { return <input {...props} value={value} onChange={(event) => onChange(event.target.value)} />; }

function BasicStep({ form, update }) {
  return <Section title="Основное">
    <Field label="Название мероприятия" required><TextInput value={form.name} onChange={(value) => update('name', value)} placeholder="Например, научная конференция" maxLength="256" /></Field>
    <Field label="Описание мероприятия" wide><textarea value={form.description} onChange={(event) => update('description', event.target.value)} placeholder="Кратко опишите мероприятие, его цель и формат" maxLength="2048" /></Field>
    <OrganizationPicker value={form.organizers} labels={form.catalogLabels.organizers} onChange={(value) => update('organizers', value)} onLabelsChange={(labels) => update('catalogLabels', { ...form.catalogLabels, organizers: { ...form.catalogLabels.organizers, ...labels } })} />
    <div className="form-grid"><Field label="Начало" required><TextInput type="datetime-local" value={form.start} onChange={(value) => update('start', value)} /></Field><Field label="Окончание" required><TextInput type="datetime-local" value={form.end} onChange={(value) => update('end', value)} /></Field></div>
  </Section>;
}

function DetailsStep({ form, update }) {
  return <Section title="Подробная информация">
    <VenuePicker value={form.venues} labels={form.catalogLabels.venues} onChange={(value) => update('venues', value)} onLabelsChange={(labels) => update('catalogLabels', { ...form.catalogLabels, venues: { ...form.catalogLabels.venues, ...labels } })} />
    <div className="form-grid">
      <CatalogSelect label="Уровень мероприятия" endpoint="/catalog/levels" value={form.levelId} onChange={(value) => update('levelId', value)} required capitalize />
      <CatalogSelect label="Формат мероприятия" endpoint="/catalog/formats" value={form.formatId} onChange={(value) => update('formatId', value)} required capitalize />
      <CatalogSelect label="Форма проведения мероприятия" endpoint="/catalog/event-types" value={form.typeId} onChange={(value) => update('typeId', value)} required capitalize />
    </div>
    <CatalogMulti label="Направленность мероприятия" endpoint="/catalog/themes" value={form.themes} labels={form.catalogLabels.themes} onChange={(value) => update('themes', value)} onLabelsChange={(labels) => update('catalogLabels', { ...form.catalogLabels, themes: { ...form.catalogLabels.themes, ...labels } })} />
    <GuestList value={form.guests} onChange={(value) => update('guests', value)} />
  </Section>;
}

function ParticipantsStep({ form, update }) {
  const total = Object.values(form.participants).reduce((sum, value) => sum + Number(value || 0), 0);
  return <Section title="Участники" wide>
    <div className="form-grid participant-grid">{[['students', 'Количество участников-студентов'], ['employees', 'Количество участников-сотрудников'], ['others', 'Количество других участников']].map(([key, label]) => <Field key={key} label={label}><TextInput type="number" min="0" value={form.participants[key]} onChange={(value) => update('participants', { ...form.participants, [key]: value === '' ? '' : Math.max(0, Number(value)) })} /></Field>)}</div>
    <div className="total-field"><span>Автосумма</span><strong>{total}</strong></div>
    <Repeatable label="Ссылки" values={form.links} onChange={(index, value) => update('links', form.links.map((item, current) => current === index ? value : item))} onAdd={() => update('links', [...form.links, ''])} onRemove={(index) => update('links', form.links.filter((_, current) => current !== index))} placeholder="https://..." />
  </Section>;
}

function OrganizerStep({ form, update }) {
  return <Section title="Организаторы" wide><TeamList value={form.team} onChange={(value) => update('team', value)} /></Section>;
}

function CatalogSelect({ label, endpoint, value, onChange, required, capitalize = false }) {
  const options = useCatalog(endpoint);
  return <Field label={label} required={required}><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Выберите значение</option>{options.map((item) => <option value={item.id} key={item.id}>{capitalizeText(optionLabel(options, item.id), capitalize)}</option>)}</select></Field>;
}

function CatalogMulti({ label, endpoint, value, labels, onChange, onLabelsChange }) {
  const options = useCatalog(endpoint);
  const [pending, setPending] = useState('');
  useEffect(() => onLabelsChange(Object.fromEntries(options.map((item) => [item.id, optionLabel(options, item.id)]))), [options]);
  const addPending = (id) => { if (!id) return; onChange([...value, id]); onLabelsChange({ [id]: optionLabel(options, id) }); setPending(''); };
  return <div className="catalog-multi"><span className="repeat-label">{label}</span><select value={pending} onChange={(event) => addPending(event.target.value)}><option value="">Выберите значение</option>{options.filter((item) => !value.includes(item.id)).map((item) => <option value={item.id} key={item.id}>{optionLabel(options, item.id)}</option>)}</select><div className="chips">{value.map((id) => <span className="chip" key={id}>{labels[id] || id}<button onClick={() => onChange(value.filter((item) => item !== id))} aria-label="Удалить"><i className="pi pi-times" /></button></span>)}</div></div>;
}

function OrganizationPicker({ value, labels, onChange, onLabelsChange }) {
  return <div className="catalog-multi"><span className="repeat-label">Организаторы<em>*</em></span>  <HierarchicalPicker root="/catalog/organization-categories" leafLabel="организацию" selected={value} labels={labels} onChange={onChange} onLabelsChange={onLabelsChange} /></div>;
}

function VenuePicker({ value, labels, onChange, onLabelsChange }) {
  return <div className="catalog-multi"><span className="repeat-label">Площадки проведения<em>*</em></span>  <HierarchicalPicker root="/catalog/buildings" leafLabel="площадку" selected={value} labels={labels} onChange={onChange} onLabelsChange={onLabelsChange} /></div>;
}

function HierarchicalPicker({ root, leafLabel, selected, labels, onChange, onLabelsChange }) {
  const [rootItems, setRootItems] = useState([]);
  const [branchItems, setBranchItems] = useState([]);
  const [children, setChildren] = useState([]);
  const [rootChoice, setRootChoice] = useState('');
  const [branchChoice, setBranchChoice] = useState('');
  const [pendingLeaf, setPendingLeaf] = useState('');
  const [open, setOpen] = useState(false);
  useEffect(() => { api.get(root).then(setRootItems); }, [root]);
  const selectRoot = async (id) => {
    setRootChoice(id);
    setBranchChoice('');
    if (root.includes('organization')) {
      const [childrenResponse, organizationsResponse] = await Promise.all([
        api.get(`/catalog/organization-categories/${id}/children`),
        api.get(`/catalog/organization-categories/${id}/organizations`),
      ]);
      const branches = childrenResponse;
      const organizations = organizationsResponse;
      setBranchItems(branches);
      setChildren(organizations);
      onLabelsChange(Object.fromEntries(organizations.map((item) => [item.id, optionLabel(organizations, item.id)])));
      if (branches.length) return;
    }
    await loadLeaves(id);
  };
  const loadLeaves = async (id) => {
    const suffix = root.includes('organization') ? `/organization-categories/${id}/organizations` : `/buildings/${id}/venues`;
    const items = await api.get(`/catalog${suffix}`);
    setChildren(items);
    onLabelsChange(Object.fromEntries(items.map((item) => [item.id, optionLabel(items, item.id)])));
  };
  const selectBranch = (choice) => {
    setBranchChoice(choice);
    if (root.includes('organization') && choice.startsWith('organization:')) {
      setPendingLeaf(choice.slice('organization:'.length));
      return;
    }
    setPendingLeaf('');
    loadLeaves(choice.replace('category:', ''));
  };
  const options = children.filter((item) => !selected.includes(item.id));
  const addLeaf = () => { if (!pendingLeaf) return; onChange([...selected, pendingLeaf]); onLabelsChange({ [pendingLeaf]: optionLabel(options, pendingLeaf) }); setPendingLeaf(''); };
  const organizationChoices = root.includes('organization') ? [...branchItems.map((item) => ({ ...item, choice: `category:${item.id}` })), ...children.map((item) => ({ ...item, choice: `organization:${item.id}` }))] : branchItems.map((item) => ({ ...item, choice: item.id }));
  return <><div className="chips">{selected.map((id) => <span className="chip" key={id}>{labels[id] || id}<button onClick={() => onChange(selected.filter((item) => item !== id))} aria-label="Удалить"><i className="pi pi-times" /></button></span>)}</div><button className="secondary-button picker-trigger" onClick={() => setOpen(true)}><i className="pi pi-plus" /> Добавить {leafLabel}</button>{open && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && setOpen(false)}><div className="picker-modal" role="dialog" aria-modal="true"><div className="picker-modal-header"><strong>Добавить {leafLabel}</strong><button className="icon-button" onClick={() => setOpen(false)} aria-label="Закрыть"><i className="pi pi-times" /></button></div><div className="form-grid"><select value={rootChoice} onChange={(event) => selectRoot(event.target.value)}><option value="">Выберите категорию</option>{rootItems.map((item) => <option value={item.id} key={item.id}>{optionLabel(rootItems, item.id)}</option>)}</select>{organizationChoices.length ? <select value={branchChoice} onChange={(event) => selectBranch(event.target.value)}><option value="">Выберите раздел или организацию</option>{organizationChoices.map((item) => <option value={item.choice} key={item.choice}>{optionLabel(organizationChoices, item.id)}</option>)}</select> : null}</div>{!root.includes('organization') && children.length > 0 && <div className="picker-add"><select value={pendingLeaf} onChange={(event) => setPendingLeaf(event.target.value)}><option value="">Выберите {leafLabel}</option>{options.map((item) => <option value={item.id} key={item.id}>{optionLabel(options, item.id)}</option>)}</select><button className="primary-button picker-confirm" disabled={!pendingLeaf} onClick={() => { addLeaf(); setOpen(false); }}><i className="pi pi-plus" /> Добавить</button></div>}{root.includes('organization') && pendingLeaf && <div className="picker-add"><button className="primary-button picker-confirm" onClick={() => { addLeaf(); setOpen(false); }}><i className="pi pi-plus" /> Добавить</button></div>}</div></div>}</>;
}

function GuestList({ value, onChange }) {
  return <div className="repeatable"><span className="repeat-label">Присутствие администрации</span>{value.map((item, index) => <div className="repeat-row repeat-row-inline guest-row" key={index}><TextInput value={item.userId} onChange={(next) => onChange(value.map((current, i) => i === index ? { ...current, userId: next } : current))} placeholder="UUID пользователя (временно)" /><CatalogSelectInline endpoint="/catalog/ranks" value={item.rankId} onChange={(next) => onChange(value.map((current, i) => i === index ? { ...current, rankId: next } : current))} /><button className="icon-button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Удалить гостя"><i className="pi pi-trash" /></button></div>)}<button className="add-link" onClick={() => onChange([...value, { userId: '', rankId: '' }])}><i className="pi pi-plus" /> Добавить гостя</button></div>;
}

function TeamList({ value, onChange }) {
  return <div className="repeatable"><span className="repeat-label">Оргкомитет</span>{value.map((item, index) => <div className="repeat-row repeat-row-inline team-row" key={index}><TextInput value={item.userId} onChange={(next) => onChange(value.map((current, i) => i === index ? { ...current, userId: next } : current))} placeholder="UUID пользователя (временно)" /><RolePicker category={item.roleCategoryId || ''} value={item.roleId} onCategoryChange={(next) => onChange(value.map((current, i) => i === index ? { ...current, roleCategoryId: next, roleId: '' } : current))} onChange={(next) => onChange(value.map((current, i) => i === index ? { ...current, roleId: next } : current))} /><button className="icon-button" onClick={() => onChange(value.filter((_, i) => i !== index))} aria-label="Удалить участника"><i className="pi pi-trash" /></button></div>)}<button className="add-link" onClick={() => onChange([...value, { userId: '', roleId: '', roleCategoryId: '' }])}><i className="pi pi-plus" /> Добавить участника</button></div>;
}

function RolePicker({ category, value, onCategoryChange, onChange }) {
  const categories = useCatalog('/catalog/role-categories');
  const [roles, setRoles] = useState([]);
  useEffect(() => { if (!category) { setRoles([]); return; } api.get(`/catalog/role-categories/${category}/roles`).then(setRoles); }, [category]);
  return <div className="role-picker"><select value={category} onChange={(event) => onCategoryChange(event.target.value)}><option value="">Категория роли</option>{categories.map((item) => <option value={item.id} key={item.id}>{capitalizeText(optionLabel(categories, item.id), true)}</option>)}</select><select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Роль</option>{roles.map((item) => <option value={item.id} key={item.id}>{capitalizeText(optionLabel(roles, item.id), true)}</option>)}</select></div>;
}

function CatalogSelectInline({ endpoint, value, onChange }) { const options = useCatalog(endpoint); return <select value={value} onChange={(event) => onChange(event.target.value)}><option value="">Ранг</option>{options.map((item) => <option value={item.id} key={item.id}>{capitalizeText(optionLabel(options, item.id), true)}</option>)}</select>; }
function Repeatable({ label, values, onChange, onAdd, onRemove, placeholder }) { return <div className="repeatable"><span className="repeat-label">{label}</span>{values.map((value, index) => <div className="repeat-row repeat-row-inline link-row" key={index}><TextInput value={value} onChange={(next) => onChange(index, next)} placeholder={placeholder} /><button className="icon-button" onClick={() => onRemove(index)} aria-label={`Удалить: ${label}`}><i className="pi pi-trash" /></button></div>)}<button className="add-link" onClick={onAdd}><i className="pi pi-plus" /> Добавить</button></div>; }

function useCatalog(endpoint) {
  const [items, setItems] = useState([]);
  useEffect(() => { api.get(endpoint).then(setItems); }, [endpoint]);
  return items;
}

function optionLabel(options, id) {
  const item = options.find((option) => option.id === id);
  return item?.name || item?.title || item?.label || id;
}

function capitalizeText(value, enabled) {
  return enabled && value ? `${value.charAt(0).toLocaleUpperCase()}${value.slice(1)}` : value;
}
