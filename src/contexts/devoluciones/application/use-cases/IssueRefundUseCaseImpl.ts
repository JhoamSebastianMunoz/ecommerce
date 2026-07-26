import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { IssueRefundUseCase } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { RefundPaymentPort } from '../ports/out/RefundPaymentPort';
import { Return } from '../../domain/aggregates/Return';

@Injectable()
export class IssueRefundUseCaseImpl extends IssueRefundUseCase {
  private readonly logger = new Logger(IssueRefundUseCaseImpl.name);

  constructor(
    private readonly eventStore: ReturnEventStore,
    private readonly refundPaymentPort: RefundPaymentPort,
  ) {
    super();
  }

  async execute(returnId: string, correlationId?: string): Promise<Return> {
    const ret = await this.eventStore.findById(returnId);
    if (!ret) {
      throw new NotFoundException(`Return with id ${returnId} not found`);
    }

    const refundAmount = ret.refundAmount;
    if (refundAmount === null) {
      throw new Error('Cannot issue refund without approved refund amount');
    }

    const result = await this.refundPaymentPort.refundByOrderId(
      ret.orderId,
      refundAmount,
      correlationId,
    );

    if (!result.success) {
      throw new Error(`Refund failed: ${result.error ?? 'Unknown error'}`);
    }

    ret.issueRefund(result.transactionId ?? `refund-${Date.now()}`, correlationId);
    await this.eventStore.save(ret);
    return ret;
  }
}
