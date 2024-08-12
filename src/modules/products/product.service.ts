import { Injectable, NotFoundException } from '@nestjs/common';
import type { Product } from '@prisma/client';
import type { Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import type { createProductDTO, updateProductDTO } from './dto';

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

  async createProduct(data: createProductDTO, userId: string, res: Response): Promise<Product> {
    let imageData: string[] | null = null;

    if (data.image && data.image.length > 0) {
      try {
        imageData = data.image.map((img) => img.buffer.toString('base64'));
      } catch (error) {
        throw new Error(`Error processing image upload: ${error.message || error}`);
      }
    }

    try {
      const product = await this.prisma.product.create({
        data: {
          userId,
          name: data.name,
          description: data.description,
          price: data.price,
          size: data.size,
          color: data.color,
          stock: data.stock,
          image: imageData,
        },
      });

      res.status(201).send({ message: 'Product created' });
      return product;
    } catch (error) {
      throw new Error(`Error creating product: ${error.message || error}`);
    }
  }

  async updateProduct(id: string, data: updateProductDTO): Promise<Product> {
    const checkProduct = await this.getProduct(id);

    if (!checkProduct) throw new NotFoundException();

    return this.prisma.product.update({
      where: { id },
      data: { ...data },
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
