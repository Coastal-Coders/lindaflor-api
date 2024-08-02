import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from '@prisma/client';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import type { createProductDTO } from './dto';

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

  async createProduct(data: createProductDTO, userId: string) {
    const { name, description, price, size, color, stock, image } = data;

    console.log('Create product: ', data);

    try {
      const product = await this.prisma.product.create({
        data: {
          userId,
          name,
          description,
          price,
          size,
          color,
          stock,
          image,
        },
      });

      console.log('Product created: ', product);
      return product;
    } catch (error) {
      console.log('Error creating product: ', error);
      throw new Error(error);
    }
  }

  async updateProduct(id: string, data: any): Promise<Product> {
    //FIXME: type safety
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException();

    return this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async deleteProduct(id: string, res: Response): Promise<void> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException();

    await this.prisma.product.delete({
      where: { id },
    });

    res.status(200).send({ message: 'Product deleted' });
  }
}
