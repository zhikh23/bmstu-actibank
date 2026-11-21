import { Module } from '@nestjs/common';

import { CatalogServiceModule } from '@/catalog/external/catalog-service.module';
import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { UpdateFormHandler } from './update-form.handler';

@Module({
  imports: [FormRepositoryModule, CatalogServiceModule],
  providers: [UpdateFormHandler],
  exports: [UpdateFormHandler],
})
export class UpdateFormModule {}
