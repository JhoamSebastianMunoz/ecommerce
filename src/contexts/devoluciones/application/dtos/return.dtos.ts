export class RequestReturnDto {
  constructor(
    public readonly orderId: string,
    public readonly reason: string,
    public readonly items: Array<{ productId: string; quantity: number; unitPrice: number }>,
  ) {}
}

export class ApproveReturnDto {
  constructor(
    public readonly returnId: string,
    public readonly refundAmount: number,
  ) {}
}

export class RejectReturnDto {
  constructor(
    public readonly returnId: string,
    public readonly reason: string,
  ) {}
}

export class ReceiveReturnDto {
  constructor(
    public readonly returnId: string,
    public readonly notes?: string,
  ) {}
}

export class IssueRefundDto {
  constructor(
    public readonly returnId: string,
  ) {}
}

export class ReturnResponseDto {
  constructor(
    public readonly id: string,
    public readonly orderId: string,
    public readonly status: string,
    public readonly reason: string,
    public readonly refundAmount: number | null,
    public readonly refundTransactionId: string | null,
    public readonly notes: string | null,
    public readonly items: Array<{ productId: string; quantity: number; unitPrice: number }>,
    public readonly createdAt: string,
    public readonly updatedAt: string,
  ) {}
}
