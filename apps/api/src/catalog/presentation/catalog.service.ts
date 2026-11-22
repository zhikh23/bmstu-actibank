import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogError } from '@/catalog/domain/errors';

export class CatalogService {
  protected resolve<T>(result: ResultAsync<T, CatalogError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
        if (error.kind === 'NotFound')
          throw new NotFoundException(error.message);
        throw new InternalServerErrorException(error.message);
      },
    );
  }
}
