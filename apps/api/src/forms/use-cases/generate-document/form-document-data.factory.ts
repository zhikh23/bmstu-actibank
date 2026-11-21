import { Injectable } from '@nestjs/common';
import { ResultAsync } from 'neverthrow';

import { CatalogService } from '@/catalog/external/catalog.service';
import { FormsError } from '@/forms/domain/errors';
import { FormEntity } from '@/forms/domain/form.entity';
import { IDocumentData } from '@/forms/infra/document-generator/document-generator.port';

@Injectable()
export class FormDocumentDataFactory {
  constructor(private readonly catalog: CatalogService) {}

  create(form: FormEntity): ResultAsync<IDocumentData, FormsError> {
    return ResultAsync.combine([
      this.catalog.getEventType(form.typeId),
      this.catalog.getFormat(form.formatId),
      this.catalog.getLevel(form.levelId),
      this.catalog.getOrganizations(form.organizers),
      this.catalog.getRanks(form.guests.map((g) => g.rankId)),
      this.catalog.getRoles(form.team.map((m) => m.roleId)),
      this.catalog.getThemes(form.themes),
      this.catalog.getVenues(form.venues),
    ]).map(
      ([type, format, level, organizers, ranks, team, themes, venues]) => ({
        formId: form.id,
        name: form.name,
        description: form.description,
        organizers: organizers.map((o) => o.name),
        start: form.start,
        end: form.end,
        duration: form.duration(),
        venues: venues.map((v, i) => ({
          number: i + 1,
          name: v.name,
          buildingName: v.building.name,
        })),
        level: level.name,
        format: format.name,
        type: type.name,
        guests: ranks.map((r, i) => ({
          number: i + 1,
          fullName: 'Иванов Иван Иванович',
          rank: r.name,
        })),
        participants: {
          students: form.participants.students,
          employees: form.participants.employees,
          others: form.participants.others,
          total: form.participants.total(),
        },
        links: form.links,
        themes: themes.map((t) => t.name),
        team: team.map((m, i) => ({
          number: i + 1,
          fullName: 'Иванов Иван Иванович',
          groupOrPost: 'ИУ1-11',
          role: m.name,
        })),
      }),
    );
  }
}
