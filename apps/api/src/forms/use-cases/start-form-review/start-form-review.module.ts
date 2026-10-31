import { Module } from '@nestjs/common';
import { StartFormReviewHandler } from './start-form-review.handler';
import { FormRepositoryModule } from '../../infra/repository/form.module';

@Module({
  imports: [FormRepositoryModule],
  providers: [StartFormReviewHandler],
  exports: [StartFormReviewHandler],
})
export class StartFormReviewModule {}
