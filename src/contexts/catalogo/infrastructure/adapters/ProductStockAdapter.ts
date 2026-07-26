import { Injectable, Logger } from '@nestjs/common';
import { ProductStockPort, StockReservationItem, StockReservationResult } from '../../../checkout/application/ports/out/ProductStockPort';
import { ProductRepository } from '../../application/ports/out/ProductRepository';

@Injectable()
export class ProductStockAdapter extends ProductStockPort {
  private readonly logger = new Logger(ProductStockAdapter.name);

  constructor(private readonly productRepository: ProductRepository) {
    super();
  }

  async reserveStock(
    items: StockReservationItem[],
    correlationId?: string,
  ): Promise<StockReservationResult> {
    try {
      const reservedItems: StockReservationItem[] = [];

      for (const item of items) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          return {
            success: false,
            reservedItems,
            error: `Product ${item.productId} not found`,
          };
        }

        if (product.stock.value < item.quantity) {
          return {
            success: false,
            reservedItems,
            error: `Insufficient stock for product ${item.productId}: available ${product.stock.value}, requested ${item.quantity}`,
          };
        }

        product.adjustStock(-item.quantity, `order-reservation-${correlationId ?? 'unknown'}`);
        await this.productRepository.save(product);
        reservedItems.push({ productId: item.productId, quantity: item.quantity });
      }

      return { success: true, reservedItems };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Stock reservation failed: ${message}`);
      return { success: false, reservedItems: [], error: message };
    }
  }

  async releaseStock(
    items: StockReservationItem[],
    correlationId?: string,
  ): Promise<void> {
    try {
      for (const item of items) {
        const product = await this.productRepository.findById(item.productId);
        if (!product) {
          this.logger.warn(`Product ${item.productId} not found for stock release`);
          continue;
        }

        product.adjustStock(item.quantity, `order-release-${correlationId ?? 'unknown'}`);
        await this.productRepository.save(product);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Stock release failed: ${message}`);
    }
  }
}
