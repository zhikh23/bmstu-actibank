import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/repository.module';
import { ApproveFormHandler } from './approve-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ApproveFormHandler],
  exports: [ApproveFormHandler],
})
export class ApproveFormModule {}
