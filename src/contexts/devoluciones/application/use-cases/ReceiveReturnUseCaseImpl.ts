import { Injectable, NotFoundException } from '@nestjs/common';
import { ReceiveReturnUseCase } from '../ports/in/return.ports.in';
import { ReturnEventStore } from '../ports/out/ReturnEventStore';
import { Return } from '../../domain/aggregates/Return';

@Injectable()
export class ReceiveReturnUseCaseImpl extends ReceiveReturnUseCase {
  constructor(private readonly eventStore: ReturnEventStore) {
    super();
  }

  async execute(returnId: string, notes?: string, correlationId?: string): Promise<Return> {
    const ret = await this.eventStore.findById(returnId);
    if (!ret) {
      throw new NotFoundException(`Return with id ${returnId} not found`);
    }

    ret.receive(notes ?? null, correlationId);
    await this.eventStore.save(ret);
    return ret;
  }
}
