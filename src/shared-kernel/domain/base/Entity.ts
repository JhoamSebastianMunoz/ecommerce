export abstract class Entity<T> {
  abstract equals(other: Entity<T>): boolean;
}
