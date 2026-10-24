import { Injectable } from '@nestjs/common';
import { Result, err, ok } from 'neverthrow';
import { FormatDto } from './format-provider.dto';
import { GetFormatHandler } from '../../use-cases/get-format/get-format.handler';

export type FormatProviderError =
  | { kind: 'NotFound'; message: string }
  | { kind: 'RepositoryError'; message: string };

@Injectable()
export class FormatProvider {
  constructor(private readonly getFormatHandler: GetFormatHandler) {}

  async getFormat(id: string): Promise<Result<FormatDto, FormatProviderError>> {
    return this.getFormatHandler.execute({ id });
  }
}
