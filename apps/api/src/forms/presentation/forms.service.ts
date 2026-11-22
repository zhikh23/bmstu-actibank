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
import { ConvertToDraftFormHandler } from '@/forms/use-cases/convert-to-draft-form/convert-to-draft-form.handler';
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
import { ListFormsItem } from './dto/list-forms.response';
import { RejectFormRequest } from './dto/reject-form.request';
import { UpdateFormRequest } from './dto/update-form.request';
import { ConvertToDraftRequest } from '@/forms/presentation/dto/convert-to-draft.request';
import { CancelFormReviewHandler } from '@/forms/use-cases/cancel-form-review/cancel-form-review.handler';
import { ResultAsync } from 'neverthrow';
import { FormSummary } from '@/forms/use-cases/list-forms/list-forms.data';

@Injectable()
export class FormsService {
  private readonly logger = new Logger(FormsService.name);

  constructor(
    private readonly approveForm: ApproveFormHandler,
    private readonly attachDocument: AttachDocumentHandler,
    private readonly cancelForm: CancelFormHandler,
    private readonly cancelFormReview: CancelFormReviewHandler,
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

  approve(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.resolve(this.approveForm.execute({ actor, formId }));
  }

  attach(
    actor: AuthenticatedUser,
    formId: string,
    dto: AttachDocumentRequest,
  ): Promise<void> {
    return this.resolve(
      this.attachDocument.execute({
        actorId: actor.id,
        formId,
        fileId: dto.fileId,
      }),
    );
  }

  cancel(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.resolve(this.cancelForm.execute({ actor, formId }));
  }

  cancelReview(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.resolve(this.cancelFormReview.execute({ actor, formId }));
  }

  create(
    actor: AuthenticatedUser,
    dto: CreateFormRequest,
  ): Promise<CreateFormResponse> {
    return this.resolve(
      this.createForm
        .execute({
          actor,
          ...dto,
        })
        .map((form) => ({ formId: form.id })),
    );
  }

  convertToDraft(
    actor: AuthenticatedUser,
    formId: string,
    dto: ConvertToDraftRequest,
  ): Promise<void> {
    return this.resolve(
      this.convertToDraftForm.execute({
        actor,
        formId,
        reason: dto.reason ?? null,
      }),
    );
  }

  generate(
    actor: AuthenticatedUser,
    formId: string,
  ): Promise<GenerateDocumentResponse> {
    return this.resolve(this.generateDocument.execute({ actor, formId }));
  }

  get(actor: AuthenticatedUser, formId: string): Promise<GetFormResponse> {
    return this.resolve(
      this.getForm.execute({ actor, formId }).map(this.mapFormToResponse),
    );
  }

  list(
    actor: AuthenticatedUser,
    query: ListFormsRequest,
  ): Promise<ListFormsItem[]> {
    return this.resolve(
      this.listForms
        .execute({ actor, ...query })
        .map((forms) => forms.map(this.mapFormSummaryToResponse)),
    );
  }

  markReady(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.resolve(this.markFormReady.execute({ actor, formId }));
  }

  reject(
    actor: AuthenticatedUser,
    formId: string,
    dto: RejectFormRequest,
  ): Promise<void> {
    return this.resolve(
      this.rejectForm.execute({
        actor,
        formId,
        reason: dto.reason ?? null,
      }),
    );
  }

  startReview(actor: AuthenticatedUser, formId: string): Promise<void> {
    return this.resolve(this.startFormReview.execute({ actor, formId }));
  }

  update(
    actor: AuthenticatedUser,
    formId: string,
    dto: UpdateFormRequest,
  ): Promise<GetFormResponse> {
    return this.resolve(
      this.updateForm
        .execute({
          actor,
          id: formId,
          ...dto,
        })
        .map((form) => this.mapFormToResponse(form)),
    );
  }

  private mapFormSummaryToResponse(form: FormSummary): ListFormsItem {
    return {
      ...form,
      start: form.start.toISOString(),
      end: form.end.toISOString(),
      createdAt: form.createdAt.toISOString(),
    };
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

  private resolve<T>(result: ResultAsync<T, FormsError>): Promise<T> {
    return result.match(
      (value) => value,
      (error) => {
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
      },
    );
  }
}
