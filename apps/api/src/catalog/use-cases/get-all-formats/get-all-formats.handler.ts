import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { FormatRepository } from '@/catalog/infra/repository/format/format.repository';

import { FormatType } from './get-all-formats.data';

@Injectable()
export class GetAllFormatsHandler {
  constructor(private readonly repository: FormatRepository) {}

  execute(): ResultAsync<FormatType[], CatalogError> {
    return this.repository.getAll();
  }
}
