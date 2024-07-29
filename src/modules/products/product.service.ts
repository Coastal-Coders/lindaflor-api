import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createProductDto, updateProductDto } from './dto';
import { Product } from './types/Product';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProduct(id: string): Promise<Product | null> {
    const product = await this.prisma.product.findUnique({
      where: { id },
    });

    if (!product) throw new NotFoundException();

    return product;
  }

  async getAllProducts(): Promise<Product[]> {
    const products = await this.prisma.product.findMany();

    if (products.length === 0) throw new NotFoundException();

    return products;
  }

  async createProduct(data: createProductDto & { userId: string }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async updateProduct(id: string, data: updateProductDto): Promise<Product> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException();

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException();

    await this.prisma.product.delete({
      where: { id },
    });
  }
}
