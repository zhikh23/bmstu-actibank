import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { PersonsService } from './persons.service';
import { PersonDto } from './dto/person.dto';
import { ListPersonsResponse } from './dto/list-persons.response';
import { ListFormResponse } from '../../forms/presentation/dto/list-forms.response';

@ApiTags('Persons')
@Controller('persons')
@ApiInternalServerErrorResponse({ description: 'Ошибка на стороне сервера' })
export class PersonsController {
  constructor(private readonly personsService: PersonsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Получить информацию о человеке',
    description: 'Возвращает информацию о человеке',
  })
  @ApiOkResponse({
    description: 'Информация успешно получена',
    type: [PersonDto],
  })
  getPerson(@Param('id') personId: string): Promise<PersonDto> {
    return this.personsService.get(personId);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список всех людей',
    description: 'Возвращает список всех людей',
  })
  @ApiOkResponse({
    description: 'Список успешно получен',
    type: [ListFormResponse],
  })
  listPersons(): Promise<ListPersonsResponse> {
    return this.personsService.list();
  }
}
