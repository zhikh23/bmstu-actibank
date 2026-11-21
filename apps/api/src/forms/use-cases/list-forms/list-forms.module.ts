import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { ListFormsHandler } from './list-forms.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ListFormsHandler],
  exports: [ListFormsHandler],
})
export class ListFormsModule {}
