export abstract class ValueObject<T> {
  abstract equals(other: ValueObject<T>): boolean;
  abstract toString(): string;
}
