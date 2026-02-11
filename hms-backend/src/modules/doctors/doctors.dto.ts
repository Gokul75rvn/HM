import { IsString, IsEmail, IsOptional, IsNumber, IsBoolean } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsString()
  registrationNumber: string;

  @IsString()
  specialization: string;

  @IsString()
  qualification: string;

  @IsOptional()
  @IsString()
  licenseNumber?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @IsOptional()
  @IsNumber()
  experienceYears?: number;
}

export class UpdateDoctorDto {
  @IsOptional()
  @IsString()
  specialization?: string;

  @IsOptional()
  @IsNumber()
  consultationFee?: number;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsBoolean()
  isAvailable?: boolean;
}

export class DoctorResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  specialization: string;
  consultationFee: number;
  isAvailable: boolean;
  departmentId: string;
  createdAt: string;
}
