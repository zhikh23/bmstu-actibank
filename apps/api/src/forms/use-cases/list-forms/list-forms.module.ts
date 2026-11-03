import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { ListFormsHandler } from './list-forms.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [ListFormsHandler],
  exports: [ListFormsHandler],
})
export class ListFormsModule {}
