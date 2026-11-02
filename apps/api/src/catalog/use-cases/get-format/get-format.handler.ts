import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';
import { Format } from './get-format.data';
import { CatalogError } from '../../domain/errors';
import { FormatRepository } from '../../infra/repository/format/format.repository';

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
