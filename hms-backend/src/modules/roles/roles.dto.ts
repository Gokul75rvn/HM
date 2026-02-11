import { ArrayMinSize, IsArray, IsOptional, IsString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class PermissionInputDto {
  @IsString()
  resource: string;

  @IsString()
  action: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreateRoleDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionInputDto)
  permissions?: PermissionInputDto[];
}

export class UpdateRolePermissionsDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => PermissionInputDto)
  permissions: PermissionInputDto[];
}