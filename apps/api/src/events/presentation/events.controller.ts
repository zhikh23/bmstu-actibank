import { Controller, Get, Query } from '@nestjs/common';
import {
  ApiCookieAuth,
  ApiOkResponse,
  ApiOperation,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { EventsService } from './events.service';
import { ListEventsRequest } from './dto/list-events.request';
import { CurrentUser } from '@/auth/presentation/auth.decorators';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';
import { ListEventsItem, ListEventsResponse } from './dto/list-events.response';

@Controller('events')
@ApiTags('Events')
@ApiCookieAuth('actibank_session')
export class EventsController {
  constructor(private readonly service: EventsService) {}

  @Get()
  @ApiOperation({
    summary: 'Получить все доступные события',
    description:
      'Возвращает все доступные события для текущего пользователя\
      Для модератора доступны все хранимые неудалённые события.\
      Заявитель может видеть все события, которые были созданы по его заявке.\
      В иных случаях событие может быть видно только если пользователь был его организатором.\
      \
      Возможна фильтрация по дате (задать и start, и end одновременно), по наличию\
      организации в организаторах, а так же осуществление поиска по названию.\
      \
      Присутствует сортировка по некоторым полям (name, start, createdAt),\
      а также механизм пагинации',
  })
  @ApiOkResponse({
    description: 'События успешно получены',
    type: [ListEventsItem],
  })
  @ApiQuery({
    name: 'sortBy',
    description: 'Поле для сортировки',
    required: false,
    enum: ['name', 'start', 'createdAt'],
    default: 'createdAt',
  })
  @ApiQuery({
    name: 'sortOrder',
    description: 'Порядок сортировки',
    required: false,
    enum: ['asc', 'desc'],
    default: 'desc',
  })
  @ApiQuery({
    name: 'start',
    description: 'Начало диапазона дат для фильтрации',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'end',
    description: 'Конец диапазона дат для фильтрации',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'search',
    description: 'Строка для поиска по названию события',
    required: false,
  })
  @ApiQuery({
    name: 'organizerIds',
    description:
      'Список идентификаторов организаций, которые должны быть среди организаторов события',
    required: false,
    type: [String],
  })
  @ApiQuery({
    name: 'offset',
    description: 'Смещение для пагинации',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    description: 'Количество элементов на странице для пагинации',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'search',
    description: 'Строка для поиска по названию события',
    required: false,
  })
  @ApiQuery({
    name: 'organizerIds',
    description:
      'Список идентификаторов организаций, которые являются организаторами мероприятия',
    required: false,
    type: [String],
  })
  list(
    @Query() req: ListEventsRequest,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<ListEventsResponse> {
    return this.service.list(user, req);
  }
}
