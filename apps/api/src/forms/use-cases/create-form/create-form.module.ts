import { Module } from '@nestjs/common';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';
import { CreateFormHandler } from './create-form.handler';
import { FormRepositoryModule } from '../../infra/repository/form.module';

@Module({
  imports: [FormRepositoryModule, UuidModule],
  providers: [CreateFormHandler],
  exports: [CreateFormHandler],
})
export class CreateFormModule {}
