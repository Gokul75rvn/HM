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
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../common/prisma/prisma.service");
const audit_service_1 = require("../audit/audit.service");
let PaymentsService = class PaymentsService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    async create(dto, userId) {
        const bill = await this.prisma.bill.findUnique({ where: { id: dto.billId } });
        if (!bill)
            throw new common_1.NotFoundException('Bill not found');
        if (bill.patientId !== dto.patientId) {
            throw new common_1.BadRequestException('Bill does not belong to patient');
        }
        const outstanding = bill.totalAmount - bill.paidAmount;
        if (dto.amount > outstanding) {
            throw new common_1.BadRequestException('Amount exceeds outstanding balance');
        }
        const paymentNumber = `PAY-${Date.now()}`;
        const payment = await this.prisma.$transaction(async (tx) => {
            const created = await tx.payment.create({
                data: {
                    paymentNumber,
                    billId: dto.billId,
                    patientId: dto.patientId,
                    amount: dto.amount,
                    method: dto.method,
                    status: 'COMPLETED',
                    transactionId: dto.transactionId ?? null,
                    reference: dto.reference ?? null,
                },
            });
            const newPaidAmount = bill.paidAmount + dto.amount;
            await tx.bill.update({
                where: { id: dto.billId },
                data: {
                    paidAmount: newPaidAmount,
                    status: newPaidAmount >= bill.totalAmount ? 'PAID' : 'PARTIAL',
                },
            });
            return created;
        });
        await this.audit.log({
            userId,
            action: 'CREATE',
            resource: 'PAYMENT',
            resourceId: payment.id,
            newValues: dto,
        });
        return payment;
    }
    list(patientId) {
        return this.prisma.payment.findMany({
            where: patientId ? { patientId } : undefined,
            include: {
                bill: true,
            },
            orderBy: { createdAt: 'desc' },
        });
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map