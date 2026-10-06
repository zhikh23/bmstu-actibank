import { Result } from 'neverthrow';
import { FormsError } from './errors';

export function expectOk<T>(res: Result<T, FormsError>): T {
  expect(res.isOk()).toBe(true);
  return res._unsafeUnwrap();
}

export function expectInvariantError(
  res: Result<unknown, FormsError>,
  part: string,
): void {
  expect(res.isErr()).toBe(true);
  const message = res
    .mapErr((e) => (e.kind === 'InvariantViolation' ? e.message : ''))
    ._unsafeUnwrapErr();
  expect(message).toContain(part);
}

export function expectInvalidTransitionError(
  res: Result<unknown, FormsError>,
): void {
  expect(res.isErr()).toBe(true);
  expect(res._unsafeUnwrapErr().kind).toBe('InvalidStateTransition');
}
