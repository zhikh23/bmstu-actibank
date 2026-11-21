import {
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, Param } from '@nestjs/common';
import { StudentsService } from './students.service';
import { StudentDto } from './dto/student.dto';
import {
  ListStudentsItemDto,
  ListStudentsResponse,
} from './dto/list-students.response';

@ApiTags('Students')
@Controller('students')
@ApiInternalServerErrorResponse({ description: 'Ошибка на стороне сервера' })
export class StudentsController {
  constructor(private readonly studentsService: StudentsService) {}

  @Get(':id')
  @ApiOperation({
    summary: 'Получить информацию о студента',
    description: 'Возвращает информацию о студенте',
  })
  @ApiOkResponse({
    description: 'Информация успешно получена',
    type: [StudentDto],
  })
  getStudent(@Param('id') studentId: string): Promise<StudentDto> {
    return this.studentsService.get(studentId);
  }

  @Get()
  @ApiOperation({
    summary: 'Получить список всех студентов',
    description: 'Возвращает список всех студентов',
  })
  @ApiOkResponse({
    description: 'Список успешно получен',
    type: [Array<ListStudentsItemDto>],
  })
  listStudents(): Promise<ListStudentsResponse> {
    return this.studentsService.list();
  }
}
