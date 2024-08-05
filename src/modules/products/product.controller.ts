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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoles, type Product } from '@prisma/client';
import type { Response } from 'express';
import { GetCurrentUserId, Public, Roles } from 'src/common/decorators';
import { AccessTokenGuard } from 'src/common/guards';
import { updateProductDto } from './dto';
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
  @UseInterceptors(FileInterceptor('image'))
  @Post()
  async createProduct(
    @GetCurrentUserId() userId: string,
    @Body() data: any,
    @UploadedFile() image: Express.Multer.File
  ): Promise<Product> {
    console.log('Post request received');
    console.log('Request body: ', data);

    if (image) {
      console.log('Uploaded image:', image);
      data.image = image;
    } else {
      console.log('No image uploaded');
    }

    const product = await this.productService.createProduct(data, userId);

    console.log('Product created: ', product);
    return product;
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
