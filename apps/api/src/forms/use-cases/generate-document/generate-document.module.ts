import { Module } from '@nestjs/common';

import { CatalogServiceModule } from '@/catalog/external/catalog-service.module';
import { FilesServiceModule } from '@/files/export/files-service.module';
import { DocumentGeneratorModule } from '@/forms/infra/document-generator/document-generator.module';
import { FormRepositoryModule } from '@/forms/infra/repository/form.module';
import { UuidModule } from '@/shared/infra/uuid/uuid.module';

import { FormDocumentDataFactory } from './form-document-data.factory';
import { GenerateDocumentHandler } from './generate-document.handler';

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
