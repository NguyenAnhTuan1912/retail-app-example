import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ListProductsDto } from './dto/products.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListProductsDto) {
    const { cursor, limit = 20, search, categoryId, priceFrom, priceTo } = dto;

    const where: Prisma.ProductWhereInput = {};

    if (categoryId) {
      where.categoryId = categoryId;
    }
    if (priceFrom !== undefined || priceTo !== undefined) {
      where.basePrice = {
        ...(priceFrom !== undefined && { gte: priceFrom }),
        ...(priceTo !== undefined && { lte: priceTo }),
      };
    }
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }

    const products = await this.prisma.product.findMany({
      where,
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

  async getCategories() {
    return this.prisma.category.findMany({
      select: { id: true, name: true, slug: true, parentId: true },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        seller: { select: { id: true, username: true, fullName: true } },
        images: { select: { id: true, url: true, isMain: true } },
        _count: { select: { reviews: true } },
      },
    });

    if (!product) throw new NotFoundException('Product not found');
    return {
      ...product,
      basePrice: product.basePrice.toString(),
      ratingAvg: product.ratingAvg.toString(),
      reviewCount: product._count.reviews,
    };
  }
}
