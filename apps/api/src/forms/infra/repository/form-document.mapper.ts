import { FormDocumentModel } from './form.model';
import { FormDocument } from '../../domain/form-document.entity';
import { dateToInstant, instantToDate } from '../../../shared/utils/dates';

export class FormDocumentMapper {
  static toDomain(m: FormDocumentModel): FormDocument {
    return FormDocument.restore({
      id: m.id,
      formId: m.form_id,
      formRevision: m.form_revision,
      type: m.type,
      storageKey: m.storage_key,
      contentType: m.content_type,
      createdAt: dateToInstant(m.created_at),
      createdBy: m.created_by,
    });
  }

  static toModel(d: FormDocument): FormDocumentModel {
    const model = new FormDocumentModel();
    model.id = d.id;
    model.form_id = d.formId;
    model.form_revision = d.formRevision;
    model.type = d.type;
    model.storage_key = d.storageKey;
    model.content_type = d.contentType;
    model.created_at = instantToDate(d.createdAt);
    model.created_by = d.createdBy;
    return model;
  }
}
