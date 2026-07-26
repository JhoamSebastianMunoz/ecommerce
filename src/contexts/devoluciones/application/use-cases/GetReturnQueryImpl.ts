import { Injectable, NotFoundException } from '@nestjs/common';
import { GetReturnQuery } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { ReturnResponseDto } from '../dtos/return.dtos';

@Injectable()
export class GetReturnQueryImpl extends GetReturnQuery {
  constructor(private readonly eventStore: ReturnEventStore) {
    super();
  }

  async execute(returnId: string): Promise<ReturnResponseDto> {
    const ret = await this.eventStore.findById(returnId);
    if (!ret) {
      throw new NotFoundException(`Return with id ${returnId} not found`);
    }

    return new ReturnResponseDto(
      ret.id.toString(),
      ret.orderId,
      ret.status?.toString() ?? 'UNKNOWN',
      ret.reason,
      ret.refundAmount,
      ret.refundTransactionId,
      ret.notes,
      ret.items,
      ret.createdAt.toISOString(),
      ret.updatedAt.toISOString(),
    );
  }
}
