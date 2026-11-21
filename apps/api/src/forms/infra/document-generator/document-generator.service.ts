import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Docxtemplater from 'docxtemplater';
import { okAsync, ResultAsync } from 'neverthrow';
import * as fs from 'node:fs';
import path from 'node:path';
import PizZip from 'pizzip';

import { FormsError } from '@/forms/domain/errors';

import {
  IDocumentData,
  IDocumentGeneratorPort,
  IGeneratedData,
} from './document-generator.port';

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
});
const durationFormatter = new Intl.DurationFormat('ru-RU', {
  style: 'long',
});

@Injectable()
export class DocumentGeneratorService implements IDocumentGeneratorPort {
  private readonly templateFile;

  constructor(config: ConfigService) {
    this.templateFile = fs.readFileSync(
      path.resolve(config.getOrThrow('DOCUMENT_TEMPLATE_PATH')),
      'binary',
    );
  }

  generate(data: IDocumentData): ResultAsync<IGeneratedData, FormsError> {
    const zip = new PizZip(this.templateFile);
    const template = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });
    template.render({
      ...data,
      generatedAt: dateFormatter.format(Temporal.Now.instant()),
      start: dateFormatter.format(data.start),
      end: dateFormatter.format(data.end),
      duration: durationFormatter.format(data.duration),
      organizers: data.organizers.join(', '),
      links: data.links.join('\n'),
      themes: data.themes.join(', '),
    });
    return okAsync({
      body: template.toBuffer(),
      filename: `gen_${new Date().toISOString()}.docx`,
      contentType:
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });
  }
}
