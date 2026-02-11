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
exports.MedicinesService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let MedicinesService = class MedicinesService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        const existing = await this.prisma.medicine.findFirst({
            where: {
                OR: [{ name: dto.name }, { batchNumber: dto.batchNumber }],
            },
        });
        if (existing) {
            throw new common_1.ConflictException('Medicine with same name or batch already exists');
        }
        const medicine = await this.prisma.medicine.create({
            data: {
                name: dto.name,
                genericName: dto.genericName,
                composition: dto.composition,
                manufacturer: dto.manufacturer,
                batchNumber: dto.batchNumber,
                expiryDate: new Date(dto.expiryDate),
                unit: dto.unit,
                price: dto.price,
                stock: dto.stock,
                reorderLevel: dto.reorderLevel ?? 50,
            },
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'MEDICINE',
            resourceId: medicine.id,
            newValues: dto,
        });
        return medicine;
    }
    list(search) {
        return this.prisma.medicine.findMany({
            where: search
                ? {
                    OR: [
                        { name: { contains: search } },
                        { genericName: { contains: search } },
                    ],
                }
                : undefined,
            orderBy: [{ expiryDate: 'asc' }],
        });
    }
    async update(id, dto, userId) {
        const medicine = await this.prisma.medicine.findUnique({ where: { id } });
        if (!medicine) {
            throw new common_1.NotFoundException('Medicine not found');
        }
        const updated = await this.prisma.medicine.update({
            where: { id },
            data: {
                ...dto,
                expiryDate: dto.expiryDate ? new Date(dto.expiryDate) : undefined,
            },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'MEDICINE',
            resourceId: id,
            oldValues: medicine,
            newValues: dto,
        });
        return updated;
    }
    async getLowStock() {
        const medicines = await this.prisma.medicine.findMany();
        return medicines.filter((medicine) => medicine.stock <= medicine.reorderLevel);
    }
};
exports.MedicinesService = MedicinesService;
exports.MedicinesService = MedicinesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], MedicinesService);
//# sourceMappingURL=medicines.service.js.map