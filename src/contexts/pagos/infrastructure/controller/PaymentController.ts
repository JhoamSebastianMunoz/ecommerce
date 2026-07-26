import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreatePaymentUseCase } from '../../application/ports/in/CreatePaymentUseCase';
import { AuthorizePaymentUseCase } from '../../application/ports/in/AuthorizePaymentUseCase';
import { CapturePaymentUseCase } from '../../application/ports/in/CapturePaymentUseCase';
import { RefundPaymentUseCase } from '../../application/ports/in/RefundPaymentUseCase';
import { GetPaymentQuery } from '../../application/ports/in/GetPaymentQuery';
import { CreatePaymentRequestDto } from '../dtos/CreatePaymentRequestDto';
import { PaymentResponseDto } from '../dtos/PaymentResponseDto';
import { CreatePaymentDto } from '../../application/dtos/CreatePaymentDto';
import { PAGOS_ROUTES } from './routes.constants';

@ApiTags('Pagos')
@Controller()
export class PaymentController {
  constructor(
    private readonly createPaymentUseCase: CreatePaymentUseCase,
    private readonly authorizePaymentUseCase: AuthorizePaymentUseCase,
    private readonly capturePaymentUseCase: CapturePaymentUseCase,
    private readonly refundPaymentUseCase: RefundPaymentUseCase,
    private readonly getPaymentQuery: GetPaymentQuery,
  ) {}

  @Post(PAGOS_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create (initiate) a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment initiated',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Duplicate idempotency key' })
  async createPayment(
    @Body() dto: CreatePaymentRequestDto,
  ): Promise<PaymentResponseDto> {
    const payment = await this.createPaymentUseCase.execute(
      new CreatePaymentDto(
        dto.orderId,
        dto.amount,
        dto.paymentMethod,
        dto.idempotencyKey,
      ),
    );
    return this.toResponseDto(payment);
  }

  @Get(PAGOS_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Payment found',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  async getPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    return this.getPaymentQuery.execute(id);
  }

  @Post(PAGOS_ROUTES.AUTHORIZE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authorize a payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Payment authorized',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async authorizePayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.authorizePaymentUseCase.execute(id);
    return this.toResponseDto(payment);
  }

  @Post(PAGOS_ROUTES.CAPTURE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Capture a payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Payment captured',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async capturePayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.capturePaymentUseCase.execute(id);
    return this.toResponseDto(payment);
  }

  @Post(PAGOS_ROUTES.REFUND)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Refund a payment' })
  @ApiParam({ name: 'id', description: 'Payment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Payment refunded',
    type: PaymentResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Payment not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async refundPayment(@Param('id') id: string): Promise<PaymentResponseDto> {
    const payment = await this.refundPaymentUseCase.execute(id);
    return this.toResponseDto(payment);
  }

  private toResponseDto(payment: any): PaymentResponseDto {
    return {
      id: payment.id.toString(),
      orderId: payment.orderId,
      status: payment.status?.toString() ?? 'UNKNOWN',
      amount: payment.amount,
      paymentMethod: payment.paymentMethod?.toString() ?? 'UNKNOWN',
      transactionId: payment.transactionId?.toString() ?? null,
      idempotencyKey: payment.idempotencyKey ?? null,
      failureReason: payment.failureReason ?? null,
      createdAt: payment.createdAt.toISOString(),
      updatedAt: payment.updatedAt.toISOString(),
    };
  }
}
