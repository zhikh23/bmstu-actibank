import { Module } from '@nestjs/common';
import { CreateFormModule } from './use-cases/create-form/create-form.module';
import { FormsController } from './presentation/forms.controller';
import { FormsService } from './presentation/forms.service';
import { GetFormModule } from './use-cases/get-form/get-form.module';
import { MarkFormReadyModule } from './use-cases/mark-form-ready/mark-form-ready.module';
import { ConvertToDraftModule } from './use-cases/convert-to-draft-form/convert-to-draft.module';
import { ApproveFormModule } from './use-cases/approve-form/approve-form.module';
import { CancelFormModule } from './use-cases/cancel-form/cancel-form.module';
import { RejectFormModule } from './use-cases/reject-form/reject-form.module';
import { StartFormReviewModule } from './use-cases/start-form-review/start-form-review.module';
import { GenerateDocumentModule } from './use-cases/generate-document/generate-document.module';

@Module({
  imports: [
    ApproveFormModule,
    CancelFormModule,
    ConvertToDraftModule,
    CreateFormModule,
    GenerateDocumentModule,
    GetFormModule,
    MarkFormReadyModule,
    RejectFormModule,
    StartFormReviewModule,
  ],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
