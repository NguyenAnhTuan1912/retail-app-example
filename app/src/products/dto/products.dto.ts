import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt, Min, Max, IsString, IsNumber } from 'class-validator';
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

  @ApiPropertyOptional({ description: 'Search by product name (full text search)' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional({ description: 'Minimum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceFrom?: number;

  @ApiPropertyOptional({ description: 'Maximum price' })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  priceTo?: number;
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
  @ApiProperty() reviewCount: number;
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
