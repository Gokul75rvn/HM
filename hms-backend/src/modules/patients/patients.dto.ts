import { IsString, IsEmail, IsDateString, IsEnum, IsOptional, IsPhoneNumber } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsPhoneNumber()
  phone: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender: string;

  @IsOptional()
  @IsEnum(['A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE', 'AB_POSITIVE', 'AB_NEGATIVE'])
  bloodGroup?: string;

  @IsString()
  emergencyContact: string;

  @IsString()
  @IsPhoneNumber()
  emergencyPhone: string;

  @IsString()
  address: string;

  @IsString()
  city: string;

  @IsString()
  state: string;

  @IsString()
  pinCode: string;

  @IsOptional()
  @IsString()
  country?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;
}

export class UpdatePatientDto {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsString()
  allergies?: string;

  @IsOptional()
  @IsString()
  medicalHistory?: string;
}

export class PatientResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodGroup: string;
  address: string;
  city: string;
  state: string;
  createdAt: string;
  updatedAt: string;
}
