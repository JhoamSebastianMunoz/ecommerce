import { PaymentResponseDto } from '../../dtos/PaymentResponseDto';

export abstract class GetPaymentQuery {
  abstract execute(paymentId: string): Promise<PaymentResponseDto>;
}
