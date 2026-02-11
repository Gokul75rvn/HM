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
exports.PharmacyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let PharmacyService = class PharmacyService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    listQueue(status) {
        const defaultStatuses = ['PENDING', 'ISSUED', 'PARTIALLY_DISPENSED'];
        return this.prisma.prescription.findMany({
            where: {
                status: status ? status : { in: defaultStatuses },
            },
            include: {
                patient: { include: { user: true } },
                doctor: { include: { user: true } },
                medicines: { include: { medicine: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async dispense(dto, userId) {
        const prescription = await this.prisma.prescription.findUnique({
            where: { id: dto.prescriptionId },
            include: {
                medicines: { include: { medicine: true } },
            },
        });
        if (!prescription)
            throw new common_1.NotFoundException('Prescription not found');
        if (prescription.status === 'CANCELLED') {
            throw new common_1.BadRequestException('Cancelled prescription cannot be dispensed');
        }
        const medicineItems = prescription.medicines;
        const itemsMap = new Map(medicineItems.map((item) => [item.id, item]));
        const updated = await this.prisma.$transaction(async (tx) => {
            for (const item of dto.items) {
                const prescriptionItem = itemsMap.get(item.prescriptionItemId);
                if (!prescriptionItem) {
                    throw new common_1.BadRequestException('Invalid prescription item');
                }
                if (prescriptionItem.medicine.stock < item.quantity) {
                    throw new common_1.BadRequestException(`Insufficient stock for ${prescriptionItem.medicine.name}`);
                }
                await tx.medicine.update({
                    where: { id: prescriptionItem.medicineId },
                    data: {
                        stock: {
                            decrement: item.quantity,
                        },
                    },
                });
            }
            const status = dto.items.length === prescription.medicines.length ? 'FULLY_DISPENSED' : 'PARTIALLY_DISPENSED';
            return tx.prescription.update({
                where: { id: dto.prescriptionId },
                data: {
                    status: status,
                },
                include: {
                    patient: { include: { user: true } },
                    doctor: { include: { user: true } },
                    medicines: { include: { medicine: true } },
                },
            });
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'PRESCRIPTION_DISPENSE',
            resourceId: dto.prescriptionId,
            newValues: dto,
        });
        return updated;
    }
};
exports.PharmacyService = PharmacyService;
exports.PharmacyService = PharmacyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PharmacyService);
//# sourceMappingURL=pharmacy.service.js.map