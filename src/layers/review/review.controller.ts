import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { ReviewService } from './review.service';
import { Review } from './review.model';

@Controller('api/v1/reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async createReview(@Body() review: Review): Promise<Review> {
    return this.reviewService.createReview(review);
  }

  @Get()
  async getAllReviews(): Promise<Review[]> {
    return this.reviewService.getAllReviews();
  }

  @Get(':id')
  async getReviewById(@Param('id') id: string): Promise<Review | null> {
    return this.reviewService.getReviewById(id);
  }

  @Put(':id')
  async updateReview(@Param('id') id: string, @Body() data: Review): Promise<Review> {
    return this.reviewService.updateReview(id, data);
  }

  @Delete(':id')
  async deleteReview(@Param('id') id: string): Promise<void> {
    await this.reviewService.deleteReview(id);
  }
}
