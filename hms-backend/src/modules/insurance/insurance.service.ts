import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import {
  CreateInsurancePolicyDto,
  CreateInsuranceClaimDto,
  UpdateInsuranceClaimStatusDto,
} from './insurance.dto';

@Injectable()
export class InsuranceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createPolicy(dto: CreateInsurancePolicyDto, userId: string) {
    const existing = await this.prisma.insurance.findUnique({ where: { policyNumber: dto.policyNumber } });
    if (existing) {
      throw new ConflictException('Policy number already exists');
    }

    const policy = await this.prisma.insurance.create({
      data: {
        providerName: dto.providerName,
        policyNumber: dto.policyNumber,
        patientId: dto.patientId ?? null,
        memberName: dto.memberName,
        relationWithMember: dto.relationWithMember,
        coverageType: dto.coverageType,
        sumInsured: dto.sumInsured,
        validFrom: new Date(dto.validFrom),
        validUpto: new Date(dto.validUpto),
        status: (dto.status ?? 'ACTIVE') as any,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'INSURANCE_POLICY',
      resourceId: policy.id,
      newValues: dto,
    });

    return policy;
  }

  listPolicies(patientId?: string) {
    return this.prisma.insurance.findMany({
      where: patientId ? { patientId } : undefined,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createClaim(dto: CreateInsuranceClaimDto, userId: string) {
    const insurance = await this.prisma.insurance.findUnique({ where: { id: dto.insuranceId } });
    if (!insurance) throw new NotFoundException('Insurance policy not found');

    const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
    if (!bill) throw new NotFoundException('Bill not found');

    const claimNumber = `CLM-${Date.now()}`;
    const claim = await this.prisma.insuranceClaim.create({
      data: {
        claimNumber,
        patientId: dto.patientId,
        billId: dto.billId,
        insuranceId: dto.insuranceId,
        claimAmount: dto.claimAmount,
        remarks: dto.remarks ?? null,
      },
    });

    await this.audit.log({
      userId,
      action: 'CREATE',
      resource: 'INSURANCE_CLAIM',
      resourceId: claim.id,
      newValues: dto,
    });

    return claim;
  }

  listClaims(status?: string) {
    return this.prisma.insuranceClaim.findMany({
      where: status ? { status: status as any } : undefined,
      include: {
        bill: true,
        insurance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateClaimStatus(id: string, dto: UpdateInsuranceClaimStatusDto, userId: string) {
    const claim = await this.prisma.insuranceClaim.findUnique({ where: { id } });
    if (!claim) {
      throw new NotFoundException('Claim not found');
    }

    const updated = await this.prisma.insuranceClaim.update({
      where: { id },
      data: {
        status: dto.status as any,
        approvedAmount: dto.approvedAmount ?? claim.approvedAmount,
        remarks: dto.remarks ?? claim.remarks,
      },
    });

    await this.audit.log({
      userId,
      action: 'UPDATE',
      resource: 'INSURANCE_CLAIM_STATUS',
      resourceId: id,
      oldValues: { status: claim.status },
      newValues: dto,
    });

    return updated;
  }
}