import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto, UpdateReviewDto } from './review.dto';
import { Review } from './review.model';

@Injectable()
export class ReviewService {
  constructor(private prisma: PrismaService) {}

  async createReview(review: CreateReviewDto) {
    return this.prisma.review.create({
      data: {
        rating: review.rating,
        comment: review.comment,
      },
    });
  }

  async getAllReviews(): Promise<Review[]> {
    return this.prisma.review.findMany();
  }

  async getReviewById(id: string): Promise<Review> {
    return this.prisma.review.findUnique({
      where: {
        id,
      },
    });
  }

  async updateReview(id: string, data: UpdateReviewDto): Promise<Review> {
    return this.prisma.review.update({
      where: {
        id,
      },
      data,
    });
  }

  async deleteReview(id: string): Promise<void> {
    await this.prisma.review.delete({
      where: {
        id,
      },
    });
  }
}
