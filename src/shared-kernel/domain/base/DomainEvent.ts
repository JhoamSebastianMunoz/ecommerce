import { v4 as uuidv4 } from 'uuid';

export interface DomainEventProps {
  eventId?: string;
  aggregateId: string;
  occurredAt?: Date;
  correlationId?: string;
  eventType: string;
  version?: number;
}

export abstract class DomainEvent {
  readonly eventId: string;
  readonly aggregateId: string;
  readonly occurredAt: Date;
  readonly correlationId?: string;
  readonly eventType: string;
  readonly version: number;

  constructor(props: DomainEventProps) {
    this.eventId = props.eventId ?? uuidv4();
    this.aggregateId = props.aggregateId;
    this.occurredAt = props.occurredAt ?? new Date();
    this.correlationId = props.correlationId;
    this.eventType = props.eventType;
    this.version = props.version ?? 1;
  }

  abstract toJSON(): Record<string, unknown>;
}

export interface DomainEventConstructor {
  new (props: DomainEventProps & Record<string, unknown>): DomainEvent;
}
