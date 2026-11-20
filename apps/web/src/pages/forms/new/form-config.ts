import {FormDraft} from "@/types/form-draft";

export type FieldKey = keyof FormDraft;

export interface TextBlock {
  type: 'text' | 'textarea';
  field: FieldKey;
  label: string;
  placeholder: string;
  required?: boolean;
  rows?: number;
}

export interface DateBlock {
  type: 'date';
  field: FieldKey;
  label: string;
  placeholder: string;
  required?: boolean;
}

export interface MultiSelectBlock {
  type: 'multiSelect';
  field: FieldKey;
  label: string;
  placeholder: string;
  optionLabel: string;
  optionValue: string;
  optionsKey: string;
  required?: boolean;
}

export interface LinksBlock {
  type: 'links';
  field: 'links';
  label: string;
  placeholder: string;
  required?: boolean;
}

export interface SelectBlock {
  type: 'select';
  field: FieldKey;
  label: string;
  placeholder: string;
  optionLabel: string;
  optionValue: string;
  optionsKey: string;
  required?: boolean;
}

export interface NumberBlock {
  type: 'number';
  field: FieldKey;
  label: string;
  placeholder: string;
  required?: boolean;
  min?: number;
}

export interface VenuesBlock {
  type: 'venues';
  field: 'venues';
  label: string;
  required?: boolean;
}

export type FieldBlock =
  | TextBlock
  | DateBlock
  | MultiSelectBlock
  | LinksBlock
  | SelectBlock
  | NumberBlock
  | VenuesBlock;

export interface FieldGroup {
  type: 'group';
  fields: FieldBlock[];
}

export type FormBlock = FieldBlock | FieldGroup;

export interface FormStep {
  label: string;
  blocks: FormBlock[];
  placeholder?: string;
}

export const formSteps: FormStep[] = [
  {
    label: 'Основное',
    blocks: [
      {
        type: 'text',
        field: 'name',
        label: 'Название мероприятия',
        placeholder: 'Например, конференция «Технологии будущего»',
      },
      {
        type: 'textarea',
        field: 'description',
        label: 'Описание мероприятия',
        placeholder: 'Кратко расскажите о мероприятии',
        rows: 4,
      },
      {
        type: 'multiSelect',
        field: 'organizers',
        label: 'Организации',
        placeholder: 'Выберите организаторов',
        optionLabel: 'name',
        optionValue: 'id',
        optionsKey: 'organizations',
      },
      {
        type: 'links',
        field: 'links',
        label: 'Ссылки на упоминания мероприятия',
        placeholder: 'Введите ссылку и нажмите Enter',
      },
      {
        type: 'group',
        fields: [
          {
            type: 'date',
            field: 'start',
            label: 'Начало',
            placeholder: 'Выберите дату и время',
          },
          {
            type: 'date',
            field: 'end',
            label: 'Окончание',
            placeholder: 'Выберите дату и время',
          },
        ],
      },
    ],
  },
  {
    label: 'Подробная информация',
    blocks: [
      {
        type: 'venues',
        field: 'venues',
        label: 'Места проведения',
      },
      {
        type: 'select',
        field: 'levelId',
        label: 'Уровень мероприятия',
        placeholder: 'Выберите уровень',
        optionLabel: 'name',
        optionValue: 'id',
        optionsKey: 'levels',
      },
      {
        type: 'select',
        field: 'formatId',
        label: 'Формат мероприятия',
        placeholder: 'Выберите формат',
        optionLabel: 'name',
        optionValue: 'id',
        optionsKey: 'formats',
      },
      {
        type: 'select',
        field: 'typeId',
        label: 'Тип мероприятия',
        placeholder: 'Выберите тип',
        optionLabel: 'name',
        optionValue: 'id',
        optionsKey: 'types',
      },
      {
        type: 'multiSelect',
        field: 'themes',
        label: 'Темы мероприятия',
        placeholder: 'Выберите темы',
        optionLabel: 'name',
        optionValue: 'id',
        optionsKey: 'themes',
      },
    ],
  },
  {
    label: 'Участники и освещение',
    blocks: [
      {
        type: 'group',
        fields: [
          {
            type: 'number',
            field: 'participants_students',
            label: 'Количество студентов-участников',
            placeholder: 'Введите число',
            min: 0,
          },
          {
            type: 'number',
            field: 'participants_employees',
            label: 'Количество сотрудников-участников',
            placeholder: 'Введите число',
            min: 0,
          },
          {
            type: 'number',
            field: 'participants_others',
            label: 'Количество других участников',
            placeholder: 'Введите число',
            min: 0,
          },
        ]
      },
      {
        type: 'text',
        field: 'guests',
        label: 'Присутствие администрации',
        placeholder: 'Скоро будет доступно'
      },
    ],
  },
  {
    label: 'Команда организаторов',
    placeholder: 'Скоро здесь всё будет!',
    blocks: [],
  }
];
