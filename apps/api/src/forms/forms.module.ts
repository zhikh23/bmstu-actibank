import { Module } from '@nestjs/common';
import { CreateFormModule } from './use-cases/create-form/create-form.module';
import { FormsController } from './presentation/presentation.controller';
import { FormsService } from './presentation/presentation.service';
import { GetFormModule } from './use-cases/get-form/get-form.module';

@Module({
  imports: [CreateFormModule, GetFormModule],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
