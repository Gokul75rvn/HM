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
exports.BedsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let BedsService = class BedsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async createWard(dto, userId) {
        const ward = await this.prisma.ward.create({
            data: {
                name: dto.name,
                type: dto.type,
                departmentId: dto.departmentId,
                totalBeds: dto.totalBeds ?? 0,
            },
            include: {
                department: true,
            },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'WARD',
            resourceId: ward.id,
            newValues: dto,
        });
        return ward;
    }
    async listWards() {
        return this.prisma.ward.findMany({
            include: {
                department: true,
                beds: true,
            },
            orderBy: { name: 'asc' },
        });
    }
    async updateWard(id, dto, userId) {
        const existing = await this.prisma.ward.findUnique({ where: { id } });
        if (!existing) {
            throw new common_1.NotFoundException('Ward not found');
        }
        const ward = await this.prisma.ward.update({
            where: { id },
            data: dto,
            include: { department: true },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'WARD',
            resourceId: id,
            oldValues: existing,
            newValues: dto,
        });
        return ward;
    }
    async createBed(dto, userId) {
        const ward = await this.prisma.ward.findUnique({ where: { id: dto.wardId } });
        if (!ward) {
            throw new common_1.NotFoundException('Ward not found');
        }
        const existingBed = await this.prisma.bed.findUnique({ where: { bedNumber: dto.bedNumber } });
        if (existingBed) {
            throw new common_1.ConflictException('Bed number already exists');
        }
        const bed = await this.prisma.$transaction(async (tx) => {
            const created = await tx.bed.create({
                data: {
                    bedNumber: dto.bedNumber,
                    wardId: dto.wardId,
                    bedType: dto.bedType,
                    charges: dto.charges ?? 0,
                },
                include: { ward: true },
            });
            await tx.ward.update({
                where: { id: dto.wardId },
                data: { totalBeds: { increment: 1 } },
            });
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'BED',
            resourceId: bed.id,
            newValues: dto,
        });
        return bed;
    }
    async listBeds(filters) {
        return this.prisma.bed.findMany({
            where: {
                wardId: filters.wardId,
                status: filters.status,
            },
            include: { ward: true },
            orderBy: { bedNumber: 'asc' },
        });
    }
    async updateBedStatus(id, status, userId) {
        const bed = await this.prisma.bed.findUnique({
            where: { id },
            include: { ward: true },
        });
        if (!bed) {
            throw new common_1.NotFoundException('Bed not found');
        }
        const wasOccupied = bed.status === 'OCCUPIED';
        const becomesOccupied = status === 'OCCUPIED';
        const updated = await this.prisma.$transaction(async (tx) => {
            const next = await tx.bed.update({
                where: { id },
                data: { status: status },
                include: { ward: true },
            });
            if (bed.wardId && wasOccupied !== becomesOccupied) {
                const nextCount = Math.max(0, (bed.ward?.occupiedBeds ?? 0) + (becomesOccupied ? 1 : -1));
                await tx.ward.update({
                    where: { id: bed.wardId },
                    data: {
                        occupiedBeds: nextCount,
                    },
                });
            }
            return next;
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'BED_STATUS',
            resourceId: id,
            oldValues: { status: bed.status },
            newValues: { status },
        });
        return updated;
    }
    async getAvailableBeds(wardId) {
        return this.prisma.bed.findMany({
            where: {
                status: 'AVAILABLE',
                wardId,
            },
            include: { ward: true },
            orderBy: { updatedAt: 'desc' },
        });
    }
};
exports.BedsService = BedsService;
exports.BedsService = BedsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], BedsService);
//# sourceMappingURL=beds.service.js.map