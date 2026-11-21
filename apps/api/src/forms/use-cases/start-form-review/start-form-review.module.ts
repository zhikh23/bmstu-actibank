import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { StartFormReviewHandler } from './start-form-review.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [StartFormReviewHandler],
  exports: [StartFormReviewHandler],
})
export class StartFormReviewModule {}
