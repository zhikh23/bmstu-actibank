import { Module } from '@nestjs/common';
import { FormRepositoryModule } from '../../infra/repository/form.module';
import { DocumentGeneratorModule } from '../../infra/document-generator/document-generator.module';
import { FilesServiceModule } from '../../../files/export/files-service.module';
import { GenerateDocumentHandler } from './generate-document.handler';
import { FormDocumentDataFactory } from './form-document-data.factory';
import { CatalogServiceModule } from '../../../catalog/external/catalog-service.module';
import { UuidModule } from '../../../shared/infra/uuid/uuid.module';

@Module({
  imports: [
    CatalogServiceModule,
    DocumentGeneratorModule,
    FormRepositoryModule,
    FilesServiceModule,
    UuidModule,
  ],
  providers: [GenerateDocumentHandler, FormDocumentDataFactory],
  exports: [GenerateDocumentHandler],
})
export class GenerateDocumentModule {}
