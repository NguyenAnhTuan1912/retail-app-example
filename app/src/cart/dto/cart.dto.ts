import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsUUID, IsInt, Min, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';

export class AddToCartDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() userId?: string;
  @ApiProperty() @IsUUID() productId: string;

  @ApiPropertyOptional({ default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number = 1;
}

export class UpdateCartItemDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() userId?: string;

  @ApiProperty()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  quantity: number;
}

export class RemoveCartItemDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() userId?: string;
}

export class GetCartDto {
  @ApiPropertyOptional() @IsOptional() @IsUUID() userId?: string;
}
