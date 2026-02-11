import { IsString, IsEmail, IsOptional, MinLength, IsEnum } from 'class-validator';

export class CreateUserDto {
  @IsString()
  registrationId: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum([
    'SUPER_ADMIN',
    'ADMIN',
    'DOCTOR',
    'PATIENT',
    'NURSE',
    'RECEPTIONIST',
    'LAB_TECH',
    'PHARMACIST',
    'ACCOUNTANT',
  ])
  role: string;

  @IsString()
  hospitalId: string;
}

export class UpdateUserDto {
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
  @IsEnum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'DEACTIVATED'])
  status?: string;
}

export class UserResponseDto {
  id: string;
  registrationId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  lastLogin: Date;
  createdAt: Date;
  updatedAt: Date;
}
