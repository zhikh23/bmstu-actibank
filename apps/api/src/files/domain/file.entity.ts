export type FileCreate = {
  id: string;
  ownerId: string;
  storageKey: string;
  contentType: string;
  size: number;
};

export type FileInit = FileCreate & {
  createdAt: Temporal.Instant;
};

export class File {
  declare id: string;
  declare ownerId: string;
  declare storageKey: string;
  declare contentType: string;
  declare size: number;
  declare createdAt: Temporal.Instant;

  constructor(init: FileInit) {
    Object.assign(this, init);
  }

  static create(
    data: FileCreate,
    now: Temporal.Instant = Temporal.Now.instant(),
  ): File {
    return new File({
      ...data,
      createdAt: now,
    });
  }

  static restore(init: FileInit): File {
    return new File(init);
  }
}
