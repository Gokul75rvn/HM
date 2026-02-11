"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InsuranceService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let InsuranceService = class InsuranceService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createPolicy(dto, userId) {
        const existing = await this.prisma.insurance.findUnique({ where: { policyNumber: dto.policyNumber } });
        if (existing) {
            throw new common_1.ConflictException('Policy number already exists');
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
                status: (dto.status ?? 'ACTIVE'),
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
    listPolicies(patientId) {
        return this.prisma.insurance.findMany({
            where: patientId ? { patientId } : undefined,
            orderBy: { createdAt: 'desc' },
        });
    }
    async createClaim(dto, userId) {
        const insurance = await this.prisma.insurance.findUnique({ where: { id: dto.insuranceId } });
        if (!insurance)
            throw new common_1.NotFoundException('Insurance policy not found');
        const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
        if (!bill)
            throw new common_1.NotFoundException('Bill not found');
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
    listClaims(status) {
        return this.prisma.insuranceClaim.findMany({
            where: status ? { status: status } : undefined,
            include: {
                bill: true,
                insurance: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async updateClaimStatus(id, dto, userId) {
        const claim = await this.prisma.insuranceClaim.findUnique({ where: { id } });
        if (!claim) {
            throw new common_1.NotFoundException('Claim not found');
        }
        const updated = await this.prisma.insuranceClaim.update({
            where: { id },
            data: {
                status: dto.status,
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
};
exports.InsuranceService = InsuranceService;
exports.InsuranceService = InsuranceService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], InsuranceService);
//# sourceMappingURL=insurance.service.js.map