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
    ]),
  ],
  providers: [FormRepository],
  exports: [FormRepository],
})
export class FormRepositoryModule {}
