import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { FilesError } from '@/files/domain/errors';
import { File } from '@/files/domain/file.entity';

import { FileMapper } from './file.mapper';
import { FileModel } from './file.model';

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
