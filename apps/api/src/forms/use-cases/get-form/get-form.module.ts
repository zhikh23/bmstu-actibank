import { Module } from '@nestjs/common';

import { CatalogServiceModule } from '@/catalog/external/catalog-service.module';
import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { GetFormHandler } from './get-form.handler';

@Module({
  imports: [FormRepositoryModule, CatalogServiceModule],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
