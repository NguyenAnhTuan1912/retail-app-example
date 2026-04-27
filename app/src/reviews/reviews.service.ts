import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListReviewsDto } from './dto/reviews.dto';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListReviewsDto) {
    const { productId, cursor, limit = 20 } = dto;

    const reviews = await this.prisma.review.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where: { productId },
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        rating: true,
        comment: true,
        createdAt: true,
        user: { select: { id: true, username: true, fullName: true } },
      },
    });

    const hasNext = reviews.length > limit;
    const data = hasNext ? reviews.slice(0, limit) : reviews;

    return { data, nextCursor: hasNext ? data[data.length - 1].id : null };
  }
}
