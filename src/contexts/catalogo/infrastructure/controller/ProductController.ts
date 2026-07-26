import {
  Controller,
  Get,
  Post,
  Put,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Product } from '../../domain/aggregates/Product';
import { CreateProductUseCase } from '../../application/ports/in/CreateProductUseCase';
import { UpdateProductUseCase } from '../../application/ports/in/UpdateProductUseCase';
import { AdjustStockUseCase } from '../../application/ports/in/AdjustStockUseCase';
import { DeleteProductUseCase } from '../../application/ports/in/DeleteProductUseCase';
import { GetProductQuery } from '../../application/ports/in/GetProductQuery';
import { ListProductsQuery } from '../../application/ports/in/ListProductsQuery';
import { CreateProductRequestDto } from '../dtos/CreateProductRequestDto';
import { UpdateProductRequestDto } from '../dtos/UpdateProductRequestDto';
import { AdjustStockRequestDto } from '../dtos/AdjustStockRequestDto';
import {
  ProductResponseDto,
  PaginatedProductResponseDto,
} from '../dtos/ProductResponseDto';
import { CreateProductDto } from '../../application/dtos/CreateProductDto';
import { UpdateProductDto } from '../../application/dtos/UpdateProductDto';
import { AdjustStockDto } from '../../application/dtos/AdjustStockDto';
import { ProductFiltersDto } from '../../application/dtos/ProductFiltersDto';
import { CATALOGO_ROUTES } from './routes.constants';

@ApiTags('Catálogo')
@Controller()
export class ProductController {
  constructor(
    private readonly createProductUseCase: CreateProductUseCase,
    private readonly updateProductUseCase: UpdateProductUseCase,
    private readonly adjustStockUseCase: AdjustStockUseCase,
    private readonly getProductQuery: GetProductQuery,
    private readonly listProductsQuery: ListProductsQuery,
    private readonly deleteProductUseCase: DeleteProductUseCase,
  ) {}

  @Post(CATALOGO_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({ status: 201, description: 'Product created successfully', type: ProductResponseDto })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Product with SKU already exists' })
  async create(@Body() dto: CreateProductRequestDto): Promise<ProductResponseDto> {
    const product = await this.createProductUseCase.execute(
      new CreateProductDto(
        dto.sku,
        dto.name,
        dto.description ?? null,
        dto.price,
        dto.stock,
        dto.lowStockThreshold ?? 5,
        dto.categoryId ?? null,
        dto.categoryName ?? null,
      ),
    );
    return new ProductResponseDto({
      id: product.id.toString(),
      sku: product.sku.toString(),
      name: product.name,
      description: product.description,
      price: product.price.amount,
      stock: product.stock.value,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status.toString(),
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  @Get(CATALOGO_ROUTES.BASE)
  @ApiOperation({ summary: 'List products with optional filters' })
  @ApiQuery({ name: 'page', required: false, example: 1 })
  @ApiQuery({ name: 'limit', required: false, example: 10 })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['ACTIVE', 'INACTIVE', 'DISCONTINUED'] })
  @ApiQuery({ name: 'search', required: false, description: 'Search by name or SKU' })
  @ApiResponse({ status: 200, description: 'Paginated list of products', type: PaginatedProductResponseDto })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ): Promise<PaginatedProductResponseDto> {
    const result = await this.listProductsQuery.execute(
      new ProductFiltersDto(
        Number(page) || 1,
        Math.min(Number(limit) || 10, 100),
        categoryId,
        status,
        search,
      ),
    );
    return {
      data: result.data.map((p: Product) => new ProductResponseDto({
        id: p.id.toString(),
        sku: p.sku.toString(),
        name: p.name,
        description: p.description,
        price: p.price.amount,
        stock: p.stock.value,
        lowStockThreshold: p.lowStockThreshold,
        status: p.status.toString(),
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
      })),
      total: result.total,
      page: result.page,
      limit: result.limit,
    };
  }

  @Get(CATALOGO_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get a product by ID' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product found', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findById(@Param('id') id: string): Promise<ProductResponseDto> {
    const product = await this.getProductQuery.execute(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    return new ProductResponseDto({
      id: product.id.toString(),
      sku: product.sku.toString(),
      name: product.name,
      description: product.description,
      price: product.price.amount,
      stock: product.stock.value,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status.toString(),
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  @Put(CATALOGO_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Update a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Product updated', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.updateProductUseCase.execute(
      id,
      new UpdateProductDto(
        dto.name,
        dto.description,
        dto.price,
        dto.lowStockThreshold,
        dto.categoryId,
        dto.categoryName,
      ),
    );
    return new ProductResponseDto({
      id: product.id.toString(),
      sku: product.sku.toString(),
      name: product.name,
      description: product.description,
      price: product.price.amount,
      stock: product.stock.value,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status.toString(),
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  @Patch(CATALOGO_ROUTES.STOCK)
  @ApiOperation({ summary: 'Adjust product stock' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 200, description: 'Stock adjusted', type: ProductResponseDto })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Insufficient stock or invalid request' })
  async adjustStock(
    @Param('id') id: string,
    @Body() dto: AdjustStockRequestDto,
  ): Promise<ProductResponseDto> {
    const product = await this.adjustStockUseCase.execute(
      id,
      new AdjustStockDto(dto.quantity, dto.reason),
    );
    return new ProductResponseDto({
      id: product.id.toString(),
      sku: product.sku.toString(),
      name: product.name,
      description: product.description,
      price: product.price.amount,
      stock: product.stock.value,
      lowStockThreshold: product.lowStockThreshold,
      status: product.status.toString(),
      categoryId: product.categoryId,
      categoryName: product.categoryName,
      createdAt: product.createdAt,
      updatedAt: product.updatedAt,
    });
  }

  @Delete(CATALOGO_ROUTES.BY_ID)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a product' })
  @ApiParam({ name: 'id', description: 'Product UUID' })
  @ApiResponse({ status: 204, description: 'Product deleted' })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.deleteProductUseCase.execute(id);
  }
}
