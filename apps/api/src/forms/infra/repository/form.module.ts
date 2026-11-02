import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FormRepository } from './form.repository';
import {
  FormDocumentModel,
  FormGuest,
  FormLink,
  FormMember,
  FormModel,
  FormOrganizer,
  FormTheme,
  FormVenue,
} from './form.model';

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
  providers: [FormRepository],
  exports: [FormRepository],
})
export class FormRepositoryModule {}
