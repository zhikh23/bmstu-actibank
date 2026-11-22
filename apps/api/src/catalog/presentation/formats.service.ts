import { Injectable } from '@nestjs/common';

import { GetAllFormatsHandler } from '@/catalog/use-cases/get-all-formats/get-all-formats.handler';
import { FormatDto } from '@/shared/presentation/dto/format.dto';

import { CatalogService } from './catalog.service';

@Injectable()
export class FormatsService extends CatalogService {
  constructor(private readonly allFormats: GetAllFormatsHandler) {
    super();
  }

  getAllFormats(): Promise<FormatDto[]> {
    return this.resolve(this.allFormats.execute());
  }
}
