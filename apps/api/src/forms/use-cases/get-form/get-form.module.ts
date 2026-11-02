import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { GetFormHandler } from './get-form.handler';
import { CatalogServiceModule } from '../../../catalog/external/catalog-service.module';

@Module({
  imports: [FormRepositoryModule, CatalogServiceModule],
  providers: [GetFormHandler],
  exports: [GetFormHandler],
})
export class GetFormModule {}
