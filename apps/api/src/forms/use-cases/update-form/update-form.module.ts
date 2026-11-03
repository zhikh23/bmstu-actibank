import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { CatalogServiceModule } from '../../../catalog/external/catalog-service.module';
import { UpdateFormHandler } from './update-form.handler';

@Module({
  imports: [FormRepositoryModule, CatalogServiceModule],
  providers: [UpdateFormHandler],
  exports: [UpdateFormHandler],
})
export class UpdateFormModule {}
