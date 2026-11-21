import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';
import { FormatRepository } from '@/catalog/infra/repository/format/format.repository';

import { Format } from './get-format.data';

export type GetFormatQuery = {
  id: string;
};

@Injectable()
export class GetFormatHandler {
  constructor(private readonly repository: FormatRepository) {}

  execute(q: GetFormatQuery): ResultAsync<Format, CatalogError> {
    return this.repository.get(q.id);
  }
}
