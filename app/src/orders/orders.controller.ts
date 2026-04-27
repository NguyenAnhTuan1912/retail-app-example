import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CancelOrderDto, ListOrdersDto, OrderDetailResponseDto, PaginatedOrdersResponseDto } from './dto/orders.dto';

@ApiTags('Orders')
@ApiSecurity('X-API-Key')
@Controller('orders')
export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách đơn hàng theo user (cursor-based pagination, search theo tên sản phẩm)' })
  findAll(@Query() dto: ListOrdersDto): Promise<PaginatedOrdersResponseDto> {
    return this.ordersService.findAll(dto);
  }

  @Get(':orderId')
  @ApiOperation({ summary: 'Chi tiết đơn hàng' })
  findOne(@Param('orderId', ParseUUIDPipe) orderId: string): Promise<OrderDetailResponseDto> {
    return this.ordersService.findOne(orderId);
  }

  @Delete(':orderId')
  @ApiOperation({ summary: 'Huỷ đơn hàng (trong vòng 7 ngày)' })
  cancel(@Param('orderId', ParseUUIDPipe) orderId: string, @Body() dto: CancelOrderDto) {
    return this.ordersService.cancel(orderId, dto);
  }
}
