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
import { ApproveFormHandler } from '../use-cases/approve-form/approve-form.handler';
import { CancelFormHandler } from '../use-cases/cancel-form/cancel-form.handler';
import { RejectFormHandler } from '../use-cases/reject-form/reject-form.handler';
import { StartFormReviewHandler } from '../use-cases/start-form-review/start-form-review.handler';
import { RejectFormRequest } from './dto/reject-form.request';
import { AuthenticatedUser } from '../../shared/domain/authenticated-user.entity';
import { GenerateDocumentResponse } from './dto/generate-document.response';
import { GenerateDocumentHandler } from '../use-cases/generate-document/generate-document.handler';
import { FormsError } from '../domain/errors';
import { FormType } from '../use-cases/get-form/get-form.data';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly approveForm: ApproveFormHandler,
    private readonly cancelForm: CancelFormHandler,
    private readonly convertToDraftForm: ConvertToDraftFormHandler,
    private readonly createForm: CreateFormHandler,
    private readonly generateDocument: GenerateDocumentHandler,
    private readonly getForm: GetFormHandler,
    private readonly markFormReady: MarkFormReadyHandler,
    private readonly rejectForm: RejectFormHandler,
    private readonly startFormReview: StartFormReviewHandler,
  ) {}

  async approve(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.approveForm.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  async cancel(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.cancelForm.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  async create(
    actor: AuthenticatedUser,
    dto: CreateFormRequest,
  ): Promise<CreateFormResponse> {
    return this.createForm
      .execute({
        actor,
        ...dto,
      })
      .match(
        (form) => ({
          formId: form.id,
        }),
        (error) => this.handlerError(error),
      );
  }

  async convertToDraft(
    actor: AuthenticatedUser,
    formId: string,
  ): Promise<void> {
    return this.convertToDraftForm.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  async generate(
    actor: AuthenticatedUser,
    formId: string,
  ): Promise<GenerateDocumentResponse> {
    return await this.generateDocument.execute({ actor, formId }).match(
      (res) => res,
      (error) => this.handlerError(error),
    );
  }

  async get(
    actor: AuthenticatedUser,
    formId: string,
  ): Promise<GetFormResponse> {
    return this.getForm.execute({ actor, formId }).match(
      (form) => this.mapFormToResponse(form),
      (error) => this.handlerError(error),
    );
  }

  async markReady(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.markFormReady.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  async reject(
    actor: AuthenticatedUser,
    formId: string,
    dto: RejectFormRequest,
  ): Promise<void> {
    return this.rejectForm
      .execute({
        actor,
        formId,
        reason: dto.reason ?? null,
      })
      .match(
        () => {},
        (error) => this.handlerError(error),
      );
  }

  async startReview(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.startFormReview.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  private mapFormToResponse(form: FormType): GetFormResponse {
    return {
      ...form,
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
      createdAt: form.createdAt.toISOString(),
      updatedAt: form.updatedAt.toISOString(),
      reviewedAt: form.reviewedAt ? form.reviewedAt.toISOString() : null,
      canceledAt: form.canceledAt ? form.canceledAt.toISOString() : null,
    };
  }

  private handlerError(error: FormsError): never {
    switch (error.kind) {
      case 'InvalidStateTransition':
        throw new BadRequestException(
          `Invalid transition: ${error.from} -> ${error.to}`,
        );
      case 'Forbidden':
        throw new ForbiddenException(error.reason);
      case 'NotFound':
        throw new NotFoundException(error.message);
      case 'InvariantViolation':
        throw new UnprocessableEntityException(error.message);
      default:
        this.logger.error(error);
        throw new InternalServerErrorException();
    }
  }
}
