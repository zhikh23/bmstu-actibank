export enum FormDocumentType {
  Generated = 'generated',
  Scanned = 'scanned',
}

export class FormDocumentInit {
  declare id: string;
  declare formId: string;
  declare formRevision: number;
  declare type: FormDocumentType;
  declare storageKey: string;
  declare contentType: string;
  declare createdAt: Temporal.Instant;
  declare createdBy: string;
}

export class FormDocumentCreate {
  declare id: string;
  declare formId: string;
  declare formRevision: number;
  declare type: FormDocumentType;
  declare storageKey: string;
  declare contentType: string;
  declare createdBy: string;
}

export class FormDocument {
  declare id: string;
  declare formId: string;
  declare formRevision: number;
  declare type: FormDocumentType;
  declare storageKey: string;
  declare contentType: string;
  declare createdAt: Temporal.Instant;
  declare createdBy: string;

  constructor(init: FormDocumentInit) {
    Object.assign(this, init);
  }

  static create(
    data: FormDocumentCreate,
    now: Temporal.Instant = Temporal.Now.instant(),
  ): FormDocument {
    return new FormDocument({
      ...data,
      createdAt: now,
    });
  }

  static restore(init: FormDocumentInit): FormDocument {
    return new FormDocument(init);
  }
}
