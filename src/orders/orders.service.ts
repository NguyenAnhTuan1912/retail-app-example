import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CancelOrderDto, ListOrdersDto } from './dto/orders.dto';

@Injectable()
export class OrdersService {
  constructor(private prisma: PrismaService) {}

  async findAll(dto: ListOrdersDto) {
    const { userId, cursor, limit = 20, search } = dto;

    const now = new Date();
    const dateFrom = dto.dateFrom ? new Date(dto.dateFrom) : new Date(now.getFullYear(), now.getMonth(), 1);
    const dateTo = dto.dateTo ? new Date(dto.dateTo) : now;

    const where: any = {
      buyerId: userId,
      createdAt: { gte: dateFrom, lte: dateTo },
    };

    if (search) {
      where.items = { some: { product: { name: { contains: search, mode: 'insensitive' } } } };
    }

    const orders = await this.prisma.order.findMany({
      take: limit + 1,
      ...(cursor && { skip: 1, cursor: { id: cursor } }),
      where,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      select: { id: true, totalAmount: true, status: true, createdAt: true },
    });

    const hasNext = orders.length > limit;
    const data = (hasNext ? orders.slice(0, limit) : orders).map((o) => ({
      ...o,
      totalAmount: o.totalAmount.toString(),
    }));

    return { data, nextCursor: hasNext ? data[data.length - 1].id : null };
  }

  async findOne(id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: {
          include: { product: { select: { id: true, name: true, basePrice: true } } },
        },
        cancellation: { select: { reason: true, cancelledAt: true } },
      },
    });

    if (!order) throw new NotFoundException('Order not found');

    return {
      ...order,
      totalAmount: order.totalAmount.toString(),
      items: order.items.map((i) => ({
        ...i,
        priceAtPurchase: i.priceAtPurchase.toString(),
        product: { ...i.product, basePrice: i.product.basePrice.toString() },
      })),
    };
  }

  async cancel(id: string, dto: CancelOrderDto) {
    const order = await this.prisma.order.findUnique({ where: { id } });

    if (!order) throw new NotFoundException('Order not found');
    if (order.status === 'cancelled') throw new BadRequestException('Order already cancelled');

    const daysSinceCreated = (Date.now() - order.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceCreated > 7) throw new BadRequestException('Can only cancel within 7 days of order creation');

    const [updated] = await this.prisma.$transaction([
      this.prisma.order.update({ where: { id }, data: { status: 'cancelled' } }),
      this.prisma.orderCancellation.create({ data: { orderId: id, reason: dto.reason } }),
    ]);

    return { ...updated, totalAmount: updated.totalAmount.toString() };
  }
}
