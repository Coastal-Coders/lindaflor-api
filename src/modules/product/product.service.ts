import { Injectable, NotFoundException } from '@nestjs/common';
import { createProductDto, updateProductDto } from './product.dto';
import { Product } from './product.model';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async createProduct(data: createProductDto) {
    return this.prisma.product.create({
      data,
    });
  }

  async getAllProducts(): Promise<Product[]> {
    return this.prisma.product.findMany();
  }

  async getProductById(id: string): Promise<Product> {
    return this.prisma.product.findUnique({
      where: {
        id,
      },
    });
  }

  async updateProduct(id: string, data: updateProductDto): Promise<Product> {
    const checkProduct = await this.prisma.product.findUnique({
      where: {
        id,
      },
    });

    if (!checkProduct) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }

    return await this.prisma.product.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteProduct(id: string): Promise<void> {
    await this.prisma.product.delete({
      where: {
        id,
      },
    });
  }
}
