import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ProductResponseDto {
  @ApiProperty({ example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479' })
  id: string;

  @ApiProperty({ example: 'LPT-GAMER-01' })
  sku: string;

  @ApiProperty({ example: 'Laptop Gamer Pro 15' })
  name: string;

  @ApiPropertyOptional({ example: 'Laptop de alto rendimiento' })
  description: string | null;

  @ApiProperty({ example: 1499.99 })
  price: number;

  @ApiProperty({ example: 10 })
  stock: number;

  @ApiProperty({ example: 5 })
  lowStockThreshold: number;

  @ApiProperty({ example: 'ACTIVE' })
  status: string;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' })
  categoryId: string | null;

  @ApiPropertyOptional({ example: 'Tecnología' })
  categoryName: string | null;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  createdAt: string;

  @ApiProperty({ example: '2026-07-26T00:00:00.000Z' })
  updatedAt: string;

  constructor(product: {
    id: string;
    sku: string;
    name: string;
    description: string | null;
    price: number;
    stock: number;
    lowStockThreshold: number;
    status: string;
    categoryId: string | null;
    categoryName: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    this.id = product.id;
    this.sku = product.sku;
    this.name = product.name;
    this.description = product.description;
    this.price = product.price;
    this.stock = product.stock;
    this.lowStockThreshold = product.lowStockThreshold;
    this.status = product.status;
    this.categoryId = product.categoryId;
    this.categoryName = product.categoryName;
    this.createdAt = product.createdAt.toISOString();
    this.updatedAt = product.updatedAt.toISOString();
  }
}

export class PaginatedProductResponseDto {
  @ApiProperty({ type: [ProductResponseDto] })
  data!: ProductResponseDto[];

  @ApiProperty({ example: 1 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}
