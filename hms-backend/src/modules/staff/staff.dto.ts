import { IsEmail, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

const STAFF_ROLES = ['NURSE', 'RECEPTIONIST', 'LAB_TECH', 'PHARMACIST', 'ACCOUNTANT', 'STAFF'];

export class CreateStaffDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsEnum(STAFF_ROLES)
  role: string;

  @IsString()
  designation: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  wardId?: string;
}

export class UpdateStaffAssignmentDto {
  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsUUID()
  wardId?: string;

  @IsOptional()
  @IsString()
  designation?: string;
}