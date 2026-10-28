import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { StartFormReviewHandler } from './start-form-review.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [StartFormReviewHandler],
  exports: [StartFormReviewHandler],
})
export class StartFormReviewModule {}
