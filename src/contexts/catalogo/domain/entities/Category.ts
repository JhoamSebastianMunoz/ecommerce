import { Entity } from '../../../../shared-kernel/domain/base/Entity';

export interface CategoryProps {
  id: string;
  name: string;
  slug: string;
  parentId?: string | null;
}

export class Category implements Entity<string> {
  private constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly slug: string,
    public readonly parentId: string | null,
  ) {}

  static create(props: CategoryProps): Category {
    if (!props.name?.trim()) throw new Error('Category name is required');
    if (!props.slug?.trim()) throw new Error('Category slug is required');
    return new Category(props.id, props.name.trim(), props.slug.trim(), props.parentId ?? null);
  }

  equals(other: Entity<string>): boolean {
    return other instanceof Category && this.id === other.id;
  }
}
