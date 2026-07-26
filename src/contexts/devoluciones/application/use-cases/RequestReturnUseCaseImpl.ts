import { Injectable } from '@nestjs/common';
import { RequestReturnUseCase } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { Return } from '../../domain/aggregates/Return';
import { RequestReturnDto } from '../dtos/return.dtos';

@Injectable()
export class RequestReturnUseCaseImpl extends RequestReturnUseCase {
  constructor(private readonly eventStore: ReturnEventStore) {
    super();
  }

  async execute(dto: RequestReturnDto, correlationId?: string): Promise<Return> {
    const ret = Return.create({
      orderId: dto.orderId,
      reason: dto.reason,
      items: dto.items,
      correlationId,
    });

    await this.eventStore.save(ret);
    return ret;
  }
}
