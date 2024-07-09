import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createProductDto, updateProductDto } from './dto';
import { Product } from './types/Product';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async getProduct(id: string): Promise<Product | null> {
    return this.prisma.product.findUnique({
      where: { id },
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async createProduct(data: createProductDto & { userId: string }): Promise<Product> {
    return this.prisma.product.create({
      data,
    });
  }

  async updateProduct(id: string, data: updateProductDto): Promise<Product> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException(`Product with id ${id} not found`);

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException(`Product with id ${id} not found`);

    await this.prisma.product.delete({
      where: { id },
    });
  }
}
