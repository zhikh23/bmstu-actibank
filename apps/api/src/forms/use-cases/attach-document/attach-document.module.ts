import { Module } from '@nestjs/common';

import { FormRepositoryModule } from '@/forms/infra/repository/form.module';

import { AttachDocumentHandler } from './attach-document.handler';

@Module({
  imports: [FormRepositoryModule],
  providers: [AttachDocumentHandler],
  exports: [AttachDocumentHandler],
})
export class AttachDocumentModule {}
