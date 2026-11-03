import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const SLUG_LENGTH = 6;
const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

@Injectable()
export class SlugService {
  private readonly gen: () => string = customAlphabet(ALPHABET, SLUG_LENGTH);

  generate(): string {
    return this.gen();
  }
}
