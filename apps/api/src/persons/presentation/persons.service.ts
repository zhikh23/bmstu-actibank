import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { GetPersonHandler } from '../use-cases/get-person/get-person.handler';
import { ResultAsync } from 'neverthrow';
import { CatalogError } from '../../catalog/domain/errors';
import { PersonDto } from './dto/person.dto';
import { ListPersonsHandler } from '../use-cases/list-persons/list-persons.handler';
import { ListPersonsResponse } from './dto/list-persons.response';

@Injectable()
export class PersonsService {
  private readonly logger = new Logger(PersonsService.name);

  constructor(
    private readonly getPerson: GetPersonHandler,
    private readonly listPersons: ListPersonsHandler,
  ) {}

  async get(personId: string): Promise<PersonDto> {
    return this.resolve(this.getPerson.execute({ personId }));
  }

  async list(): Promise<ListPersonsResponse> {
    return this.resolve(this.listPersons.execute());
  }

  private resolve<T>(result: ResultAsync<T, CatalogError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
        if (error.kind === 'NotFound')
          throw new NotFoundException(error.message);
        this.logger.error(error);
        throw new InternalServerErrorException();
      },
    );
  }
}
