import {
  Controller,
  Get,
  Param,
  Post,
  StreamableFile,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiCookieAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { FilesService } from './files.service';
import { RolesGuard } from '../../auth/presentation/auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { FormDataFileDto } from './dto/form-data-file.dto';
import { CurrentUser, Roles } from '../../auth/presentation/auth.decorators';
import { UploadFileResponse } from './dto/upload-file.response';
import {
  AuthenticatedUser,
  Role,
} from '../../shared/domain/authenticated-user.entity';

@Controller('files')
@ApiTags('Files')
@ApiCookieAuth('actibank_session')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Post()
  @Roles(Role.Applicant)
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  @ApiOperation({
    summary: 'Загрузить файл',
    description: 'Загружает файл в хранилище и возвращает его идентификатор.',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    type: 'multipart/form-data',
    required: true,
    schema: {
      type: 'object',
      required: ['file'],
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({
    description: 'Файл успешно загружен.',
    type: UploadFileResponse,
  })
  async upload(
    @UploadedFile() file: FormDataFileDto,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<UploadFileResponse> {
    return this.filesService.upload(file, user.id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Скачать файл',
    description: 'Возвращает содержание файла по его идентификатору.',
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Идентификатор файла.',
  })
  @ApiOkResponse({
    description: 'Файл успешно получен.',
    content: {
      'application/octet-stream': {
        schema: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'У пользователя нет прав на просмотр файла.',
  })
  @ApiNotFoundResponse({
    description: 'Форма или файл не найдены.',
  })
  async download(
    @Param('id') id: string,
    @CurrentUser() user: AuthenticatedUser,
  ): Promise<StreamableFile> {
    return await this.filesService.download(
      id,
      user.id,
      user.roles.includes(Role.Moderator),
    );
  }
}
