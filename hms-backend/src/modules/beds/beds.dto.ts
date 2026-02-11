import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Min, IsUUID } from 'class-validator';

export class CreateWardDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  type: string;

  @IsUUID()
  departmentId: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  totalBeds?: number;
}

export class UpdateWardDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsUUID()
  departmentId?: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  totalBeds?: number;
}

export class CreateBedDto {
  @IsString()
  @IsNotEmpty()
  bedNumber: string;

  @IsUUID()
  wardId: string;

  @IsString()
  @IsNotEmpty()
  bedType: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  charges?: number;
}

export class UpdateBedStatusDto {
  @IsEnum(['AVAILABLE', 'OCCUPIED', 'MAINTENANCE', 'RESERVED'])
  status: string;
}