import {
  Injectable,
  InternalServerErrorException,
  Logger,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFormHandler } from '../use-cases/create-form/create-form.handler';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(private readonly createForm: CreateFormHandler) {}

  async create(dto: CreateFormRequest): Promise<CreateFormResponse> {
    const createRes = await this.createForm.execute({
      name: dto.name,
      description: dto.description,
      organizers: dto.organizers,
      links: dto.links,
      venues: dto.venues,
      themes: dto.themes,
      start: dto.start,
      end: dto.end,
      formatId: dto.formatId,
      typeId: dto.typeId,
      levelId: dto.levelId,
      participants: dto.participants,
      guests: dto.guests,
      team: dto.team,
      submitterId: dto.submitterId,
    });

    if (createRes.isErr()) {
      const err = createRes.error;
      switch (err.kind) {
        case 'InvariantViolation':
          throw new UnprocessableEntityException(err.message);
        default:
          this.logger.error(err);
          throw new InternalServerErrorException();
      }
    }

    const form = createRes.value;
    return {
      formId: form.id,
    };
  }
}
