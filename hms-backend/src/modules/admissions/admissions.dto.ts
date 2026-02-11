import { IsString, IsOptional, IsDateString } from 'class-validator';

export class CreateAdmissionDto {
  @IsString()
  patientId: string;

  @IsString()
  departmentId: string;

  @IsString()
  doctorId: string;

  @IsOptional()
  @IsString()
  bedId?: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsString()
  diagnosis?: string;
}

export class DischargeAdmissionDto {
  @IsOptional()
  @IsDateString()
  dischargeDate?: string;

  @IsOptional()
  @IsString()
  dischargeSummary?: string;
}
