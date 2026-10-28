import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormRepository } from './form.repository';
import {
  FormGuest,
  FormLink,
  FormMember,
  FormModel,
  FormOrganizer,
  FormTheme,
  FormVenue,
} from './form.model';
import { FormDocumentModel } from './form.model';
import { FormDocumentRepository } from './form-document.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      FormModel,
      FormOrganizer,
      FormLink,
      FormVenue,
      FormTheme,
      FormGuest,
      FormMember,
      FormDocumentModel,
    ]),
  ],
  providers: [FormRepository, FormDocumentRepository],
  exports: [FormRepository, FormDocumentRepository],
})
export class FormRepositoryModule {}
