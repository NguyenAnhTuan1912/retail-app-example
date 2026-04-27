import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddToCartDto, UpdateCartItemDto } from './dto/cart.dto';
import { CurrentUser } from '../auth/current-user.decorator';

@ApiTags('Cart')
@ApiSecurity('X-API-Key')
@Controller('cart')
export class CartController {
  constructor(private cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Xem giỏ hàng' })
  getCart(@CurrentUser() user: any) {
    return this.cartService.getCart(user.id);
  }

  @Post()
  @ApiOperation({ summary: 'Thêm sản phẩm vào giỏ hàng' })
  addItem(@CurrentUser() user: any, @Body() dto: AddToCartDto) {
    return this.cartService.addItem(user.id, dto);
  }

  @Patch(':itemId')
  @ApiOperation({ summary: 'Cập nhật số lượng' })
  updateItem(
    @CurrentUser() user: any,
    @Param('itemId', ParseUUIDPipe) itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(user.id, itemId, dto);
  }

  @Delete(':itemId')
  @ApiOperation({ summary: 'Xoá sản phẩm khỏi giỏ hàng' })
  removeItem(@CurrentUser() user: any, @Param('itemId', ParseUUIDPipe) itemId: string) {
    return this.cartService.removeItem(user.id, itemId);
  }
}
