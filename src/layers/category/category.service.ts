import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { createCategoryDto, updateCategoryDto } from './category.dto';
import { Category } from './category.model';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: createCategoryDto) {
    return this.prisma.category.create({
      data,
    });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.prisma.category.findMany();
  }

  async getCategoryById(id: string): Promise<Category> {
    return this.prisma.category.findUnique({
      where: {
        id,
      },
    });
  }

  async updateCategory(id: string, data: updateCategoryDto): Promise<Category> {
    return this.prisma.category.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteCategory(id: string): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
