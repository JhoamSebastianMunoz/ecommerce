import { DomainEvent } from './DomainEvent';

export interface DomainEventPublisher {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  publishAll(events: DomainEvent[]): Promise<void>;
}
