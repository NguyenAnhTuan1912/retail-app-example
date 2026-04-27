import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { ListReviewsDto, PaginatedReviewsResponseDto } from './dto/reviews.dto';

@ApiTags('Reviews')
@ApiSecurity('X-API-Key')
@Controller('reviews')
export class ReviewsController {
  constructor(private reviewsService: ReviewsService) {}

  @Get()
  @ApiOperation({ summary: 'Reviews của sản phẩm (cursor-based pagination)' })
  findAll(@Query() dto: ListReviewsDto): Promise<PaginatedReviewsResponseDto> {
    return this.reviewsService.findAll(dto);
  }
}
