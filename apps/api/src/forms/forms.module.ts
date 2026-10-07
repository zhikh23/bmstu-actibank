import { Module } from '@nestjs/common';
import { CreateFormModule } from './use-cases/create-form/create-form.module';
import { FormsController } from './presentation/presentation.controller';
import { FormsService } from './presentation/presentation.service';

@Module({
  imports: [CreateFormModule],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
