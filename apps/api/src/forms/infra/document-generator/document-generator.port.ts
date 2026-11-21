import { ResultAsync } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';

export interface IDocumentData {
  formId: string;
  name: string;
  description: string;
  organizers: string[];
  start: Temporal.PlainDateTime;
  end: Temporal.PlainDateTime;
  duration: Temporal.Duration;
  venues: {
    name: string;
    buildingName: string;
  }[];
  level: string;
  format: string;
  type: string;
  guests: {
    number: number;
    fullName: string;
    rank: string;
  }[];
  participants: {
    students: number;
    employees: number;
    others: number;
    total: number;
  };
  links: string[];
  themes: string[];
  team: {
    number: number;
    fullName: string;
    groupOrPost: string;
    role: string;
  }[];
}

export interface IGeneratedData {
  body: Buffer;
  filename: string;
  contentType: string;
}

export interface IDocumentGeneratorPort {
  generate(data: IDocumentData): ResultAsync<IGeneratedData, FormsError>;
}
