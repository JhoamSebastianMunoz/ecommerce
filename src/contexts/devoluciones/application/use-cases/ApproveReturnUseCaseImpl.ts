import { Injectable, NotFoundException } from '@nestjs/common';
import { ApproveReturnUseCase } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { Return } from '../../domain/aggregates/Return';

@Injectable()
export class ApproveReturnUseCaseImpl extends ApproveReturnUseCase {
  constructor(private readonly eventStore: ReturnEventStore) {
    super();
  }

  async execute(returnId: string, refundAmount: number, correlationId?: string): Promise<Return> {
    const ret = await this.eventStore.findById(returnId);
    if (!ret) {
      throw new NotFoundException(`Return with id ${returnId} not found`);
    }

    ret.approve(refundAmount, correlationId);
    await this.eventStore.save(ret);
    return ret;
  }
}
