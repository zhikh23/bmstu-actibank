import { Module } from '@nestjs/common';
import { CreateFormModule } from './use-cases/create-form/create-form.module';
import { FormsController } from './presentation/forms.controller';
import { FormsService } from './presentation/forms.service';
import { GetFormModule } from './use-cases/get-form/get-form.module';

@Module({
  imports: [CreateFormModule, GetFormModule],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
