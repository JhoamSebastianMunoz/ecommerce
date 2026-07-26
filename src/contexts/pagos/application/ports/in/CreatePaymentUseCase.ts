import { Payment } from '../../../domain/aggregates/Payment';
import { CreatePaymentDto } from '../../dtos/CreatePaymentDto';

export abstract class CreatePaymentUseCase {
  abstract execute(dto: CreatePaymentDto, correlationId?: string): Promise<Payment>;
}
