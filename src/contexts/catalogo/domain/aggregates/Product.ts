import { AggregateRoot } from '../../../../shared-kernel/domain/base/AggregateRoot';
import { ProductId } from '../value-objects/ProductId';
import { SKU } from '../value-objects/SKU';
import { Money } from '../value-objects/Money';
import { StockQuantity } from '../value-objects/StockQuantity';
import { ProductStatus } from '../value-objects/ProductStatus';
import { ProductCreatedEvent } from '../events/ProductCreatedEvent';
import { StockAdjustedEvent } from '../events/StockAdjustedEvent';
import { StockLowWarningEvent } from '../events/StockLowWarningEvent';

export interface ProductProps {
  id: ProductId;
  sku: SKU;
  name: string;
  description?: string | null;
  price: Money;
  stock: StockQuantity;
  lowStockThreshold: number;
  status: ProductStatus;
  categoryId: string | null;
  categoryName?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Product extends AggregateRoot<string> {
  private constructor(
    public readonly id: ProductId,
    public readonly sku: SKU,
    private _name: string,
    private _description: string | null,
    private _price: Money,
    private _stock: StockQuantity,
    private _lowStockThreshold: number,
    private _status: ProductStatus,
    private _categoryId: string | null,
    private _categoryName: string | null,
    private _createdAt: Date,
    private _updatedAt: Date,
  ) {
    super();
  }

  get name(): string { return this._name; }
  get description(): string | null { return this._description; }
  get price(): Money { return this._price; }
  get stock(): StockQuantity { return this._stock; }
  get lowStockThreshold(): number { return this._lowStockThreshold; }
  get status(): ProductStatus { return this._status; }
  get categoryId(): string | null { return this._categoryId; }
  get categoryName(): string | null { return this._categoryName; }
  get createdAt(): Date { return this._createdAt; }
  get updatedAt(): Date { return this._updatedAt; }

  static create(props: Omit<ProductProps, 'createdAt' | 'updatedAt' | 'status'>): Product {
    const now = new Date();
    const product = new Product(
      props.id,
      props.sku,
      props.name,
      props.description ?? null,
      props.price,
      props.stock,
      props.lowStockThreshold,
      ProductStatus.ACTIVE,
      props.categoryId,
      props.categoryName ?? null,
      now,
      now,
    );

    product.addDomainEvent(
      new ProductCreatedEvent(
        props.id.toString(),
        props.sku.toString(),
        props.name,
        props.price.amount,
      ),
    );

    return product;
  }

  static reconstitute(props: ProductProps): Product {
    return new Product(
      props.id,
      props.sku,
      props.name,
      props.description ?? null,
      props.price,
      props.stock,
      props.lowStockThreshold,
      props.status,
      props.categoryId,
      props.categoryName ?? null,
      props.createdAt,
      props.updatedAt,
    );
  }

  updateDetails(details: {
    name?: string;
    description?: string | null;
    price?: Money;
    lowStockThreshold?: number;
    categoryId?: string | null;
    categoryName?: string | null;
  }): void {
    if (details.name !== undefined) {
      if (!details.name.trim()) throw new Error('Product name cannot be empty');
      this._name = details.name.trim();
    }
    if (details.description !== undefined) {
      this._description = details.description;
    }
    if (details.price !== undefined) {
      this._price = details.price;
    }
    if (details.lowStockThreshold !== undefined) {
      if (details.lowStockThreshold < 0) throw new Error('Low stock threshold cannot be negative');
      this._lowStockThreshold = details.lowStockThreshold;
    }
    if (details.categoryId !== undefined) {
      this._categoryId = details.categoryId;
    }
    if (details.categoryName !== undefined) {
      this._categoryName = details.categoryName;
    }
    this._updatedAt = new Date();
  }

  adjustStock(quantity: number, reason: string): void {
    const previousStock = this._stock;
    if (quantity >= 0) {
      this._stock = this._stock.increment(quantity);
    } else {
      this._stock = this._stock.decrement(Math.abs(quantity));
    }
    this._updatedAt = new Date();

    this.addDomainEvent(
      new StockAdjustedEvent(
        this.id.toString(),
        previousStock.value,
        this._stock.value,
        reason,
      ),
    );

    if (this._stock.isLowStock(this._lowStockThreshold)) {
      this.addDomainEvent(
        new StockLowWarningEvent(
          this.id.toString(),
          this.sku.toString(),
          this._stock.value,
          this._lowStockThreshold,
        ),
      );
    }
  }

  markAsActive(): void {
    this._status = ProductStatus.ACTIVE;
    this._updatedAt = new Date();
  }

  markAsInactive(): void {
    this._status = ProductStatus.INACTIVE;
    this._updatedAt = new Date();
  }

  markAsDiscontinued(): void {
    this._status = ProductStatus.DISCONTINUED;
    this._updatedAt = new Date();
  }

  equals(other: AggregateRoot<string>): boolean {
    return other instanceof Product && this.id.equals(other.id);
  }
}
