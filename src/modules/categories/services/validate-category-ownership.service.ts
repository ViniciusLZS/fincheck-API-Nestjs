import { Injectable, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from 'src/shared/database/repositories/categories.repositories';

@Injectable()
export class ValidateCategoryOwnershipService {
  constructor(private readonly categoryRepo: CategoriesRepository) {}

  async validate(userId: string, categoryId: string) {
    const isOwern = await this.categoryRepo.findFirst({
      where: {
        id: categoryId,
        userId,
      },
    });

    if (!isOwern) {
      throw new NotFoundException('Category not found');
    }
  }
}
