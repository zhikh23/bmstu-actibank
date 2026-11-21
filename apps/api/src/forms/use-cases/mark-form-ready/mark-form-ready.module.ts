import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { MarkFormReadyHandler } from './mark-form-ready.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [MarkFormReadyHandler],
  exports: [MarkFormReadyHandler],
})
export class MarkFormReadyModule {}
