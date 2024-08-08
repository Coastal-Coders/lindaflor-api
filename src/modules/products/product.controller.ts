import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { type Product, UserRoles } from '@prisma/client';
import type { Response } from 'express';
import { GetCurrentUserId, Public, Roles } from 'src/common/decorators';
import { AccessTokenGuard } from 'src/common/guards';
import { type createProductDTO, updateProductDto } from './dto';
import { ProductService } from './product.service';

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
  @HttpCode(HttpStatus.CREATED)
  @Roles(UserRoles.ADMIN, UserRoles.MANAGER)
  @UseInterceptors(FilesInterceptor('image', 5))
  @Post()
  async createProduct(
    @GetCurrentUserId() userId: string,
    @Body() data: Omit<createProductDTO, 'image'>,
    @UploadedFiles() images: Express.Multer.File[],
    @Res() res: Response
  ): Promise<Product> {
    return await this.productService.createProduct({ ...data, image: images }, userId, res);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':id')
  async updateProduct(@Param('id') id: string, @Body() dto: updateProductDto): Promise<Product> {
    return this.productService.updateProduct(id, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteProduct(@Param('id') id: string, @Res() res: Response): Promise<void> {
    await this.productService.deleteProduct(id, res);
  }
}
