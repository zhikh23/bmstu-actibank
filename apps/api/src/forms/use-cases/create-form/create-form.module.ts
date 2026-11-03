import { Module } from '@nestjs/common';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';
import { CreateFormHandler } from './create-form.handler';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { SlugModule } from '../../../shared/infra/slug/slug.module';

@Module({
  imports: [FormRepositoryModule, UuidModule, SlugModule],
  providers: [CreateFormHandler],
  exports: [CreateFormHandler],
})
export class CreateFormModule {}
