import { Injectable, Logger } from '@nestjs/common';
import { OrderRepository } from '../ports/out/OrderRepository';
import { ProductStockPort } from '../ports/out/ProductStockPort';
import { PaymentPort } from '../ports/out/PaymentPort';
import { ShipmentPort } from '../ports/out/ShipmentPort';

@Injectable()
export class CheckoutSaga {
  private readonly logger = new Logger(CheckoutSaga.name);
  private paymentTransactionId: string | undefined;

  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly productStockPort: ProductStockPort,
    private readonly paymentPort: PaymentPort,
    private readonly shipmentPort: ShipmentPort,
  ) {}

  async execute(orderId: string, correlationId?: string): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new Error(`Order ${orderId} not found`);
    }

    this.paymentTransactionId = undefined;

    try {
      await this.stepReserveStock(order, correlationId);
      await this.stepProcessPayment(order, correlationId);
      await this.stepCreateShipment(order, correlationId);
      this.logger.log(`Saga completed successfully for order ${orderId}`);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Saga failed for order ${orderId}: ${message}`);
      order.fail(message, 'CheckoutSaga', correlationId);
      await this.orderRepository.save(order);
    }
  }

  private async stepReserveStock(
    order: any,
    correlationId?: string,
  ): Promise<void> {
    const items = order.items.map((i: any) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));

    const result = await this.productStockPort.reserveStock(items, correlationId);
    if (!result.success) {
      throw new Error(`Stock reservation failed: ${result.error}`);
    }

    order.markStockReserved(result.reservedItems, correlationId);
    await this.orderRepository.save(order);
    this.logger.log(`Stock reserved for order ${order.id}`);
  }

  private async stepProcessPayment(
    order: any,
    correlationId?: string,
  ): Promise<void> {
    order.markPaymentPending(correlationId);
    await this.orderRepository.save(order);

    const result = await this.paymentPort.processPayment(
      order.id.toString(),
      order.totalAmount.amount,
      order.idempotencyKey,
      correlationId,
    );

    if (!result.success) {
      await this.compensateStock(order, correlationId);
      throw new Error(`Payment failed: ${result.error}`);
    }

    this.paymentTransactionId = result.transactionId;
    this.logger.log(`Payment processed for order ${order.id}`);
  }

  private async stepCreateShipment(
    order: any,
    correlationId?: string,
  ): Promise<void> {
    const items = order.items.map((i: any) => ({
      productId: i.productId,
      quantity: i.quantity,
    }));

    const result = await this.shipmentPort.createShipment(
      order.id.toString(),
      items,
      { street: order.shippingAddress.street, city: order.shippingAddress.city },
      correlationId,
    );

    if (!result.success) {
      await this.compensateStock(order, correlationId);
      throw new Error(`Shipment creation failed: ${result.error}`);
    }

    order.confirm(
      this.paymentTransactionId ?? 'unknown',
      result.shipmentId!,
      correlationId,
    );
    await this.orderRepository.save(order);
    this.logger.log(`Shipment created for order ${order.id}`);
  }

  private async compensateStock(
    order: any,
    correlationId?: string,
  ): Promise<void> {
    try {
      const items = order.items.map((i: any) => ({
        productId: i.productId,
        quantity: i.quantity,
      }));
      await this.productStockPort.releaseStock(items, correlationId);
      this.logger.log(`Stock released for order ${order.id}`);
    } catch (error) {
      this.logger.error(`Failed to release stock for order ${order.id}`);
    }
  }
}
