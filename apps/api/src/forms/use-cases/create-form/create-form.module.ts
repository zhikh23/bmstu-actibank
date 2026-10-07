import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { CreateFormHandler } from './create-form.handler';

@Module({
  imports: [
    FormRepositoryModule,
  ],
  providers: [CreateFormHandler],
  exports: [CreateFormHandler],
})
export class CreateFormModule {}
