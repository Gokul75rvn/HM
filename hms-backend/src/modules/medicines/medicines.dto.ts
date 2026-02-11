import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min } from 'class-validator';

const MEDICINE_UNITS = [
  'TABLET',
  'CAPSULE',
  'INJECTION',
  'LIQUID',
  'INHALER',
  'CREAM',
  'GEL',
];

export class CreateMedicineDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  genericName: string;

  @IsString()
  @IsNotEmpty()
  composition: string;

  @IsString()
  @IsNotEmpty()
  manufacturer: string;

  @IsString()
  @IsNotEmpty()
  batchNumber: string;

  @IsDateString()
  expiryDate: string;

  @IsEnum(MEDICINE_UNITS)
  unit: string;

  @IsInt()
  @Min(0)
  price: number;

  @IsInt()
  @Min(0)
  stock: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;
}

export class UpdateMedicineDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  stock?: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  price?: number;

  @IsOptional()
  @IsDateString()
  expiryDate?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  reorderLevel?: number;
}