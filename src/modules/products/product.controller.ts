import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { GetCurrentUserId, Public } from 'src/common/decorators';
import { AccessTokenGuard } from 'src/common/guards';
import { createProductDto, updateProductDto } from './dto';
import { ProductService } from './product.service';
import { Product } from './types';
import { Role } from 'src/common/roles/roles.enum';
import { Roles } from 'src/common/roles/roles.decorator';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Get(':id')
  async getProduct(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProduct(id);
  }

  @Public()
  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  @Roles(Role.ADMIN)
  async createProduct(
    @GetCurrentUserId() userId: string,
    @Body() dto: createProductDto
  ): Promise<Product> {
    return this.productService.createProduct({ ...dto, userId });
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: updateProductDto): Promise<Product> {
    return this.productService.updateProduct(id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
