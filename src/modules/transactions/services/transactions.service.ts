import { Injectable } from '@nestjs/common';
import { CreateTransactionDto } from '../dto/create-transaction.dto';
import { UpdateTransactionDto } from '../dto/update-transaction.dto';
import { TransactionsRepository } from 'src/shared/database/repositories/transactions.repositories';
import { ValidateOwnerBankAccountOwnershipService } from '../../bank-accounts/services/validate-bank-account-ownership.service';
import { ValidateCategoryOwnershipService } from '../../categories/services/validate-category-ownership.service';
import { ValidateTransactionOwnershipService } from './validate-transaction-ownership.service';
import { TransactionType } from '../entites/Transaction';

@Injectable()
export class TransactionsService {
  constructor(
    private readonly trasactionsRepo: TransactionsRepository,
    private readonly validateOwnerBankAccountOwnershipService: ValidateOwnerBankAccountOwnershipService,
    private readonly validateCategoryOwnershipService: ValidateCategoryOwnershipService,
    private readonly validateTrasactionOwnershipService: ValidateTransactionOwnershipService,
  ) {}

  async create(userId, createTransactionDto: CreateTransactionDto) {
    const { bankAccountId, categoryId, date, name, type, value } =
      createTransactionDto;

    await this.validateEntitesOwnership({ userId, bankAccountId, categoryId });

    return this.trasactionsRepo.create({
      data: {
        userId,
        bankAccountId,
        categoryId,
        date,
        name,
        type,
        value,
      },
    });
  }

  findAllByUserId(
    userId: string,
    filters: {
      month: number;
      year: number;
      bankAccountId?: string;
      type?: TransactionType;
    },
  ) {
    return this.trasactionsRepo.findMany({
      where: {
        userId,
        bankAccountId: filters.bankAccountId,
        type: filters.type,
        date: {
          gte: new Date(Date.UTC(filters.year, filters.month)),
          lt: new Date(Date.UTC(filters.year, filters.month + 1)),
        },
      },
    });
  }

  async update(
    userId: string,
    transactionId: string,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    const { bankAccountId, categoryId, date, name, type, value } =
      updateTransactionDto;

    await this.validateEntitesOwnership({
      userId,
      bankAccountId,
      categoryId,
      transactionId,
    });
    return this.trasactionsRepo.update({
      where: { id: transactionId },
      data: { bankAccountId, categoryId, date, name, type, value },
    });
  }

  async remove(userId: string, transactionId: string) {
    await this.validateEntitesOwnership({ userId, transactionId });

    await this.trasactionsRepo.delete({
      where: { id: transactionId },
    });

    return null;
  }

  private async validateEntitesOwnership({
    userId,
    bankAccountId,
    categoryId,
    transactionId,
  }: {
    userId: string;
    bankAccountId?: string;
    categoryId?: string;
    transactionId?: string;
  }) {
    await Promise.all([
      transactionId &&
        this.validateTrasactionOwnershipService.validate(userId, transactionId),

      bankAccountId &&
        this.validateOwnerBankAccountOwnershipService.validate(
          userId,
          bankAccountId,
        ),

      categoryId &&
        this.validateCategoryOwnershipService.validate(userId, categoryId),
    ]);
  }
}
