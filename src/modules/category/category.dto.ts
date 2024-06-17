export class createCategoryDto {
  readonly name: string;
  readonly description: string;
}

export class updateCategoryDto {
  readonly name?: string;
  readonly description?: string;
}
