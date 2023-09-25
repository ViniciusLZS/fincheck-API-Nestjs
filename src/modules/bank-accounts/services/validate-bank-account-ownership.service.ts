import { Injectable, NotFoundException } from '@nestjs/common';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories ';

@Injectable()
export class ValidateOwnerBankAccountOwnershipService {
  constructor(private readonly bankAccountsRepo: BankAccountsRepository) {}

  async validate(userId: string, bankAccountId: string) {
    const isOwern = await this.bankAccountsRepo.findFirst({
      where: {
        id: bankAccountId,
        userId,
      },
    });

    if (!isOwern) {
      throw new NotFoundException('Bank account not found');
    }
  }
}
