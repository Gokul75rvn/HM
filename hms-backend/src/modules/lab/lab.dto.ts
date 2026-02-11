import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Min,
  IsEnum,
} from 'class-validator';

export class CreateLabTestDto {
  @IsOptional()
  @IsString()
  testCode?: string;

  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  cost?: number;
}

export class CreateLabOrderDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  doctorId: string;

  @IsUUID()
  testId: string;

  @IsOptional()
  @IsString()
  sampleType?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateLabOrderStatusDto {
  @IsEnum(['ORDERED', 'SAMPLE_COLLECTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'])
  status: string;
}

export class CreateLabResultDto {
  @IsUUID()
  orderId: string;

  @IsString()
  value: string;

  @IsOptional()
  @IsString()
  normalRange?: string;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsBoolean()
  isAbnormal?: boolean;

  @IsOptional()
  @IsString()
  remarks?: string;
}