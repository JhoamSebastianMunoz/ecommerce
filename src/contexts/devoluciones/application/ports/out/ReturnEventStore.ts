import { Return } from '../../../domain/aggregates/Return';

export abstract class ReturnEventStore {
  abstract save(ret: Return): Promise<void>;
  abstract findById(id: string): Promise<Return | null>;
}
