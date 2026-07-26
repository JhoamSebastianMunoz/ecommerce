import { Return } from '../../../domain/aggregates/Return';
import { RequestReturnDto } from '../../dtos/return.dtos';
import { ReturnResponseDto } from '../../dtos/return.dtos';

export abstract class RequestReturnUseCase {
  abstract execute(dto: RequestReturnDto, correlationId?: string): Promise<Return>;
}

export abstract class ApproveReturnUseCase {
  abstract execute(returnId: string, refundAmount: number, correlationId?: string): Promise<Return>;
}

export abstract class RejectReturnUseCase {
  abstract execute(returnId: string, reason: string, correlationId?: string): Promise<Return>;
}

export abstract class ReceiveReturnUseCase {
  abstract execute(returnId: string, notes?: string, correlationId?: string): Promise<Return>;
}

export abstract class IssueRefundUseCase {
  abstract execute(returnId: string, correlationId?: string): Promise<Return>;
}

export abstract class GetReturnQuery {
  abstract execute(returnId: string): Promise<ReturnResponseDto>;
}
