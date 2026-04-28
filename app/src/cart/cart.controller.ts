import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto, RemoveCartItemDto, GetCartDto } from './dto/cart.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Cart')
@ApiSecurity('X-API-Key')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Xem giỏ hàng' })
  getCart(@CurrentUser() user: any, @Query() dto: GetCartDto) {
    return this.cartService.getCart(dto.userId ?? user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  addItem(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(dto.userId ?? user.id, dto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Cập nhật số lượng' })
  updateItem(
    @CurrentUser() user: any,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(dto.userId ?? user.id, itemId, dto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Xoá sản phẩm khỏi giỏ hàng' })
  removeItem(
    @CurrentUser() user: any,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: RemoveCartItemDto,
  ) {
    return this.cartService.removeItem(dto.userId ?? user.id, itemId);
  }
}
