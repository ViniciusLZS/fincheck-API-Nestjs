import { Injectable } from '@nestjs/common';
import { CreateBankAccountDto } from '../dto/create-bank-account.dto';
import { UpdateBankAccountDto } from '../dto/update-bank-account.dto';
import { BankAccountsRepository } from 'src/shared/database/repositories/bank-accounts.repositories ';
import { ValidateOwnerBankAccountOwnershipService } from './validate-bank-account-ownership.service';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly bankAccountsRepo: BankAccountsRepository,
    private readonly validateOwnerBankAccountOwnershipService: ValidateOwnerBankAccountOwnershipService,
  ) {}

  findAllByUserId(userId: string) {
    return this.bankAccountsRepo.findMany({
      where: { userId },
    });
  }

  create(userId: string, createBankAccountDto: CreateBankAccountDto) {
    const { name, initialBalance, type, color } = createBankAccountDto;

    return this.bankAccountsRepo.create({
      data: {
        userId,
        name,
        initialBalance,
        type,
        color,
      },
    });
  }

  async update(
    userId: string,
    bankAccountId: string,
    updateBankAccountDto: UpdateBankAccountDto,
  ) {
    await this.validateOwnerBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    const { name, initialBalance, type, color } = updateBankAccountDto;

    return this.bankAccountsRepo.update({
      where: { id: bankAccountId },
      data: { name, initialBalance, type, color },
    });
  }

  async remove(userId: string, bankAccountId: string) {
    await this.validateOwnerBankAccountOwnershipService.validate(
      userId,
      bankAccountId,
    );

    await this.bankAccountsRepo.delete({
      where: { id: bankAccountId },
    });

    return null;
  }
}
