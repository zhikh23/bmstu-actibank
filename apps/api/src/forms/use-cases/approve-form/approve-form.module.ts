import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { ApproveFormHandler } from './approve-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ApproveFormHandler],
  exports: [ApproveFormHandler],
})
export class ApproveFormModule {}
