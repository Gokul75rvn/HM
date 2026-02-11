import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

const BILL_TYPES = ['OPD', 'IPD', 'LAB', 'PHARMACY', 'EMERGENCY'];

export class BillItemDto {
  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @Min(1)
  quantity: number;

  @IsInt()
  @Min(0)
  unitPrice: number;
}

export class GenerateBillDto {
  @IsUUID()
  patientId: string;

  @IsEnum(BILL_TYPES)
  billType: string;

  @IsDateString()
  dueDate: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @IsOptional()
  @IsUUID()
  prescriptionId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  discount?: number;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => BillItemDto)
  items: BillItemDto[];
}