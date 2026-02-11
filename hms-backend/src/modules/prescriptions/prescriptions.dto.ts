import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
  IsInt,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PrescriptionItemDto {
  @IsUUID()
  medicineId: string;

  @IsString()
  dosage: string;

  @IsString()
  frequency: string;

  @IsString()
  duration: string;

  @IsOptional()
  @IsString()
  instructions?: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class CreatePrescriptionDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  doctorId: string;

  @IsOptional()
  @IsUUID()
  appointmentId?: string;

  @IsOptional()
  @IsUUID()
  admissionId?: string;

  @IsDateString()
  validUntil: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PrescriptionItemDto)
  items: PrescriptionItemDto[];
}

export class UpdatePrescriptionStatusDto {
  @IsEnum(['PENDING', 'ISSUED', 'PARTIALLY_DISPENSED', 'FULLY_DISPENSED', 'CANCELLED'])
  status: string;
}