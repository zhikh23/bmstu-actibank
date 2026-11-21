import { Result } from 'neverthrow';

import { FormsError } from '@/forms/domain/errors';
import { FormDocumentEntity } from '@/forms/domain/form-document.entity';
import { dateToInstant, instantToDate } from '@/shared/utils/dates';

import { FormDocumentModel } from './form.model';

export class FormDocumentMapper {
  static toModel(d: FormDocumentEntity, formId: string): FormDocumentModel {
    const m = new FormDocumentModel();
    m.id = d.id;
    m.form_id = formId;
    m.generated_id = d.generatedId;
    m.scan_id = d.scanId;
    m.created_at = instantToDate(d.createdAt);
    m.uploaded_at = d.uploadedAt ? instantToDate(d.uploadedAt) : null;
    return m;
  }

  static toDomain(
    m: FormDocumentModel,
  ): Result<FormDocumentEntity, FormsError> {
    return FormDocumentEntity.restore({
      id: m.id,
      generatedId: m.generated_id,
      scanId: m.scan_id,
      createdAt: dateToInstant(m.created_at),
      uploadedAt: m.uploaded_at ? dateToInstant(m.uploaded_at) : null,
    });
  }
}
