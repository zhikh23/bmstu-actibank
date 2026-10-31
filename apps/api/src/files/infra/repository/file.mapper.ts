import { File } from '../../domain/file.entity';
import { FileModel } from './file.model';
import { dateToInstant, instantToDate } from '../../../shared/utils/dates';

export class FileMapper {
  static toModel(f: File): FileModel {
    const m = new FileModel();
    m.id = f.id;
    m.owner_id = f.ownerId;
    m.storage_key = f.storageKey;
    m.content_type = f.contentType;
    m.size = f.size;
    m.created_at = instantToDate(f.createdAt);
    return m;
  }

  static toDomain(m: FileModel): File {
    return File.restore({
      id: m.id,
      ownerId: m.owner_id,
      storageKey: m.storage_key,
      contentType: m.content_type,
      size: m.size,
      createdAt: dateToInstant(m.created_at),
    });
  }
}
