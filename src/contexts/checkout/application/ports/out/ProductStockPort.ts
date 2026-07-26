export interface StockReservationItem {
  productId: string;
  quantity: number;
}

export interface StockReservationResult {
  success: boolean;
  reservedItems: StockReservationItem[];
  error?: string;
}

export abstract class ProductStockPort {
  abstract reserveStock(
    items: StockReservationItem[],
    correlationId?: string,
  ): Promise<StockReservationResult>;
  abstract releaseStock(
    items: StockReservationItem[],
    correlationId?: string,
  ): Promise<void>;
}
