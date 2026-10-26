import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { ApproveFormHandler } from './approve-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ApproveFormHandler],
  exports: [ApproveFormHandler],
})
export class ApproveFormModule {}
