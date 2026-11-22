import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { CancelFormReviewHandler } from './cancel-form-review.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [CancelFormReviewHandler],
  exports: [CancelFormReviewHandler],
})
export class CancelFormReviewModule {}
