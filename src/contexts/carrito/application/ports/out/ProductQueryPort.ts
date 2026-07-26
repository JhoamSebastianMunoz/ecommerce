export interface ProductInfo {
  id: string;
  price: number;
  stock: number;
  name: string;
}

export abstract class ProductQueryPort {
  abstract getProductById(productId: string): Promise<ProductInfo | null>;
  abstract getStock(productId: string): Promise<number>;
}
