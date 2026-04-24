import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ListProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListProductsDto) {
    const { cursor, limit = 20 } = dto;

    const products = await this.prisma.product.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: {
        id: true,
        name: true,
        basePrice: true,
        ratingAvg: true,
        stockQuantity: true,
        images: { where: { isMain: true }, select: { url: true }, take: 1 },
      },
    });

    const hasNext = products.length > limit;
    const data = (hasNext ? products.slice(0, limit) : products).map((p) => ({
      id: p.id,
      name: p.name,
      basePrice: p.basePrice.toString(),
      ratingAvg: p.ratingAvg.toString(),
      stockQuantity: p.stockQuantity,
      mainImageUrl: p.images[0]?.url ?? null,
    }));

    return { data, nextCursor: hasNext ? data[data.length - 1].id : null };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, username: true, fullName: true } },
        images: { select: { id: true, url: true, isMain: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return {
      ...product,
      basePrice: product.basePrice.toString(),
      ratingAvg: product.ratingAvg.toString(),
    };
  }
}
