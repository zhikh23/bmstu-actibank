import { Injectable } from '@nestjs/common';
import { Form } from '../../domain/form.entity';
import { errAsync, ResultAsync } from 'neverthrow';
import { FormsError } from '../../domain/errors';

@Injectable()
export class FormRepository {
  save(f: Form): ResultAsync<void, FormsError> {
    return errAsync(FormsError.repository('not implemented'));
  }
}
