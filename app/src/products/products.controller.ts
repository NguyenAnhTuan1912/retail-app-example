import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { ListProductsDto, PaginatedProductsResponseDto, ProductDetailResponseDto } from './dto/products.dto';

@ApiTags('Products')
@ApiSecurity('X-API-Key')
@Controller('products')
export class ProductsController {
  constructor(private productsService: ProductsService) {}

  @Get()
  @ApiOperation({ summary: 'Danh sách sản phẩm (cursor-based pagination)' })
  findAll(@Query() dto: ListProductsDto): Promise<PaginatedProductsResponseDto> {
    return this.productsService.findAll(dto);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Chi tiết sản phẩm' })
  findOne(@Param('productId', ParseUUIDPipe) productId: string): Promise<ProductDetailResponseDto> {
    return this.productsService.findOne(productId);
  }
}
