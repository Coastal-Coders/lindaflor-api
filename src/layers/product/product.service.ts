import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createProductDto, updateProductDto } from './product.dto';
import { Product } from './product.model';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

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
    return this.prisma.product.update({
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
