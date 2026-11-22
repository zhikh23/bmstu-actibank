import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, ResultAsync, errAsync, okAsync } from 'neverthrow';
import { Repository } from 'typeorm';

import { FormsError } from '@/forms/domain/errors';
import { FormEntity } from '@/forms/domain/form.entity';

import { FormMapper } from './form.mapper';
import { FormModel } from './form.model';

export type SortBy = 'createdAt' | 'start';
export type SortOrder = 'asc' | 'desc';

export type GetAllFormsQuery = {
  actorId: string;
  isModerator: boolean;
  status?: string;
  sortBy?: SortBy;
  sortOrder?: SortOrder;
};

@Injectable()
export class FormRepository {
  constructor(
    @InjectRepository(FormModel)
    private readonly repository: Repository<FormModel>,
  ) {}

  save(f: FormEntity): ResultAsync<FormEntity, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.save(FormMapper.toModel(f)),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).map(() => f);
  }

  update(f: FormEntity): ResultAsync<void, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.findOneBy({ id: f.id }),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? ResultAsync.fromPromise(
            this.repository.save(FormMapper.toModel(f)),
            (error): FormsError =>
              FormsError.repository(
                error instanceof Error ? error.message : String(error),
              ),
          ).map(() => undefined)
        : errAsync(FormsError.notFound(`form with id "${f.id}" not found`)),
    );
  }

  get(id: string): ResultAsync<FormEntity, FormsError> {
    return ResultAsync.fromPromise(
      this.repository.findOne({
        where: { id },
        relations: {
          organizers: true,
          links: true,
          venues: true,
          themes: true,
          guests: true,
          team: true,
          document: true,
        },
        order: {
          organizers: {
            number: 'ASC',
          },
          links: {
            number: 'ASC',
          },
          venues: {
            number: 'ASC',
          },
          themes: {
            number: 'ASC',
          },
          guests: {
            number: 'ASC',
          },
          team: {
            number: 'ASC',
          },
        },
      }),
      (error): FormsError =>
        FormsError.repository(
          error instanceof Error ? error.message : String(error),
        ),
    ).andThen((model) =>
      model
        ? FormMapper.toDomain(model)
        : errAsync(FormsError.notFound(`form with id "${id} not found"`)),
    );
  }

  getAll(q: GetAllFormsQuery): ResultAsync<FormEntity[], FormsError> {
    const sortColumn: Record<SortBy, string> = {
      createdAt: 'form.created_at',
      start: 'form.start',
    };
    const sortOrder: Record<SortOrder, 'ASC' | 'DESC'> = {
      asc: 'ASC',
      desc: 'DESC',
    };
    const query = this.repository
      .createQueryBuilder('form')
      .leftJoinAndSelect('form.organizers', 'organizers')
      .leftJoinAndSelect('form.links', 'links')
      .leftJoinAndSelect('form.venues', 'venues')
      .leftJoinAndSelect('form.themes', 'themes')
      .leftJoinAndSelect('form.guests', 'guests')
      .leftJoinAndSelect('form.team', 'team')
      .leftJoinAndSelect('form.document', 'document')
      .where('form.deleted_at IS NULL')
      .orderBy(
        sortColumn[q.sortBy ?? 'createdAt'],
        sortOrder[q.sortOrder ?? 'desc'],
      )
      .addOrderBy('form.id', 'ASC');

    if (q.isModerator) {
      query.andWhere(
        '(form.status = :pendingStatus OR form.reviewer_id = :actorId)',
        {
          pendingStatus: 'pending',
          actorId: q.actorId,
        },
      );
    } else {
      query.andWhere('form.submitter_id = :actorId', {
        actorId: q.actorId,
      });
    }

    if (q.status) {
      query.andWhere('form.status = :status', { status: q.status });
    }

    return ResultAsync.fromPromise(query.getMany(), (error): FormsError =>
      FormsError.repository(
        error instanceof Error ? error.message : String(error),
      ),
    ).andThen((models) => {
      const result = Result.combine(
        models.map((model) => FormMapper.toDomain(model)),
      );
      return result.isOk() ? okAsync(result.value) : errAsync(result.error);
    });
  }
}
