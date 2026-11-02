import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FileModel } from './file.model';
import { Repository } from 'typeorm';
import { errAsync, okAsync, ResultAsync } from 'neverthrow';
import { File } from '../../domain/file.entity';
import { FilesError } from '../../domain/errors';
import { FileMapper } from './file.mapper';

@Injectable()
export class FileRepository {
  constructor(
    @InjectRepository(FileModel)
    private readonly repository: Repository<FileModel>,
  ) {}

  save(file: File): ResultAsync<File, FilesError> {
    return ResultAsync.fromPromise(
      this.repository.save(FileMapper.toModel(file)),
      (error): FilesError =>
        FilesError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => file);
  }

  get(id: string): ResultAsync<File, FilesError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
      }),
      (error): FilesError =>
        FilesError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) => {
      return model
        ? okAsync(FileMapper.toDomain(model))
        : errAsync(FilesError.notFound(`file with "${id} not found"`));
    });
  }
}
