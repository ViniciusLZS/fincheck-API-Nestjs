import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';

@Injectable()
export class ValidateTransactionOwnershipService {
  constructor(private readonly transactionsRepo: TransactionsRepository) {}

  async validate(userId: string, transactionId: string) {
    const isOwern = await this.transactionsRepo.findFirst({
      where: {
        id: transactionId,
        userId,
      },
    });

    if (!isOwern) {
      throw new NotFoundException('Transaction not found');
    }
  }
}
