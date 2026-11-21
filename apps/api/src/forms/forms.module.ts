import { Module } from '@nestjs/common';

import { FormsController } from './presentation/forms.controller';
import { FormsService } from './presentation/forms.service';
import { ApproveFormModule } from './use-cases/approve-form/approve-form.module';
import { AttachDocumentModule } from './use-cases/attach-document/attach-document.module';
import { CancelFormModule } from './use-cases/cancel-form/cancel-form.module';
import { ConvertToDraftModule } from './use-cases/convert-to-draft-form/convert-to-draft.module';
import { CreateFormModule } from './use-cases/create-form/create-form.module';
import { GenerateDocumentModule } from './use-cases/generate-document/generate-document.module';
import { GetFormModule } from './use-cases/get-form/get-form.module';
import { ListFormsModule } from './use-cases/list-forms/list-forms.module';
import { MarkFormReadyModule } from './use-cases/mark-form-ready/mark-form-ready.module';
import { RejectFormModule } from './use-cases/reject-form/reject-form.module';
import { StartFormReviewModule } from './use-cases/start-form-review/start-form-review.module';
import { UpdateFormModule } from './use-cases/update-form/update-form.module';

@Module({
  imports: [
    ApproveFormModule,
    AttachDocumentModule,
    ListFormsModule,
    CancelFormModule,
    ConvertToDraftModule,
    CreateFormModule,
    GenerateDocumentModule,
    GetFormModule,
    MarkFormReadyModule,
    RejectFormModule,
    StartFormReviewModule,
    UpdateFormModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
