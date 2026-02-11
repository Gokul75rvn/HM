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
exports.AdmissionsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let AdmissionsService = class AdmissionsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        if (dto.bedId) {
            const bed = await this.prisma.bed.findUnique({ where: { id: dto.bedId } });
            if (!bed)
                throw new common_1.NotFoundException('Bed not found');
            if (bed.status !== 'AVAILABLE') {
                throw new common_1.BadRequestException('Bed is not available');
            }
        }
        const admissionNumber = `ADM-${Date.now()}`;
        const admission = await this.prisma.$transaction(async (tx) => {
            const created = await tx.admission.create({
                data: {
                    admissionNumber,
                    patientId: dto.patientId,
                    departmentId: dto.departmentId,
                    doctorId: dto.doctorId,
                    bedId: dto.bedId ?? null,
                    reason: dto.reason,
                    diagnosis: dto.diagnosis,
                },
                include: {
                    patient: { include: { user: true } },
                    doctor: { include: { user: true } },
                    bed: true,
                },
            });
            if (dto.bedId) {
                await tx.bed.update({
                    where: { id: dto.bedId },
                    data: { status: 'OCCUPIED' },
                });
            }
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'ADMISSION',
            resourceId: admission.id,
            newValues: dto,
        });
        return admission;
    }
    async findAll(page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.prisma.admission.findMany({
                skip,
                take: limit,
                include: {
                    patient: { include: { user: true } },
                    doctor: { include: { user: true } },
                    department: true,
                    bed: true,
                },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.admission.count(),
        ]);
        return { data, total, page, limit };
    }
    async discharge(id, dto, userId) {
        const admission = await this.prisma.admission.findUnique({ where: { id } });
        if (!admission)
            throw new common_1.NotFoundException('Admission not found');
        if (admission.status === 'DISCHARGED') {
            throw new common_1.BadRequestException('Admission already discharged');
        }
        const updated = await this.prisma.$transaction(async (tx) => {
            const discharged = await tx.admission.update({
                where: { id },
                data: {
                    status: 'DISCHARGED',
                    dischargeDate: dto.dischargeDate ? new Date(dto.dischargeDate) : new Date(),
                    treatment: dto.dischargeSummary,
                },
                include: {
                    patient: { include: { user: true } },
                    doctor: { include: { user: true } },
                    bed: true,
                },
            });
            if (admission.bedId) {
                await tx.bed.update({
                    where: { id: admission.bedId },
                    data: { status: 'AVAILABLE' },
                });
            }
            return discharged;
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'ADMISSION',
            resourceId: id,
            newValues: { status: 'DISCHARGED', ...dto },
        });
        return updated;
    }
};
exports.AdmissionsService = AdmissionsService;
exports.AdmissionsService = AdmissionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService, audit_service_1.AuditService])
], AdmissionsService);
//# sourceMappingURL=admissions.service.js.map