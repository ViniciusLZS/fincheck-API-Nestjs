import {
  IsEnum,
  IsHexColor,
  IsNotEmpty,
  IsNumber,
  IsString,
} from 'class-validator';
import { bankAccountsType } from '../entites/bankAccounts';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsNumber()
  @IsNotEmpty()
  initialBalance: number;

  @IsNotEmpty()
  @IsEnum(bankAccountsType)
  type: bankAccountsType;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  color: string;
}
