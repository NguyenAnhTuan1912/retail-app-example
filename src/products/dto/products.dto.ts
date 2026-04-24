import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListProductsDto {
  @ApiPropertyOptional({ description: 'Cursor (product ID) for pagination' })
  @IsOptional()
  @IsUUID()
  cursor?: string;

  @ApiPropertyOptional({ default: 20, minimum: 1, maximum: 100 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ProductBasicResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() basePrice: string;
  @ApiProperty() ratingAvg: string;
  @ApiProperty() stockQuantity: number;
  @ApiPropertyOptional() mainImageUrl: string | null;
}

export class ProductDetailResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() name: string;
  @ApiProperty() description: string | null;
  @ApiProperty() basePrice: string;
  @ApiProperty() stockQuantity: number;
  @ApiProperty() ratingAvg: string;
  @ApiProperty() createdAt: Date;
  @ApiProperty() updatedAt: Date;
  @ApiProperty() category: { id: number; name: string; slug: string } | null;
  @ApiProperty() seller: { id: string; username: string; fullName: string | null };
  @ApiProperty({ type: [Object] }) images: { id: string; url: string; isMain: boolean }[];
}

export class PaginatedProductsResponseDto {
  @ApiProperty({ type: [ProductBasicResponseDto] }) data: ProductBasicResponseDto[];
  @ApiPropertyOptional() nextCursor: string | null;
}
