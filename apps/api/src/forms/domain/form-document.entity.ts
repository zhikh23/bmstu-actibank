import { err, ok, Result } from 'neverthrow';
import { FormsError } from './errors';

export type FormDocumentCreate = {
  id: string;
  generatedId: string;
};

export type FormDocumentInit = FormDocumentCreate & {
  createdAt: Temporal.Instant;
  scanId: string | null;
  uploadedAt: Temporal.Instant | null;
};

export class FormDocumentEntity {
  declare id: string;
  declare generatedId: string;
  declare createdAt: Temporal.Instant;
  declare scanId: string | null;
  declare uploadedAt: Temporal.Instant | null;

  private constructor(init: FormDocumentInit) {
    Object.assign(this, init);
  }

  static create(
    data: FormDocumentCreate,
    now: Temporal.Instant = Temporal.Now.instant(),
  ): FormDocumentEntity {
    return new FormDocumentEntity({
      ...data,
      createdAt: now,
      scanId: null,
      uploadedAt: null,
    });
  }

  static restore(
    data: FormDocumentInit,
  ): Result<FormDocumentEntity, FormsError> {
    if ((data.scanId === null) != (data.uploadedAt === null)) {
      return err(
        FormsError.invariant(
          'scanId and uploadedAt must be both null or both non-null',
        ),
      );
    }
    return ok(new FormDocumentEntity(data));
  }

  attach(
    scanId: string,
    now: Temporal.Instant = Temporal.Now.instant(),
  ): Result<void, FormsError> {
    if (this.scanId !== null) {
      return err(
        FormsError.invalidOp(`document scan has already been attached`),
      );
    }
    this.scanId = scanId;
    this.uploadedAt = now;
    return ok(undefined);
  }

  hasScan(): boolean {
    return this.scanId !== null;
  }
}
