import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { GetFormHandler } from './get-form.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
