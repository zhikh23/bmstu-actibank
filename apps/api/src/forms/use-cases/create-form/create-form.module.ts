import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';
import { SlugModule } from '@/shared/infra/slug/slug.module';
import { UuidModule } from '@/shared/infra/uuid/uuid.module';

import { CreateFormHandler } from './create-form.handler';

@Module({
  imports: [FormRepositoryModule, UuidModule, SlugModule],
  providers: [CreateFormHandler],
  exports: [CreateFormHandler],
})
export class CreateFormModule {}
