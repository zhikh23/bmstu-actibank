import { Module } from '@nestjs/common';
import { DOCUMENT_GENERATOR_PORT } from './document-generator.tokens';
import { DocumentGeneratorService } from './document-generator.service';

@Module({
  providers: [
    {
      provide: DOCUMENT_GENERATOR_PORT,
      useExisting: DocumentGeneratorService,
    },
    DocumentGeneratorService,
  ],
  exports: [DOCUMENT_GENERATOR_PORT],
})
export class DocumentGeneratorModule {}
