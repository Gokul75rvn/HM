import { ArrayMinSize, IsArray, IsInt, IsUUID, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class DispenseItemDto {
  @IsUUID()
  prescriptionItemId: string;

  @IsInt()
  @Min(1)
  quantity: number;
}

export class DispensePrescriptionDto {
  @IsUUID()
  prescriptionId: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => DispenseItemDto)
  items: DispenseItemDto[];
}