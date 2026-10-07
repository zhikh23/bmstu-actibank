import { Module } from '@nestjs/common';
import { FormsController } from './presentation/presentation.controller';
import { FormsService } from './presentation/presentation.service';

@Module({
  imports: [],
  controllers: [FormsController],
  providers: [FormsService],
})
export class FormsModule {}
