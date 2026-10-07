import { Module } from '@nestjs/common';
import { FormRepository } from './form.repository';

@Module({
  providers: [FormRepository],
  exports: [FormRepository],
})
export class FormRepositoryModule {}
