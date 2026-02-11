import { IsEnum, IsInt, IsOptional, IsString, IsUUID, Min } from 'class-validator';

const PAYMENT_METHODS = ['CASH', 'CARD', 'UPI', 'NET_BANKING', 'CHEQUE', 'INSURANCE'];

export class CreatePaymentDto {
  @IsUUID()
  billId: string;

  @IsUUID()
  patientId: string;

  @IsInt()
  @Min(1)
  amount: number;

  @IsEnum(PAYMENT_METHODS)
  method: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  reference?: string;
}