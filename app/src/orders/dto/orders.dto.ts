import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsDateString, IsNotEmpty, IsOptional, IsString, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListOrdersDto {
  @ApiProperty() @IsUUID() userId: string;

  @ApiPropertyOptional({ description: 'Default: đầu tháng hiện tại' })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiPropertyOptional({ description: 'Default: hiện tại' })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiPropertyOptional({ description: 'Tìm theo tên sản phẩm trong order' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID() cursor?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class CancelOrderDto {
  @ApiProperty({ description: 'Lý do huỷ đơn hàng' })
  @IsNotEmpty()
  @IsString()
  reason: string;
}

export class OrderItemResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() quantity: number;
  @ApiProperty() priceAtPurchase: string;
  @ApiProperty() product: { id: string; name: string; basePrice: string };
}

export class OrderDetailResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() buyerId: string;
  @ApiProperty() totalAmount: string;
  @ApiProperty() status: string;
  @ApiProperty() shippingAddress: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty({ type: [OrderItemResponseDto] }) items: OrderItemResponseDto[];
  @ApiPropertyOptional() cancellation: { reason: string; cancelledAt: Date } | null;
}

export class OrderSummaryResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() totalAmount: string;
  @ApiProperty() status: string;
  @ApiProperty() createdAt: Date;
}

export class PaginatedOrdersResponseDto {
  @ApiProperty({ type: [OrderSummaryResponseDto] }) data: OrderSummaryResponseDto[];
  @ApiPropertyOptional() nextCursor: string | null;
}
