import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsUUID, IsInt, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';

export class ListReviewsDto {
  @ApiProperty() @IsUUID() productId: string;

  @ApiPropertyOptional() @IsOptional() @IsUUID() cursor?: string;

  @ApiPropertyOptional({ default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 20;
}

export class ReviewResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() rating: number;
  @ApiPropertyOptional() comment: string | null;
  @ApiProperty() createdAt: Date;
  @ApiProperty() user: { id: string; username: string; fullName: string | null };
}

export class PaginatedReviewsResponseDto {
  @ApiProperty({ type: [ReviewResponseDto] }) data: ReviewResponseDto[];
  @ApiPropertyOptional() nextCursor: string | null;
}
