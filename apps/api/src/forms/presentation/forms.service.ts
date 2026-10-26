import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateFormHandler } from '../use-cases/create-form/create-form.handler';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import { GetFormHandler } from '../use-cases/get-form/get-form.handler';
import { GetFormResponse } from './dto/get-form.response';
import { MarkFormReadyHandler } from '../use-cases/mark-form-ready/mark-form-ready.handler';
import { ConvertToDraftFormHandler } from '../use-cases/convert-to-draft-form/convert-to-draft-form-handler.service';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly createForm: CreateFormHandler,
    private readonly getForm: GetFormHandler,
    private readonly convertToDraftForm: ConvertToDraftFormHandler,
    private readonly markFormReady: MarkFormReadyHandler,
  ) {}

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

  async get(id: string): Promise<GetFormResponse> {
    const getRes = await this.getForm.execute({
      id,
      actorId: '00000000-0000-0000-0000-000000000000',
    });

    if (getRes.isErr()) {
      const err = getRes.error;
      switch (err.kind) {
        case 'Forbidden':
          throw new ForbiddenException(err.reason);
        case 'NotFound':
          throw new NotFoundException(err.message);
        default:
          this.logger.error(err);
          throw new InternalServerErrorException();
      }
    }

    const form = getRes.value;
    return {
      id: form.id,
      name: form.name,
      description: form.description,
      organizers: form.organizers,
      links: form.links,
      venues: form.venues,
      themes: form.themes,
      start: form.start,
      end: form.end,
      format: form.format,
      type: form.type,
      level: form.level,
      participants: {
        students: form.participants.students,
        employees: form.participants.employees,
        others: form.participants.others,
      },
      guests: form.guests.map((g) => ({
        userId: g.userId,
        rank: g.rank,
      })),
      team: form.team.map((m) => ({
        userId: m.userId,
        role: m.role,
      })),
      status: form.status,
      reason: form.reason,
      submitterId: form.submitterId,
      reviewerId: form.reviewerId,
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      reviewedAt: form.reviewedAt ? form.reviewedAt.toISOString() : null,
      canceledAt: form.canceledAt ? form.canceledAt.toISOString() : null,
    };
  }

  async markReady(id: string): Promise<void> {
    const result = await this.markFormReady.execute({
      formId: id,
      actorId: '00000000-0000-0000-0000-000000000000',
    });

    if (result.isErr()) {
      const err = result.error;
      switch (err.kind) {
        case 'InvalidStateTransition':
          throw new BadRequestException(
            'Form is not in a state that allows marking as ready',
          );
        case 'Forbidden':
          throw new ForbiddenException(err.reason);
        case 'NotFound':
          throw new NotFoundException(err.message);
        default:
          this.logger.error(err);
          throw new InternalServerErrorException();
      }
    }
  }

  async convertToDraft(id: string): Promise<void> {
    const result = await this.convertToDraftForm.execute({
      formId: id,
      actorId: '00000000-0000-0000-0000-000000000000',
    });

    if (result.isErr()) {
      const err = result.error;
      switch (err.kind) {
        case 'InvalidStateTransition':
          throw new BadRequestException(
            'Form is not in a state that allows converting to draft',
          );
        case 'Forbidden':
          throw new ForbiddenException(err.reason);
        case 'NotFound':
          throw new NotFoundException(err.message);
        default:
          this.logger.error(err);
          throw new InternalServerErrorException();
      }
    }
  }
}
