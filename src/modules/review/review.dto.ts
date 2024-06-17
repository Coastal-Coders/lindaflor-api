export class CreateReviewDto {
  readonly rating: number;
  readonly comment: string;
}

export class UpdateReviewDto {
  readonly rating?: number;
  readonly comment?: string;
}
