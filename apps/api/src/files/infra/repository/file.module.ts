import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FileModel } from './file.model';
import { FileRepository } from './file.repository';

@Module({
  imports: [TypeOrmModule.forFeature([FileModel])],
  providers: [FileRepository],
  exports: [FileRepository],
})
export class FileRepositoryModule {}
