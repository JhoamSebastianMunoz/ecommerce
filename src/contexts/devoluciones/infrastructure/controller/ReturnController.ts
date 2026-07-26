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
import { RequestReturnUseCase } from '../../application/ports/in/return.ports.in';
import { ApproveReturnUseCase } from '../../application/ports/in/return.ports.in';
import { RejectReturnUseCase } from '../../application/ports/in/return.ports.in';
import { ReceiveReturnUseCase } from '../../application/ports/in/return.ports.in';
import { IssueRefundUseCase } from '../../application/ports/in/return.ports.in';
import { GetReturnQuery } from '../../application/ports/in/return.ports.in';
import {
  RequestReturnRequestDto,
  ApproveReturnRequestDto,
  RejectReturnRequestDto,
  ReceiveReturnRequestDto,
  ReturnResponseDto,
} from '../dtos/return.dtos';
import { RequestReturnDto } from '../../application/dtos/return.dtos';
import { DEVOLUCIONES_ROUTES } from './routes.constants';

@ApiTags('Devoluciones')
@Controller()
export class ReturnController {
  constructor(
    private readonly requestReturnUseCase: RequestReturnUseCase,
    private readonly approveReturnUseCase: ApproveReturnUseCase,
    private readonly rejectReturnUseCase: RejectReturnUseCase,
    private readonly receiveReturnUseCase: ReceiveReturnUseCase,
    private readonly issueRefundUseCase: IssueRefundUseCase,
    private readonly getReturnQuery: GetReturnQuery,
  ) {}

  @Post(DEVOLUCIONES_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Request a new return' })
  @ApiResponse({
    status: 201,
    description: 'Return requested',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async requestReturn(
    @Body() dto: RequestReturnRequestDto,
  ): Promise<ReturnResponseDto> {
    const ret = await this.requestReturnUseCase.execute(
      new RequestReturnDto(dto.orderId, dto.reason, dto.items),
    );
    return this.toResponseDto(ret);
  }

  @Get(DEVOLUCIONES_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get return by ID' })
  @ApiParam({ name: 'id', description: 'Return UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return found',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Return not found' })
  async getReturn(@Param('id') id: string): Promise<ReturnResponseDto> {
    return this.getReturnQuery.execute(id);
  }

  @Post(DEVOLUCIONES_ROUTES.APPROVE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Approve a return request' })
  @ApiParam({ name: 'id', description: 'Return UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return approved',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async approveReturn(
    @Param('id') id: string,
    @Body() dto: ApproveReturnRequestDto,
  ): Promise<ReturnResponseDto> {
    const ret = await this.approveReturnUseCase.execute(id, dto.refundAmount);
    return this.toResponseDto(ret);
  }

  @Post(DEVOLUCIONES_ROUTES.REJECT)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Reject a return request' })
  @ApiParam({ name: 'id', description: 'Return UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return rejected',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async rejectReturn(
    @Param('id') id: string,
    @Body() dto: RejectReturnRequestDto,
  ): Promise<ReturnResponseDto> {
    const ret = await this.rejectReturnUseCase.execute(id, dto.reason);
    return this.toResponseDto(ret);
  }

  @Post(DEVOLUCIONES_ROUTES.RECEIVE)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Mark return as received' })
  @ApiParam({ name: 'id', description: 'Return UUID' })
  @ApiResponse({
    status: 200,
    description: 'Return received',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async receiveReturn(
    @Param('id') id: string,
    @Body() dto: ReceiveReturnRequestDto,
  ): Promise<ReturnResponseDto> {
    const ret = await this.receiveReturnUseCase.execute(id, dto.notes);
    return this.toResponseDto(ret);
  }

  @Post(DEVOLUCIONES_ROUTES.ISSUE_REFUND)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Issue refund for a received return' })
  @ApiParam({ name: 'id', description: 'Return UUID' })
  @ApiResponse({
    status: 200,
    description: 'Refund issued',
    type: ReturnResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Return not found' })
  @ApiResponse({ status: 409, description: 'Invalid state transition' })
  async issueRefund(@Param('id') id: string): Promise<ReturnResponseDto> {
    const ret = await this.issueRefundUseCase.execute(id);
    return this.toResponseDto(ret);
  }

  private toResponseDto(ret: any): ReturnResponseDto {
    return {
      id: ret.id.toString(),
      orderId: ret.orderId,
      status: ret.status?.toString() ?? 'UNKNOWN',
      reason: ret.reason,
      refundAmount: ret.refundAmount ?? null,
      refundTransactionId: ret.refundTransactionId ?? null,
      notes: ret.notes ?? null,
      items: ret.items ?? [],
      createdAt: ret.createdAt.toISOString(),
      updatedAt: ret.updatedAt.toISOString(),
    };
  }
}
