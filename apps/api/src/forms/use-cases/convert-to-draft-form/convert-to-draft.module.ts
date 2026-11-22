import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { ConvertToDraftFormHandler } from './convert-to-draft-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ConvertToDraftFormHandler],
  exports: [ConvertToDraftFormHandler],
})
export class ConvertToDraftModule {}
