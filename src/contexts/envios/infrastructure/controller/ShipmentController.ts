import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  HttpCode,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CreateShipmentUseCase } from '../../application/ports/in/shipment.ports.in';
import { GetShipmentQuery } from '../../application/ports/in/shipment.ports.in';
import { ListShipmentsQuery } from '../../application/ports/in/shipment.ports.in';
import { UpdateTrackingStatusUseCase } from '../../application/ports/in/shipment.ports.in';
import {
  CreateShipmentRequestDto,
  UpdateTrackingStatusRequestDto,
  ShipmentResponseDto as ShipmentHttpResponseDto,
} from '../dtos/shipment.dtos';
import { CreateShipmentDto } from '../../application/dtos/shipment.dtos';
import { ShipmentResponseDto as ShipmentAppResponseDto } from '../../application/dtos/shipment.dtos';
import { ENVIOS_ROUTES } from './routes.constants';

@ApiTags('Envíos')
@Controller()
export class ShipmentController {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly getShipmentQuery: GetShipmentQuery,
    private readonly listShipmentsQuery: ListShipmentsQuery,
    private readonly updateTrackingStatusUseCase: UpdateTrackingStatusUseCase,
  ) {}

  @Post(ENVIOS_ROUTES.BASE)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new shipment' })
  @ApiResponse({
    status: 201,
    description: 'Shipment created',
    type: ShipmentHttpResponseDto,
  })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 409, description: 'Shipment for order already exists' })
  async create(@Body() dto: CreateShipmentRequestDto): Promise<ShipmentHttpResponseDto> {
    const result = await this.createShipmentUseCase.execute({
      orderId: dto.orderId,
      trackingNumber: dto.trackingNumber,
      address: {
        street: dto.street,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        country: dto.country,
      },
    });
    return this.toHttpResponse(result);
  }

  @Get(ENVIOS_ROUTES.BASE)
  @ApiOperation({ summary: 'List all shipments' })
  @ApiResponse({
    status: 200,
    description: 'List of shipments',
    type: [ShipmentHttpResponseDto],
  })
  async list(): Promise<ShipmentHttpResponseDto[]> {
    const shipments = await this.listShipmentsQuery.execute();
    return shipments.map((s) => this.toHttpResponse(s));
  }

  @Get(ENVIOS_ROUTES.BY_ID)
  @ApiOperation({ summary: 'Get shipment by ID' })
  @ApiParam({ name: 'id', description: 'Shipment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Shipment found',
    type: ShipmentHttpResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  async getById(@Param('id') id: string): Promise<ShipmentHttpResponseDto> {
    const shipment = await this.getShipmentQuery.execute(id);
    if (!shipment) {
      throw new NotFoundException(`Shipment ${id} not found`);
    }
    return this.toHttpResponse(shipment);
  }

  @Patch(ENVIOS_ROUTES.STATUS)
  @ApiOperation({ summary: 'Update tracking status' })
  @ApiParam({ name: 'id', description: 'Shipment UUID' })
  @ApiResponse({
    status: 200,
    description: 'Status updated',
    type: ShipmentHttpResponseDto,
  })
  @ApiResponse({ status: 404, description: 'Shipment not found' })
  @ApiResponse({ status: 400, description: 'Invalid status transition' })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTrackingStatusRequestDto,
  ): Promise<ShipmentHttpResponseDto> {
    const result = await this.updateTrackingStatusUseCase.execute(id, {
      status: dto.status as 'IN_TRANSIT' | 'DELIVERED' | 'FAILED',
      reason: dto.reason,
    });
    return this.toHttpResponse(result);
  }

  private toHttpResponse(appDto: ShipmentAppResponseDto): ShipmentHttpResponseDto {
    return {
      id: appDto.id,
      orderId: appDto.orderId,
      trackingNumber: appDto.trackingNumber,
      address: {
        street: appDto.address.street,
        city: appDto.address.city,
        state: appDto.address.state,
        postalCode: appDto.address.postalCode,
        country: appDto.address.country,
      },
      status: appDto.status,
      createdAt: appDto.createdAt,
      updatedAt: appDto.updatedAt,
      shippedAt: appDto.shippedAt,
      deliveredAt: appDto.deliveredAt,
    };
  }
}