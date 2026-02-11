import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';

const INSURANCE_STATUS = ['ACTIVE', 'INACTIVE', 'EXPIRED'];
const CLAIM_STATUS = ['SUBMITTED', 'PROCESSING', 'APPROVED', 'REJECTED', 'PAID'];

export class CreateInsurancePolicyDto {
  @IsString()
  @IsNotEmpty()
  providerName: string;

  @IsString()
  @IsNotEmpty()
  policyNumber: string;

  @IsOptional()
  @IsUUID()
  patientId?: string;

  @IsString()
  memberName: string;

  @IsString()
  relationWithMember: string;

  @IsString()
  coverageType: string;

  @IsInt()
  @Min(0)
  sumInsured: number;

  @IsDateString()
  validFrom: string;

  @IsDateString()
  validUpto: string;

  @IsOptional()
  @IsEnum(INSURANCE_STATUS)
  status?: string;
}

export class CreateInsuranceClaimDto {
  @IsUUID()
  patientId: string;

  @IsUUID()
  billId: string;

  @IsUUID()
  insuranceId: string;

  @IsInt()
  @Min(1)
  claimAmount: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}

export class UpdateInsuranceClaimStatusDto {
  @IsEnum(CLAIM_STATUS)
  status: string;

  @IsOptional()
  @IsInt()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsString()
  remarks?: string;
}