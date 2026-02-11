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
exports.BillingService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let BillingService = class BillingService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async generateBill(dto, userId) {
        const subtotal = dto.items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0);
        const tax = Math.round(subtotal * 0.12);
        const discount = dto.discount ?? 0;
        const total = subtotal + tax - discount;
        const billNumber = `BILL-${Date.now()}`;
        const bill = await this.prisma.$transaction(async (tx) => {
            const created = await tx.bill.create({
                data: {
                    billNumber,
                    patientId: dto.patientId,
                    billType: dto.billType,
                    appointmentId: dto.appointmentId ?? null,
                    admissionId: dto.admissionId ?? null,
                    prescriptionId: dto.prescriptionId ?? null,
                    dueDate: new Date(dto.dueDate),
                    status: 'GENERATED',
                    subtotal,
                    tax,
                    discount,
                    totalAmount: total,
                },
            });
            await tx.billItem.createMany({
                data: dto.items.map((item) => ({
                    billId: created.id,
                    description: item.description,
                    quantity: item.quantity,
                    unitPrice: item.unitPrice,
                    totalPrice: item.quantity * item.unitPrice,
                })),
            });
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'BILL',
            resourceId: bill.id,
            newValues: dto,
        });
        return this.getBillById(bill.id);
    }
    getBillById(id) {
        return this.prisma.bill.findUnique({
            where: { id },
            include: {
                items: true,
                patient: { include: { user: true } },
                payments: true,
                insuranceClaims: true,
            },
        });
    }
    listBills(patientId) {
        return this.prisma.bill.findMany({
            where: patientId ? { patientId } : undefined,
            include: {
                patient: { include: { user: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async markStatus(id, status, userId) {
        const bill = await this.prisma.bill.findUnique({ where: { id } });
        if (!bill) {
            throw new common_1.NotFoundException('Bill not found');
        }
        const updated = await this.prisma.bill.update({
            where: { id },
            data: { status: status },
        });
        await this.audit.log({
            userId,
            action: 'UPDATE',
            resource: 'BILL_STATUS',
            resourceId: id,
            oldValues: { status: bill.status },
            newValues: { status },
        });
        return updated;
    }
};
exports.BillingService = BillingService;
exports.BillingService = BillingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], BillingService);
//# sourceMappingURL=billing.service.js.map