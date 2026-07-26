import { Injectable, NotFoundException } from '@nestjs/common';
import { RejectReturnUseCase } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { Return } from '../../domain/aggregates/Return';

@Injectable()
export class RejectReturnUseCaseImpl extends RejectReturnUseCase {
  constructor(private readonly eventStore: ReturnEventStore) {
    super();
  }

  async execute(returnId: string, reason: string, correlationId?: string): Promise<Return> {
    const ret = await this.eventStore.findById(returnId);
    if (!ret) {
      throw new NotFoundException(`Return with id ${returnId} not found`);
    }

    ret.reject(reason, correlationId);
    await this.eventStore.save(ret);
    return ret;
  }
}
