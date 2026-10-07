import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';
import { CreateFormHandler } from './create-form.handler';

@Module({
  imports: [FormRepositoryModule, UuidModule],
  providers: [CreateFormHandler],
  exports: [CreateFormHandler],
})
export class CreateFormModule {}
