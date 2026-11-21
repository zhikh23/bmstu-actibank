import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';

import { FormsError } from '@/forms/domain/errors';
import { ApproveFormHandler } from '@/forms/use-cases/approve-form/approve-form.handler';
import { AttachDocumentHandler } from '@/forms/use-cases/attach-document/attach-document.handler';
import { CancelFormHandler } from '@/forms/use-cases/cancel-form/cancel-form.handler';
import { ConvertToDraftFormHandler } from '@/forms/use-cases/convert-to-draft-form/convert-to-draft-form-handler.service';
import { CreateFormHandler } from '@/forms/use-cases/create-form/create-form.handler';
import { GenerateDocumentHandler } from '@/forms/use-cases/generate-document/generate-document.handler';
import { FormType } from '@/forms/use-cases/get-form/get-form.data';
import { GetFormHandler } from '@/forms/use-cases/get-form/get-form.handler';
import { ListFormsHandler } from '@/forms/use-cases/list-forms/list-forms.handler';
import { MarkFormReadyHandler } from '@/forms/use-cases/mark-form-ready/mark-form-ready.handler';
import { RejectFormHandler } from '@/forms/use-cases/reject-form/reject-form.handler';
import { StartFormReviewHandler } from '@/forms/use-cases/start-form-review/start-form-review.handler';
import { UpdateFormHandler } from '@/forms/use-cases/update-form/update-form.handler';
import { AuthenticatedUser } from '@/shared/domain/authenticated-user.entity';

import { AttachDocumentRequest } from './dto/attach-document.request';
import { CreateFormRequest } from './dto/create-form.request';
import { CreateFormResponse } from './dto/create-form.response';
import { GenerateDocumentResponse } from './dto/generate-document.response';
import { GetFormResponse } from './dto/get-form.response';
import { ListFormsRequest } from './dto/list-forms.request';
import { ListFormResponse } from './dto/list-forms.response';
import { RejectFormRequest } from './dto/reject-form.request';
import { UpdateFormRequest } from './dto/update-form.request';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly approveForm: ApproveFormHandler,
    private readonly attachDocument: AttachDocumentHandler,
    private readonly cancelForm: CancelFormHandler,
    private readonly convertToDraftForm: ConvertToDraftFormHandler,
    private readonly createForm: CreateFormHandler,
    private readonly generateDocument: GenerateDocumentHandler,
    private readonly getForm: GetFormHandler,
    private readonly markFormReady: MarkFormReadyHandler,
    private readonly rejectForm: RejectFormHandler,
    private readonly startFormReview: StartFormReviewHandler,
    private readonly updateForm: UpdateFormHandler,
    private readonly listForms: ListFormsHandler,
  ) {}

  async approve(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.approveForm.execute({ actor, formId }).match(
      () => {},
      (error) => this.handlerError(error),
    );
  }

  async attach(
    actor: AuthenticatedUser,
    formId: string,
    dto: AttachDocumentRequest,
  ): Promise<void> {
    return this.attachDocument
      .execute({
        actorId: actor.id,
        formId,
        fileId: dto.fileId,
      })
      .match(
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

  async list(
    actor: AuthenticatedUser,
    query: ListFormsRequest,
  ): Promise<ListFormResponse[]> {
    return this.listForms.execute({ actor, ...query }).match(
      (forms) =>
        forms.map((form) => ({
          ...form,
          start: form.start.toISOString(),
          end: form.end.toISOString(),
          createdAt: form.createdAt.toISOString(),
        })),
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

  async update(
    actor: AuthenticatedUser,
    formId: string,
    dto: UpdateFormRequest,
  ): Promise<GetFormResponse> {
    return this.updateForm
      .execute({
        actor,
        id: formId,
        ...dto,
      })
      .match(
        (form) => this.mapFormToResponse(form),
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
