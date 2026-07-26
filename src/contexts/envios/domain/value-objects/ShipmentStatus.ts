import { ValueObject } from '../../../../shared-kernel/domain/base/ValueObject';

export enum ShipmentStatusEnum {
  CREATED = 'CREATED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
}

const VALID_TRANSITIONS: Record<ShipmentStatusEnum, ShipmentStatusEnum[]> = {
  [ShipmentStatusEnum.CREATED]: [ShipmentStatusEnum.IN_TRANSIT, ShipmentStatusEnum.FAILED],
  [ShipmentStatusEnum.IN_TRANSIT]: [ShipmentStatusEnum.DELIVERED, ShipmentStatusEnum.FAILED],
  [ShipmentStatusEnum.DELIVERED]: [],
  [ShipmentStatusEnum.FAILED]: [],
};

export class ShipmentStatus extends ValueObject<ShipmentStatusEnum> {
  private constructor(public readonly value: ShipmentStatusEnum) {
    super();
  }

  static create(value: ShipmentStatusEnum): ShipmentStatus {
    if (!Object.values(ShipmentStatusEnum).includes(value)) {
      throw new Error(`Invalid ShipmentStatus: ${value}`);
    }
    return new ShipmentStatus(value);
  }

  static created(): ShipmentStatus {
    return new ShipmentStatus(ShipmentStatusEnum.CREATED);
  }

  static inTransit(): ShipmentStatus {
    return new ShipmentStatus(ShipmentStatusEnum.IN_TRANSIT);
  }

  static delivered(): ShipmentStatus {
    return new ShipmentStatus(ShipmentStatusEnum.DELIVERED);
  }

  static failed(): ShipmentStatus {
    return new ShipmentStatus(ShipmentStatusEnum.FAILED);
  }

  canTransitionTo(nextStatus: ShipmentStatusEnum): boolean {
    const allowed = VALID_TRANSITIONS[this.value];
    return allowed.includes(nextStatus);
  }

  isTerminal(): boolean {
    return this.value === ShipmentStatusEnum.DELIVERED || this.value === ShipmentStatusEnum.FAILED;
  }

  equals(other: ValueObject<ShipmentStatusEnum>): boolean {
    return other instanceof ShipmentStatus && this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}