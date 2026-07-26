import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional, Min, IsUUID, IsNotEmpty } from 'class-validator';

export class CreateProductRequestDto {
  @ApiProperty({ example: 'LPT-GAMER-01', description: 'Stock Keeping Unit (unique)' })
  @IsString()
  @IsNotEmpty()
  sku!: string;

  @ApiProperty({ example: 'Laptop Gamer Pro 15', description: 'Product name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiPropertyOptional({ example: 'Laptop de alto rendimiento con 32GB RAM', description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string | null;

  @ApiProperty({ example: 1499.99, description: 'Product price' })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiProperty({ example: 10, description: 'Initial stock quantity' })
  @IsNumber()
  @Min(0)
  stock!: number;

  @ApiPropertyOptional({ example: 5, description: 'Low stock threshold for warnings' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  lowStockThreshold?: number;

  @ApiPropertyOptional({ example: 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', description: 'Category UUID' })
  @IsOptional()
  @IsUUID()
  categoryId?: string | null;

  @ApiPropertyOptional({ example: 'Tecnología', description: 'Category name' })
  @IsOptional()
  @IsString()
  categoryName?: string | null;
}
