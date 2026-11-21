import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { RejectFormHandler } from './reject-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [RejectFormHandler],
  exports: [RejectFormHandler],
})
export class RejectFormModule {}
