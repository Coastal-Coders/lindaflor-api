import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.model';

@Controller('api/v1/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Body() product: Product): Promise<Product> {
    return this.productService.createProduct(product);
  }

  @Get()
  async getAllProducts(): Promise<Product[]> {
    return this.productService.getAllProducts();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product | null> {
    return this.productService.getProductById(id);
  }

  @Put(':id')
  async updateProduct(@Param('id') id: string, @Body() product: Product): Promise<Product> {
    return this.productService.updateProduct(id, product);
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string): Promise<void> {
    await this.productService.deleteProduct(id);
  }
}
